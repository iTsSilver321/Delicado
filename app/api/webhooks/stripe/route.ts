import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase/admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  typescript: true,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    if (!webhookSecret) {
        throw new Error("Missing STRIPE_WEBHOOK_SECRET in .env.local");
    }
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const {
        id: sessionId,
        amount_total,
        customer_details, 
        metadata
    } = session;

    const email = customer_details?.email;
    console.log(`Processing order for ${email}`);

    try {
        const orderId = metadata?.order_id;

        if (orderId) {
            // OPTION A: Update existing pending order
            console.log(`Updating existing order ${orderId} to paid`);
            
            const { error: updateError } = await supabaseAdmin
                .from('orders')
                .update({ 
                    status: 'paid',
                    user_email: email // Update email now that we have it from Stripe
                })
                .eq('id', orderId);

            if (updateError) throw updateError;
            console.log(`Order ${orderId} updated successfully.`);

        } else {
            // OPTION B: Fallback - Create new order (Legacy/Safety path)
            console.log('No order_id found in metadata, creating new order record.');
            
            const orderCustomizations = metadata?.order_summary ? JSON.parse(metadata.order_summary) : [];

            // 1. Create Order Record
            const { data: order, error: orderError } = await supabaseAdmin
                .from('orders')
                .insert({
                    user_email: email,
                    status: 'paid',
                    total: amount_total,
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Create Order Items details
            const orderItems = orderCustomizations.map((item: any) => ({
                order_id: order.id,
                product_id: item.id,
                customization_details: item.customization,
                quantity: 1 
            }));

            const { error: itemsError } = await supabaseAdmin
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;
            console.log(`Fallback order ${order.id} saved successfully.`);
        }

    } catch (error) {
        console.error('Error saving/updating order in Supabase:', error);
        return new NextResponse('Error saving order', { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}
