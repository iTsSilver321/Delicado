interface OrderItem {
    product_name: string;
    quantity: number;
    unit_price: number;
    customization?: {
        text?: string;
        font?: string;
        color?: string;
    } | null;
}

interface OrderConfirmationProps {
    orderId: string;
    customerName: string;
    customerEmail: string;
    orderItems: OrderItem[];
    subtotal: number;
    shipping: number;
    total: number;
    paymentMethod: 'stripe' | 'cod';
    shippingAddress: {
        line1: string;
        line2?: string;
        city: string;
        state?: string;
        postal_code: string;
        country: string;
    };
    orderDate: string;
}

export function OrderConfirmationEmail({
    orderId,
    customerName,
    customerEmail,
    orderItems,
    subtotal,
    shipping,
    total,
    paymentMethod,
    shippingAddress,
    orderDate,
}: OrderConfirmationProps): string {
    const formattedDate = new Date(orderDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const itemsHtml = orderItems.map(item => `
        <tr>
            <td style="padding: 16px 0; border-bottom: 1px solid #e5e5e5;">
                <div style="font-weight: 600; color: #171717;">${item.product_name}</div>
                ${item.customization?.text ? `
                    <div style="font-size: 14px; color: #737373; margin-top: 4px;">
                        Customization: "${item.customization.text}"
                        ${item.customization.font ? ` • ${item.customization.font}` : ''}
                    </div>
                ` : ''}
                <div style="font-size: 14px; color: #737373; margin-top: 4px;">Qty: ${item.quantity}</div>
            </td>
            <td style="padding: 16px 0; border-bottom: 1px solid #e5e5e5; text-align: right; font-weight: 600;">
                $${((item.unit_price * item.quantity) / 100).toFixed(2)}
            </td>
        </tr>
    `).join('');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - Delicado</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 32px; text-align: center;">
            <h1 style="margin: 0; color: #c4a35a; font-size: 28px; font-weight: 700; letter-spacing: 2px;">
                DELICADO
            </h1>
            <p style="margin: 8px 0 0; color: #a3a3a3; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">
                Luxury Custom Embroidery
            </p>
        </div>

        <!-- Main Content -->
        <div style="padding: 40px 32px;">
            
            <!-- Success Icon -->
            <div style="text-align: center; margin-bottom: 32px;">
                <div style="display: inline-block; width: 64px; height: 64px; background-color: #dcfce7; border-radius: 50%; line-height: 64px;">
                    <span style="font-size: 32px;">✓</span>
                </div>
            </div>

            <!-- Greeting -->
            <h2 style="margin: 0 0 8px; color: #171717; font-size: 24px; font-weight: 600; text-align: center;">
                Thank You for Your Order!
            </h2>
            <p style="margin: 0 0 32px; color: #737373; text-align: center; font-size: 16px;">
                Hi ${customerName}, your order has been confirmed.
            </p>

            <!-- Order Info Box -->
            <div style="background-color: #fafafa; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0;">
                            <span style="color: #737373; font-size: 14px;">Order Number</span><br>
                            <span style="color: #171717; font-weight: 600; font-size: 14px;">#${orderId.slice(0, 8).toUpperCase()}</span>
                        </td>
                        <td style="padding: 8px 0; text-align: right;">
                            <span style="color: #737373; font-size: 14px;">Order Date</span><br>
                            <span style="color: #171717; font-weight: 600; font-size: 14px;">${formattedDate}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0;">
                            <span style="color: #737373; font-size: 14px;">Payment Method</span><br>
                            <span style="color: #171717; font-weight: 600; font-size: 14px;">
                                ${paymentMethod === 'cod' ? '💵 Cash on Delivery' : '💳 Card Payment'}
                            </span>
                        </td>
                        <td style="padding: 8px 0; text-align: right;">
                            <span style="color: #737373; font-size: 14px;">Status</span><br>
                            <span style="color: #16a34a; font-weight: 600; font-size: 14px;">
                                ${paymentMethod === 'cod' ? 'Confirmed' : 'Paid'}
                            </span>
                        </td>
                    </tr>
                </table>
            </div>

            <!-- Order Items -->
            <h3 style="margin: 0 0 16px; color: #171717; font-size: 18px; font-weight: 600;">
                Order Summary
            </h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                ${itemsHtml}
            </table>

            <!-- Totals -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
                <tr>
                    <td style="padding: 8px 0; color: #737373;">Subtotal</td>
                    <td style="padding: 8px 0; text-align: right; color: #171717;">$${(subtotal / 100).toFixed(2)}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #737373;">Shipping</td>
                    <td style="padding: 8px 0; text-align: right; color: ${shipping === 0 ? '#16a34a' : '#171717'};">
                        ${shipping === 0 ? 'Free' : `$${(shipping / 100).toFixed(2)}`}
                    </td>
                </tr>
                <tr>
                    <td style="padding: 16px 0 0; font-size: 18px; font-weight: 700; color: #171717; border-top: 2px solid #171717;">
                        Total
                    </td>
                    <td style="padding: 16px 0 0; text-align: right; font-size: 18px; font-weight: 700; color: #171717; border-top: 2px solid #171717;">
                        $${(total / 100).toFixed(2)}
                    </td>
                </tr>
            </table>

            <!-- Shipping Address -->
            <div style="background-color: #fafafa; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                <h3 style="margin: 0 0 12px; color: #171717; font-size: 16px; font-weight: 600;">
                    📦 Shipping Address
                </h3>
                <p style="margin: 0; color: #525252; line-height: 1.6;">
                    ${customerName}<br>
                    ${shippingAddress.line1}<br>
                    ${shippingAddress.line2 ? `${shippingAddress.line2}<br>` : ''}
                    ${shippingAddress.city}${shippingAddress.state ? `, ${shippingAddress.state}` : ''} ${shippingAddress.postal_code}<br>
                    ${shippingAddress.country}
                </p>
            </div>

            <!-- What's Next -->
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 24px; text-align: center;">
                <h3 style="margin: 0 0 8px; color: #92400e; font-size: 16px; font-weight: 600;">
                    🎨 What's Next?
                </h3>
                <p style="margin: 0; color: #a16207; font-size: 14px; line-height: 1.6;">
                    Our artisans are preparing your custom embroidered items with care.<br>
                    You'll receive a shipping confirmation email once your order is on its way.
                </p>
            </div>

        </div>

        <!-- Footer -->
        <div style="background-color: #fafafa; padding: 32px; text-align: center; border-top: 1px solid #e5e5e5;">
            <p style="margin: 0 0 16px; color: #737373; font-size: 14px;">
                Questions about your order?<br>
                <a href="mailto:support@delicado.com" style="color: #c4a35a; text-decoration: none;">support@delicado.com</a>
            </p>
            <p style="margin: 0; color: #a3a3a3; font-size: 12px;">
                © ${new Date().getFullYear()} Delicado. All rights reserved.<br>
                Luxury Custom Embroidery
            </p>
        </div>

    </div>
</body>
</html>
    `;
}

export function WelcomeNewsletterEmail(email: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Delicado</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 48px 32px; text-align: center;">
            <h1 style="margin: 0; color: #c4a35a; font-size: 32px; font-weight: 700; letter-spacing: 2px;">
                DELICADO
            </h1>
            <p style="margin: 12px 0 0; color: #a3a3a3; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">
                Welcome to the Family
            </p>
        </div>

        <!-- Main Content -->
        <div style="padding: 48px 32px; text-align: center;">
            
            <!-- Welcome Message -->
            <div style="margin-bottom: 32px;">
                <span style="font-size: 48px;">✨</span>
            </div>
            
            <h2 style="margin: 0 0 16px; color: #171717; font-size: 28px; font-weight: 600;">
                You're In!
            </h2>
            <p style="margin: 0 0 32px; color: #525252; font-size: 16px; line-height: 1.6;">
                Thank you for subscribing to our newsletter. You'll be the first to know about:
            </p>

            <!-- Benefits -->
            <div style="text-align: left; background-color: #fafafa; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                <div style="display: flex; align-items: center; margin-bottom: 16px; color: #171717;">
                    <span style="margin-right: 12px;">🎁</span>
                    <span><strong>Exclusive Discounts</strong> – Subscriber-only sales and early access</span>
                </div>
                <div style="display: flex; align-items: center; margin-bottom: 16px; color: #171717;">
                    <span style="margin-right: 12px;">✨</span>
                    <span><strong>New Collections</strong> – Be first to see new arrivals</span>
                </div>
                <div style="display: flex; align-items: center; color: #171717;">
                    <span style="margin-right: 12px;">💡</span>
                    <span><strong>Style Inspiration</strong> – Embroidery ideas and tips</span>
                </div>
            </div>

            <!-- CTA Button -->
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/collections" 
               style="display: inline-block; background-color: #1a1a1a; color: #ffffff; padding: 16px 32px; border-radius: 9999px; text-decoration: none; font-weight: 600; font-size: 16px;">
                Shop New Arrivals →
            </a>

        </div>

        <!-- Footer -->
        <div style="background-color: #fafafa; padding: 32px; text-align: center; border-top: 1px solid #e5e5e5;">
            <p style="margin: 0 0 8px; color: #a3a3a3; font-size: 12px;">
                © ${new Date().getFullYear()} Delicado. All rights reserved.
            </p>
            <p style="margin: 0; color: #a3a3a3; font-size: 12px;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/unsubscribe?email=${encodeURIComponent(email)}" 
                   style="color: #a3a3a3; text-decoration: underline;">Unsubscribe</a>
            </p>
        </div>

    </div>
</body>
</html>
    `;
}

export function WelcomeUserEmail(userName: string, email: string): string {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Delicado</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 48px 32px; text-align: center;">
            <h1 style="margin: 0; color: #c4a35a; font-size: 32px; font-weight: 700; letter-spacing: 2px;">
                DELICADO
            </h1>
            <p style="margin: 12px 0 0; color: #a3a3a3; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">
                Luxury Custom Embroidery
            </p>
        </div>

        <!-- Main Content -->
        <div style="padding: 48px 32px; text-align: center;">
            
            <!-- Welcome Icon -->
            <div style="margin-bottom: 24px;">
                <span style="font-size: 64px;">🎉</span>
            </div>
            
            <h2 style="margin: 0 0 16px; color: #171717; font-size: 28px; font-weight: 600;">
                Welcome, ${userName || 'Friend'}!
            </h2>
            <p style="margin: 0 0 32px; color: #525252; font-size: 16px; line-height: 1.6;">
                Your Delicado account is now active. Discover the art of personalized luxury embroidery.
            </p>

            <!-- Features Grid -->
            <div style="margin-bottom: 32px; text-align: left;">
                <div style="background-color: #fafafa; border-radius: 12px; padding: 20px; margin-bottom: 12px;">
                    <div style="color: #171717; font-weight: 600; margin-bottom: 4px;">🎨 Real-Time Customization</div>
                    <div style="color: #737373; font-size: 14px;">Preview your personalized embroidery before ordering</div>
                </div>
                <div style="background-color: #fafafa; border-radius: 12px; padding: 20px; margin-bottom: 12px;">
                    <div style="color: #171717; font-weight: 600; margin-bottom: 4px;">✨ Premium Quality</div>
                    <div style="color: #737373; font-size: 14px;">Hand-crafted embroidery on luxury fabrics</div>
                </div>
                <div style="background-color: #fafafa; border-radius: 12px; padding: 20px;">
                    <div style="color: #171717; font-weight: 600; margin-bottom: 4px;">🚚 Free Shipping</div>
                    <div style="color: #737373; font-size: 14px;">On all orders over $100</div>
                </div>
            </div>

            <!-- CTA Button -->
            <a href="${siteUrl}/products/bedding" 
               style="display: inline-block; background-color: #1a1a1a; color: #ffffff; padding: 16px 32px; border-radius: 9999px; text-decoration: none; font-weight: 600; font-size: 16px;">
                Start Shopping →
            </a>
            
            <p style="margin: 24px 0 0; color: #a3a3a3; font-size: 14px;">
                Or <a href="${siteUrl}/profile" style="color: #c4a35a; text-decoration: none;">complete your profile</a> to get personalized recommendations.
            </p>

        </div>

        <!-- Footer -->
        <div style="background-color: #fafafa; padding: 32px; text-align: center; border-top: 1px solid #e5e5e5;">
            <p style="margin: 0 0 8px; color: #737373; font-size: 14px;">
                Questions? We're here to help.<br>
                <a href="mailto:support@delicado.com" style="color: #c4a35a; text-decoration: none;">support@delicado.com</a>
            </p>
            <p style="margin: 0; color: #a3a3a3; font-size: 12px;">
                © ${new Date().getFullYear()} Delicado. All rights reserved.
            </p>
        </div>

    </div>
</body>
</html>
    `;
}

interface OrderStatusProps {
    orderId: string;
    customerName: string;
    status: string;
    trackingNumber?: string;
    trackingUrl?: string;
}

export function OrderStatusEmail({
    orderId,
    customerName,
    status,
    trackingNumber,
    trackingUrl,
}: OrderStatusProps): string {
    const statusMessages: Record<string, string> = {
        processing: "We're working on your order.",
        shipped: "Your order is on its way!",
        delivered: "Your order has been delivered.",
        cancelled: "Your order has been cancelled.",
    };

    const message = statusMessages[status.toLowerCase()] || `Your order status has been updated to ${status}.`;
    let color = '#171717';
    if (status.toLowerCase() === 'cancelled') color = '#ef4444';
    if (status.toLowerCase() === 'delivered') color = '#16a34a';
    if (status.toLowerCase() === 'shipped') color = '#2563eb';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Update - Delicado</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 32px; text-align: center;">
            <h1 style="margin: 0; color: #c4a35a; font-size: 28px; font-weight: 700; letter-spacing: 2px;">
                DELICADO
            </h1>
            <p style="margin: 8px 0 0; color: #a3a3a3; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">
                Order Update
            </p>
        </div>

        <!-- Main Content -->
        <div style="padding: 40px 32px; text-align: center;">
            
            <h2 style="margin: 0 0 16px; color: #171717; font-size: 24px; font-weight: 600;">
                ${message}
            </h2>
            <p style="margin: 0 0 32px; color: #737373; font-size: 16px;">
                Hi ${customerName}, here is the latest update on your order.
            </p>

            <!-- Status Box -->
            <div style="background-color: #fafafa; border-radius: 12px; padding: 24px; margin-bottom: 32px; border: 1px solid #e5e5e5;">
                <div style="font-size: 14px; color: #737373; margin-bottom: 8px;">Order Number</div>
                <div style="font-size: 18px; font-weight: 600; color: #171717; margin-bottom: 24px;">#${orderId.slice(0, 8).toUpperCase()}</div>
                
                <div style="font-size: 14px; color: #737373; margin-bottom: 8px;">Current Status</div>
                <div style="font-size: 24px; font-weight: 700; color: ${color}; text-transform: capitalize;">
                    ${status}
                </div>
            </div>

            ${trackingNumber ? `
                <div style="background-color: #eff6ff; border-radius: 12px; padding: 24px; margin-bottom: 32px; text-align: left; border: 1px solid #dbeafe;">
                    <h3 style="margin: 0 0 12px; color: #1e3a8a; font-size: 16px; font-weight: 600;">
                        🚚 Tracking Information
                    </h3>
                    <p style="margin: 0 0 8px; color: #1e40af; font-size: 14px;">
                        Tracking Number: <strong>${trackingNumber}</strong>
                    </p>
                    ${trackingUrl ? `
                        <div style="margin-top: 16px; text-align: center;">
                            <a href="${trackingUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">
                                Track Package
                            </a>
                        </div>
                    ` : ''}
                </div>
            ` : ''}

            <p style="margin: 0; color: #a3a3a3; font-size: 14px; line-height: 1.6;">
                You can also check the status of your order at any time by logging into your account.
            </p>
             <div style="margin-top: 24px;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/profile" style="color: #c4a35a; text-decoration: none; font-weight: 600;">
                    View My Account →
                </a>
            </div>

        </div>

        <!-- Footer -->
        <div style="background-color: #fafafa; padding: 32px; text-align: center; border-top: 1px solid #e5e5e5;">
            <p style="margin: 0 0 16px; color: #737373; font-size: 14px;">
                Questions? Reply to this email or contact support.<br>
                <a href="mailto:support@delicado.com" style="color: #c4a35a; text-decoration: none;">support@delicado.com</a>
            </p>
            <p style="margin: 0; color: #a3a3a3; font-size: 12px;">
                © ${new Date().getFullYear()} Delicado. All rights reserved.
            </p>
        </div>

    </div>
</body>
</html>
    `;
}
