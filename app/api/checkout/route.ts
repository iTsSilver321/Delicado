import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    isCustomized: boolean;
    customization?: {
        text: string;
        font: string;
        color: string;
        position: { x: number; y: number };
        textSize: number;
    };
}

interface CheckoutRequest {
    items: CartItem[];
    customerInfo: {
        name: string;
        email: string;
        phone: string;
        address: {
            line1: string;
            line2?: string;
            city: string;
            state: string;
            postal_code: string;
            country: string;
        };
    };
    paymentMethod: 'stripe' | 'cod';
    notes?: string;
}

export async function POST(request: Request) {
    try {
        const body: CheckoutRequest = await request.json();
        const { items, customerInfo, paymentMethod, notes } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
        }

        if (!customerInfo || !customerInfo.name || !customerInfo.email || !customerInfo.address) {
            return NextResponse.json({ error: 'Missing customer information. Please use the checkout page.' }, { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // Validate stock availability
        for (const item of items) {
            const { data: product } = await supabase
                .from('products')
                .select('stock_quantity, name')
                .eq('id', item.productId)
                .single();

            if (!product) {
                return NextResponse.json({ error: `Product not found: ${item.name}` }, { status: 400 });
            }

            if (product.stock_quantity !== null && product.stock_quantity < item.quantity) {
                return NextResponse.json({ 
                    error: `Insufficient stock for ${product.name}. Available: ${product.stock_quantity}` 
                }, { status: 400 });
            }
        }

        // Calculate totals
        const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
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

        // Create order items
        const orderItems = items.map(item => ({
            order_id: order.id,
            product_id: item.productId,
            product_name: item.name,
            quantity: item.quantity,
            unit_price: item.price,
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
            for (const item of items) {
                await supabase
                    .from('products')
                    .update({ stock_quantity: supabase.rpc('greatest', [0, `stock_quantity - ${item.quantity}`]) as any })
                    .eq('id', item.productId);
            }

            // Fallback: direct decrement
            for (const item of items) {
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

        const lineItems = items.map(item => {
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
                    unit_amount: item.price,
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
