import { NextResponse } from 'next/server';
import { resend, FROM_EMAIL } from '@/lib/resend';
import { OrderConfirmationEmail } from '@/lib/email-templates';
import { supabaseAdmin } from '@/lib/supabase/admin';

interface OrderData {
    id: string;
    customer_name: string;
    customer_email: string;
    subtotal: number;
    shipping: number;
    total: number;
    payment_method: 'stripe' | 'cod';
    shipping_address: {
        line1: string;
        line2?: string;
        city: string;
        state?: string;
        postal_code: string;
        country: string;
    };
    created_at: string;
    order_items: Array<{
        product_name: string;
        quantity: number;
        unit_price: number;
        customization?: {
            text?: string;
            font?: string;
            color?: string;
        } | null;
    }>;
}

export async function POST(request: Request) {
    try {
        const { orderId } = await request.json();

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }

        const supabase = supabaseAdmin;

        // Fetch order details
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    product_name,
                    quantity,
                    unit_price,
                    customization
                )
            `)
            .eq('id', orderId)
            .single();

        if (orderError || !order) {
            console.error('Order fetch error:', orderError);
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        const orderData = order as OrderData;

        // Generate email HTML
        const emailHtml = OrderConfirmationEmail({
            orderId: orderData.id,
            customerName: orderData.customer_name,
            customerEmail: orderData.customer_email,
            orderItems: orderData.order_items,
            subtotal: orderData.subtotal,
            shipping: orderData.shipping,
            total: orderData.total,
            paymentMethod: orderData.payment_method,
            shippingAddress: orderData.shipping_address,
            orderDate: orderData.created_at,
        });

        // Send email
        const { error: emailError } = await resend.emails.send({
            from: FROM_EMAIL,
            to: orderData.customer_email,
            subject: `Order Confirmed! #${orderId.slice(0, 8).toUpperCase()} - Delicado`,
            html: emailHtml,
        });

        if (emailError) {
            console.error('Email send error:', emailError);
            return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Order confirmation sent!' });

    } catch (error) {
        console.error('Send order email error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
