"use client";

import { motion } from "framer-motion";
import { FileText, ShoppingCart, Palette, CreditCard, AlertTriangle, Scale } from "lucide-react";

const sections = [
    {
        id: "general",
        icon: FileText,
        title: "General Terms",
        content: `Welcome to Delicado. By accessing or using our website, you agree to be bound by these Terms of Service.

**Eligibility**: You must be at least 18 years old to make purchases. By using this site, you represent that you meet this requirement.

**Account Responsibility**: You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.

**Modifications**: We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance of the new terms.`
    },
    {
        id: "orders",
        icon: ShoppingCart,
        title: "Orders & Products",
        content: `**Pricing**: All prices are listed in USD and include applicable taxes unless otherwise stated. Prices are subject to change without notice.

**Order Acceptance**: Placing an order does not guarantee acceptance. We reserve the right to refuse or cancel orders for any reason, including product availability or suspected fraud.

**Product Descriptions**: We strive for accuracy in product descriptions and images. However, slight variations in color may occur between the preview and final embroidered product due to monitor settings and material differences.

**Customization Accuracy**: You are responsible for reviewing your customization (text, font, color) before completing your order. We embroider exactly what you submit.`
    },
    {
        id: "customization",
        icon: Palette,
        title: "Customization Guidelines",
        content: `**Acceptable Content**: Customizations must not contain:
• Profanity, hate speech, or threatening language
• Copyrighted material, trademarks, or logos you don't own
• Sexually explicit or violent content
• Content that violates any law

**Right to Refuse**: We reserve the right to refuse any customization that violates these guidelines without refund.

**Approval Process**: Orders containing potentially problematic content may be delayed for review. We will contact you if modifications are needed.`
    },
    {
        id: "payment",
        icon: CreditCard,
        title: "Payment & Billing",
        content: `**Payment Methods**: We accept major credit cards, debit cards, and digital wallets through Stripe.

**Authorization**: By providing payment information, you authorize us to charge the total amount including product price, shipping, and applicable taxes.

**Currency**: All transactions are processed in US Dollars. International orders may incur additional currency conversion fees from your bank.

**Failed Payments**: If payment fails, your order will not be processed. We will attempt to notify you to resolve the issue.`
    },
    {
        id: "liability",
        icon: AlertTriangle,
        title: "Limitation of Liability",
        content: `**Disclaimer of Warranties**: Products are provided "as is." We make no warranties, express or implied, regarding merchantability or fitness for a particular purpose.

**Limitation**: To the fullest extent permitted by law, Delicado shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our products or services.

**Maximum Liability**: Our total liability shall not exceed the amount you paid for the specific product giving rise to the claim.

**Force Majeure**: We are not liable for delays or failures due to circumstances beyond our control, including natural disasters, pandemics, or carrier delays.`
    },
    {
        id: "disputes",
        icon: Scale,
        title: "Disputes & Governing Law",
        content: `**Governing Law**: These terms are governed by the laws of the State of New York, United States, without regard to conflict of law principles.

**Dispute Resolution**: You agree to first attempt to resolve any dispute informally by contacting us at legal@delicado.com.

**Arbitration**: Any disputes not resolved informally shall be settled by binding arbitration in accordance with the American Arbitration Association rules.

**Class Action Waiver**: You agree that disputes will be resolved individually, and you waive the right to participate in class actions.`
    }
];

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
};

export default function TermsPage() {
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
                            <FileText className="w-4 h-4" />
                            <span className="text-sm font-medium">Legal</span>
                        </motion.div>
                        <motion.h1 variants={fadeInUp} className="font-serif text-5xl md:text-6xl font-bold">
                            Terms of <span className="text-primary">Service</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Please read these terms carefully before using our services.
                        </motion.p>
                        <motion.p variants={fadeInUp} className="text-sm text-muted-foreground">
                            Last updated: February 2026
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Table of Contents */}
            <section className="container pb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto bg-card rounded-2xl border p-6"
                >
                    <h2 className="font-bold text-lg mb-4">Table of Contents</h2>
                    <div className="grid sm:grid-cols-2 gap-2">
                        {sections.map((section, index) => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors py-1"
                            >
                                <span className="text-sm">{index + 1}.</span>
                                <span>{section.title}</span>
                            </a>
                        ))}
                    </div>
                </motion.div>
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
                        <h2 className="font-serif text-2xl font-bold mb-4">Questions About These Terms?</h2>
                        <p className="text-muted-foreground mb-6">
                            If you have questions about our Terms of Service, please contact our legal team.
                        </p>
                        <a
                            href="mailto:legal@delicado.com"
                            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                        >
                            legal@delicado.com
                        </a>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
