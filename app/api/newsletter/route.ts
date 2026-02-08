import { NextResponse } from 'next/server';
import { resend, FROM_EMAIL } from '@/lib/resend';
import { WelcomeNewsletterEmail } from '@/lib/email-templates';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
        }

        const supabase = await createClient();

        // Check if already subscribed
        const { data: existing } = await supabase
            .from('newsletter_subscribers')
            .select('id, is_active')
            .eq('email', email.toLowerCase())
            .single();

        if (existing) {
            if (existing.is_active) {
                return NextResponse.json({ message: 'Already subscribed!' }, { status: 200 });
            }
            // Reactivate subscription
            await supabase
                .from('newsletter_subscribers')
                .update({ is_active: true })
                .eq('id', existing.id);
        } else {
            // Insert new subscriber
            const { error: insertError } = await supabase
                .from('newsletter_subscribers')
                .insert({ email: email.toLowerCase() });

            if (insertError) {
                console.error('Newsletter subscription error:', insertError);
                return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
            }
        }

        // Send welcome email
        try {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: email,
                subject: 'Welcome to Delicado! ✨',
                html: WelcomeNewsletterEmail(email),
            });
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
            // Don't fail the subscription if email fails
        }

        return NextResponse.json({ success: true, message: 'Successfully subscribed!' });

    } catch (error) {
        console.error('Newsletter API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
