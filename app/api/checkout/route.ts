import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase/admin';

// Initialize Stripe with a fallback key for build time (it will fail at runtime if invalid)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_123', {
  typescript: true,
});

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: [item.image.startsWith('http') ? item.image : `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${item.image}`],
          metadata: {
            text: item.customization.text,
            font: item.customization.font,
            color: item.customization.color,
          },
          description: `Customization: ${item.customization.text} (${item.customization.font}, ${item.customization.color})`
        },
        unit_amount: item.price,
      },
      quantity: item.quantity,
    }));

    // 1. Create Pending Order in Supabase
    // Calculate total from items (assuming price is reliable from client for this MVP, 
    // but typically you'd re-fetch from DB or verify signature)
    const totalAmount = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_email: null, // We don't know email until they checkout on Stripe, or if logged in (not handled yet)
        status: 'pending',
        total: totalAmount,
      })
      .select()
      .single();

    if (orderError) throw new Error(`Error creating order: ${orderError.message}`);

    // 2. Create Order Items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId, // Ensure frontend sends this
      quantity: item.quantity,
      customization_details: item.customization,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw new Error(`Error creating order items: ${itemsError.message}`);

    // 3. Create Stripe Session
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      metadata: {
        order_id: order.id, // Link Stripe session to our DB order
        // Keep order_summary for redundancy/debugging if needed
        order_summary: JSON.stringify(items.map((i: any) => ({
             id: i.productId,
             customization: i.customization
        })))
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Error creating checkout session:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
