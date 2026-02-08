"use client";

import { motion } from "framer-motion";
import { Shield, Eye, Cookie, Database, Lock, UserCheck } from "lucide-react";

const sections = [
    {
        id: "collection",
        icon: Database,
        title: "Information We Collect",
        content: `We collect information you provide directly to us, including:

**Personal Information**: Name, email address, shipping address, phone number, and payment information when you make a purchase.

**Order Information**: Customization details (text, font, color choices), order history, and communication records.

**Account Information**: If you create an account, we store your login credentials (password is encrypted) and preferences.

**Communication Data**: Emails, chat logs, and feedback you provide to our support team.`
    },
    {
        id: "usage",
        icon: Eye,
        title: "How We Use Your Information",
        content: `We use the information we collect to:

• **Process Orders**: Fulfill your customization requests and deliver products to you
• **Communicate**: Send order confirmations, shipping updates, and respond to inquiries
• **Improve Services**: Analyze usage patterns to enhance our website and offerings
• **Marketing**: Send promotional emails (only with your consent, and you can unsubscribe anytime)
• **Legal Compliance**: Meet our legal obligations and protect against fraud`
    },
    {
        id: "sharing",
        icon: UserCheck,
        title: "Information Sharing",
        content: `We do not sell your personal information. We share data only with:

**Service Providers**: Payment processors (Stripe), shipping carriers, and email services that help us operate our business.

**Legal Requirements**: When required by law, court order, or to protect our rights and safety.

**Business Transfers**: In the event of a merger, acquisition, or sale of assets, your information may be transferred.`
    },
    {
        id: "cookies",
        icon: Cookie,
        title: "Cookies & Tracking",
        content: `We use cookies and similar technologies to:

• Remember your cart items and preferences
• Analyze website traffic and performance
• Personalize your shopping experience

**Essential Cookies**: Required for the website to function (cart, checkout, authentication).

**Analytics Cookies**: Help us understand how visitors use our site (Google Analytics).

**Marketing Cookies**: Used to deliver relevant advertisements (optional, with consent).

You can manage cookie preferences through your browser settings.`
    },
    {
        id: "security",
        icon: Lock,
        title: "Data Security",
        content: `We implement industry-standard security measures:

• **Encryption**: All data transmitted is encrypted using TLS/SSL
• **Payment Security**: We use Stripe, which is PCI DSS Level 1 certified
• **Access Control**: Limited employee access to personal data on a need-to-know basis
• **Regular Audits**: Periodic security reviews and vulnerability assessments

While we strive to protect your data, no method of transmission over the internet is 100% secure.`
    },
    {
        id: "rights",
        icon: Shield,
        title: "Your Rights",
        content: `Depending on your location, you may have the right to:

• **Access**: Request a copy of the personal data we hold about you
• **Correction**: Update or correct inaccurate information
• **Deletion**: Request deletion of your personal data (subject to legal requirements)
• **Opt-Out**: Unsubscribe from marketing communications at any time
• **Portability**: Receive your data in a structured, machine-readable format

To exercise these rights, contact us at privacy@delicado.com.`
    }
];

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(128,0,32,0.08),transparent_50%)]" />
                <div className="container text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                        className="space-y-4"
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mx-auto">
                            <Shield className="w-4 h-4" />
                            <span className="text-sm font-medium">Legal</span>
                        </motion.div>
                        <motion.h1 variants={fadeInUp} className="font-serif text-5xl md:text-6xl font-bold">
                            Privacy <span className="text-primary">Policy</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Your privacy matters to us. This policy explains how we collect, use, and protect your information.
                        </motion.p>
                        <motion.p variants={fadeInUp} className="text-sm text-muted-foreground">
                            Last updated: February 2026
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className="container pb-20">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                        className="space-y-8"
                    >
                        {sections.map((section) => (
                            <motion.div
                                key={section.id}
                                variants={fadeInUp}
                                id={section.id}
                                className="bg-card rounded-2xl border p-8 scroll-mt-24"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                        <section.icon className="w-6 h-6" />
                                    </div>
                                    <h2 className="font-serif text-2xl font-bold">{section.title}</h2>
                                </div>
                                <div className="prose prose-neutral dark:prose-invert max-w-none">
                                    {section.content.split('\n\n').map((paragraph, i) => (
                                        <p key={i} className="text-muted-foreground whitespace-pre-line leading-relaxed">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Contact */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-12 bg-primary/5 rounded-2xl p-8 text-center"
                    >
                        <h2 className="font-serif text-2xl font-bold mb-4">Questions About Privacy?</h2>
                        <p className="text-muted-foreground mb-6">
                            If you have questions or concerns about our privacy practices, please contact our Data Protection Officer.
                        </p>
                        <a
                            href="mailto:privacy@delicado.com"
                            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                        >
                            privacy@delicado.com
                        </a>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
