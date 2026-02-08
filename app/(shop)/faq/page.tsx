"use client";

import { motion } from "framer-motion";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Package, Paintbrush, Truck, RotateCcw, Sparkles } from "lucide-react";

const faqCategories = [
    {
        id: "ordering",
        icon: Package,
        title: "Ordering & Payment",
        questions: [
            {
                q: "How do I place an order?",
                a: "Simply browse our collection, select a product, customize it using our visual editor, and add it to your cart. Once ready, proceed to checkout where you can securely pay using credit/debit card or other payment methods."
            },
            {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards (Visa, Mastercard, American Express), debit cards, and digital wallets including Apple Pay and Google Pay through our secure Stripe payment system."
            },
            {
                q: "Can I modify my order after placing it?",
                a: "Orders can be modified within 2 hours of placement. Contact us immediately at support@delicado.com with your order number and requested changes."
            },
            {
                q: "Do you offer gift wrapping?",
                a: "Yes! At checkout, you can select our premium gift wrapping option for an additional $8. Your item will be beautifully wrapped with a personalized gift message."
            }
        ]
    },
    {
        id: "customization",
        icon: Paintbrush,
        title: "Customization",
        questions: [
            {
                q: "How does the customization process work?",
                a: "Our real-time visual customizer lets you type your text, choose from our curated embroidery fonts, and select thread colors. You'll see exactly how your design will look on the product before ordering."
            },
            {
                q: "What fonts are available for embroidery?",
                a: "We offer a range of embroidery-optimized fonts including Script, Block, Serif, and Modern styles. Each font is carefully selected to ensure beautiful stitch quality."
            },
            {
                q: "How many colors can I use?",
                a: "Each design can use one thread color. We offer over 30 premium thread colors including metallics like gold and silver."
            },
            {
                q: "Is there a character limit for text?",
                a: "Yes, we recommend keeping text under 20 characters for optimal appearance. Longer text may require smaller sizing which affects visibility."
            }
        ]
    },
    {
        id: "shipping",
        icon: Truck,
        title: "Shipping & Delivery",
        questions: [
            {
                q: "How long does shipping take?",
                a: "Custom embroidered items take 5-7 business days to produce, plus 3-5 business days for standard shipping. Express options are available at checkout."
            },
            {
                q: "Do you ship internationally?",
                a: "Currently, we ship to the United States, Canada, and select European countries. International orders may take 7-14 business days after production."
            },
            {
                q: "Is shipping free?",
                a: "Yes! We offer free standard shipping on all orders over $100. Orders under $100 have a flat $8 shipping fee."
            },
            {
                q: "Can I track my order?",
                a: "Absolutely! Once your order ships, you'll receive an email with tracking information. You can also track your order through your account dashboard."
            }
        ]
    },
    {
        id: "returns",
        icon: RotateCcw,
        title: "Returns & Exchanges",
        questions: [
            {
                q: "What is your return policy?",
                a: "Due to the custom nature of our products, we cannot accept returns for buyer's remorse. However, if there's a quality issue or error on our part, we'll remake or refund your order."
            },
            {
                q: "What if my item arrives damaged?",
                a: "Contact us within 48 hours of delivery with photos of the damage. We'll arrange a replacement or full refund at no extra cost."
            },
            {
                q: "What if there's a spelling error?",
                a: "We embroider exactly what you type in the customizer. Please double-check your text before ordering. Errors from customer input cannot be exchanged."
            }
        ]
    },
    {
        id: "care",
        icon: Sparkles,
        title: "Care Instructions",
        questions: [
            {
                q: "How do I care for embroidered items?",
                a: "Machine wash on gentle cycle with cold water. Turn items inside out to protect the embroidery. Tumble dry on low or air dry. Avoid bleach and harsh detergents."
            },
            {
                q: "Can embroidered items be ironed?",
                a: "Yes, but never iron directly over the embroidery. Use a pressing cloth or iron on the reverse side to protect the stitching."
            },
            {
                q: "How long will the embroidery last?",
                a: "Our premium rayon threads are colorfast and durable. With proper care, your embroidery will remain vibrant for years to come."
            }
        ]
    }
];

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
};

export default function FAQPage() {
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
                            <HelpCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Help Center</span>
                        </motion.div>
                        <motion.h1 variants={fadeInUp} className="font-serif text-5xl md:text-6xl font-bold">
                            Frequently Asked <span className="text-primary">Questions</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Find answers to common questions about ordering, customization, shipping, and more.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* FAQ Categories */}
            <section className="container pb-20">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={stagger}
                    className="space-y-8"
                >
                    {faqCategories.map((category) => (
                        <motion.div
                            key={category.id}
                            variants={fadeInUp}
                            className="bg-card rounded-2xl border p-6 md:p-8"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                    <category.icon className="w-6 h-6" />
                                </div>
                                <h2 className="font-serif text-2xl font-bold">{category.title}</h2>
                            </div>

                            <Accordion type="single" collapsible className="space-y-2">
                                {category.questions.map((item, index) => (
                                    <AccordionItem
                                        key={index}
                                        value={`${category.id}-${index}`}
                                        className="border rounded-lg px-4 data-[state=open]:bg-secondary/30 transition-colors"
                                    >
                                        <AccordionTrigger className="text-left hover:no-underline py-4">
                                            <span className="font-medium">{item.q}</span>
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground pb-4">
                                            {item.a}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Contact CTA */}
            <section className="container pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center"
                >
                    <h2 className="font-serif text-3xl font-bold mb-4">Still have questions?</h2>
                    <p className="text-muted-foreground mb-6">
                        Our support team is here to help you with any questions or concerns.
                    </p>
                    <a
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity"
                    >
                        Contact Support
                    </a>
                </motion.div>
            </section>
        </div>
    );
}
