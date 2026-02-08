import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { headers } from 'next/headers';
import Stripe from 'stripe';

export async function POST(request: Request) {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
        return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;
            const orderId = session.metadata?.order_id;

            if (orderId) {
                // Update order status to 'paid'
                const { error: updateError } = await supabaseAdmin
                    .from('orders')
                    .update({ 
                        status: 'paid',
                        stripe_payment_intent_id: session.payment_intent as string,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', orderId);

                if (updateError) {
                    console.error('Failed to update order status:', updateError);
                } else {
                    console.log(`Order ${orderId} marked as paid`);
                    
                    // Send order confirmation email
                    try {
                        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
                        await fetch(`${baseUrl}/api/send-order-email`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ orderId }),
                        });
                        console.log(`Order confirmation email triggered for ${orderId}`);
                    } catch (emailError) {
                        console.error('Failed to send order confirmation email:', emailError);
                    }
                }

                // Stock will be decremented by the database trigger
            }
            break;
        }

        case 'checkout.session.expired': {
            const session = event.data.object as Stripe.Checkout.Session;
            const orderId = session.metadata?.order_id;

            if (orderId) {
                // Mark order as cancelled
                await supabaseAdmin
                    .from('orders')
                    .update({ 
                        status: 'cancelled',
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', orderId);
                
                console.log(`Order ${orderId} cancelled due to expired session`);
            }
            break;
        }

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
