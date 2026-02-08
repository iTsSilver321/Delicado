
import { NextResponse } from 'next/server';
import { resend, FROM_EMAIL } from '@/lib/resend';
import { OrderStatusEmail } from '@/lib/email-templates';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: Request) {
    try {
        const { orderId, status, trackingNumber, trackingUrl } = await request.json();

        if (!orderId || !status) {
            return NextResponse.json({ error: 'Order ID and Status are required' }, { status: 400 });
        }

        const supabase = supabaseAdmin;

        // Fetch order details
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('customer_email, customer_name, id')
            .eq('id', orderId)
            .single();

        if (orderError || !order) {
            console.error('Order fetch error:', orderError);
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Generate email HTML
        const emailHtml = OrderStatusEmail({
            orderId: order.id,
            customerName: order.customer_name,
            status: status,
            trackingNumber: trackingNumber,
            trackingUrl: trackingUrl
        });

        // Send email
        const { error: emailError } = await resend.emails.send({
            from: FROM_EMAIL,
            to: order.customer_email,
            subject: `Order Update #${orderId.slice(0, 8).toUpperCase()}: ${status.charAt(0).toUpperCase() + status.slice(1)} - Delicado`,
            html: emailHtml,
        });

        if (emailError) {
            console.error('Email send error:', emailError);
            return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Status update email sent!' });

    } catch (error) {
        console.error('Send status email error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
