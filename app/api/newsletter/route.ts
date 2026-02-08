import { NextResponse } from 'next/server';
import { resend, FROM_EMAIL } from '@/lib/resend';
import { WelcomeNewsletterEmail } from '@/lib/email-templates';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const schema = z.object({
    email: z.string().email("Valid email is required"),
    token: z.string().min(1, "Captcha token is required"),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = schema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
        }

        const { email, token } = result.data;

        // Verify Turnstile Token
        const formData = new FormData();
        formData.append('secret', process.env.TURNSTILE_SECRET_KEY!);
        formData.append('response', token);
        formData.append('remoteip', request.headers.get('x-forwarded-for') ?? '');

        const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: formData,
        });

        const turnstileData = await turnstileRes.json();
        if (!turnstileData.success) {
            return NextResponse.json({ error: 'Captcha validation failed' }, { status: 400 });
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
