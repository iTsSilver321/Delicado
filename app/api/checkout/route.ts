import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { z } from 'zod';

const cartItemSchema = z.object({
    id: z.string(),
    productId: z.string(),
    name: z.string(),
    price: z.number(),
    image: z.string().optional(),
    quantity: z.number().int().positive(),
    isCustomized: z.boolean(),
    customization: z.object({
        text: z.string(),
        font: z.string(),
        color: z.string(),
        position: z.object({ x: z.number(), y: z.number() }),
        textSize: z.number(),
    }).optional(),
});

const checkoutRequestSchema = z.object({
    items: z.array(cartItemSchema).min(1, "No items in cart"),
    customerInfo: z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Valid email is required"),
        phone: z.string().min(1, "Phone is required"),
        address: z.object({
            line1: z.string().min(1, "Address line 1 is required"),
            line2: z.string().optional(),
            city: z.string().min(1, "City is required"),
            state: z.string().min(1, "State is required"),
            postal_code: z.string().min(1, "Postal code is required"),
            country: z.string().min(1, "Country is required"),
        }),
    }),
    paymentMethod: z.enum(['stripe', 'cod']),
    notes: z.string().optional(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = checkoutRequestSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
        }

        const { items, customerInfo, paymentMethod, notes } = result.data;

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // 1. Fetch all products from DB to get trusted prices and stock
        const productIds = items.map(item => item.productId);
        const { data: dbProducts, error: productsError } = await supabase
            .from('products')
            .select('id, name, price, stock_quantity')
            .in('id', productIds);

        if (productsError || !dbProducts) {
            console.error('Error fetching products:', productsError);
            return NextResponse.json({ error: 'Failed to validate products' }, { status: 500 });
        }

        // 2. Map items to trusted DB data
        const validatedItems = [];
        for (const item of items) {
            const dbProduct = dbProducts.find(p => p.id === item.productId);
            
            if (!dbProduct) {
                return NextResponse.json({ error: `Product not found: ${item.name}` }, { status: 400 });
            }

            // Check stock
            if (dbProduct.stock_quantity !== null && dbProduct.stock_quantity < item.quantity) {
                return NextResponse.json({ 
                    error: `Insufficient stock for ${dbProduct.name}. Available: ${dbProduct.stock_quantity}` 
                }, { status: 400 });
            }

            validatedItems.push({
                ...item,
                // OVERRIDE price and name from DB to prevent manipulation
                price: dbProduct.price, 
                name: dbProduct.name 
            });
        }

        // 3. Calculate totals using TRUSTED prices
        const subtotal = validatedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const shipping = subtotal >= 10000 ? 0 : 999; // Free shipping over $100
        const total = subtotal + shipping;

        // Create order in database
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: user?.id || null,
                payment_method: paymentMethod,
                status: paymentMethod === 'cod' ? 'confirmed' : 'pending',
                subtotal,
                shipping,
                total,
                shipping_address: customerInfo.address,
                customer_name: customerInfo.name,
                customer_email: customerInfo.email,
                customer_phone: customerInfo.phone,
                notes,
            })
            .select()
            .single();

        if (orderError) {
            console.error('Order creation error:', orderError);
            return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
        }

        // Create order items using VALIDATED items
        const orderItems = validatedItems.map(item => ({
            order_id: order.id,
            product_id: item.productId,
            product_name: item.name,
            quantity: item.quantity,
            unit_price: item.price, // Trusted price
            customization: item.isCustomized ? item.customization : null,
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

        if (itemsError) {
            console.error('Order items creation error:', itemsError);
            await supabase.from('orders').delete().eq('id', order.id);
            return NextResponse.json({ error: 'Failed to create order items' }, { status: 500 });
        }

        // Handle Cash on Delivery
        if (paymentMethod === 'cod') {
            // Decrement stock immediately for COD orders
            for (const item of validatedItems) {
                await supabase
                    .from('products')
                    .update({ stock_quantity: supabase.rpc('greatest', [0, `stock_quantity - ${item.quantity}`]) as any })
                    .eq('id', item.productId);
            }

            // Fallback: direct decrement
            for (const item of validatedItems) {
                const { data: product } = await supabase
                    .from('products')
                    .select('stock_quantity')
                    .eq('id', item.productId)
                    .single();
                
                if (product && product.stock_quantity !== null) {
                    await supabase
                        .from('products')
                        .update({ stock_quantity: Math.max(0, product.stock_quantity - item.quantity) })
                        .eq('id', item.productId);
                }
            }

            // Send order confirmation email (fire and forget)
            try {
                const origin = (await headers()).get('origin') || 'http://localhost:3000';
                fetch(`${origin}/api/send-order-email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orderId: order.id }),
                }).catch(console.error);
            } catch (e) {
                console.error('Failed to trigger order email:', e);
            }

            return NextResponse.json({ 
                success: true,
                orderId: order.id,
                paymentMethod: 'cod',
                redirectUrl: `/checkout/success?order_id=${order.id}`
            });
        }

        // Stripe checkout
        const origin = (await headers()).get('origin') || 'http://localhost:3000';

        const lineItems = validatedItems.map(item => {
            // Only use image if it's a valid full URL (Stripe requires absolute URLs)
            const imageUrl = item.image && item.image.startsWith('http') ? item.image : null;
            
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                        description: item.isCustomized 
                            ? `Custom embroidery: "${item.customization?.text || ''}"` 
                            : 'Standard product',
                        ...(imageUrl ? { images: [imageUrl] } : {}),
                    },
                    unit_amount: item.price, // Trusted price
                },
                quantity: item.quantity,
            };
        });

        if (shipping > 0) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Shipping',
                        description: 'Standard shipping (Free over $100)',
                        images: [],
                    },
                    unit_amount: shipping,
                },
                quantity: 1,
            });
        }

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: lineItems,
            customer_email: customerInfo.email,
            metadata: {
                order_id: order.id,
            },
            success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
            cancel_url: `${origin}/checkout?cancelled=true`,
        });

        await supabase
            .from('orders')
            .update({ stripe_session_id: session.id })
            .eq('id', order.id);

        return NextResponse.json({ 
            success: true,
            orderId: order.id,
            paymentMethod: 'stripe',
            sessionId: session.id,
            redirectUrl: session.url
        });

    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
