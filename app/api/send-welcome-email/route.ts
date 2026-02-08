import { NextResponse } from 'next/server';
import { resend, FROM_EMAIL } from '@/lib/resend';
import { WelcomeUserEmail } from '@/lib/email-templates';

export async function POST(request: Request) {
    try {
        const { email, name } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Send welcome email
        const { error: emailError } = await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: 'Welcome to Delicado! 🎉',
            html: WelcomeUserEmail(name || '', email),
        });

        if (emailError) {
            console.error('Welcome email send error:', emailError);
            return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Welcome email sent!' });

    } catch (error) {
        console.error('Send welcome email error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
