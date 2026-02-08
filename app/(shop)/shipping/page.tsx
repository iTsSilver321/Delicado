"use client";

import { motion } from "framer-motion";
import { Truck, Clock, Package, Globe, RotateCcw, CheckCircle2 } from "lucide-react";

const shippingInfo = [
    {
        icon: Clock,
        title: "Processing Time",
        description: "Custom embroidered items take 5-7 business days to create. Each piece is carefully crafted by our artisans."
    },
    {
        icon: Truck,
        title: "Standard Shipping",
        description: "3-5 business days after production. Free on orders over $100, otherwise $8 flat rate."
    },
    {
        icon: Package,
        title: "Express Shipping",
        description: "1-2 business days after production. Available for $25 at checkout."
    },
    {
        icon: Globe,
        title: "International Shipping",
        description: "7-14 business days after production. Available to Canada and select European countries."
    }
];

const returnSteps = [
    { step: 1, title: "Contact Us", desc: "Email support@delicado.com within 48 hours of delivery with your order number and photos." },
    { step: 2, title: "Get Approval", desc: "Our team will review your case and issue a return authorization within 24 hours." },
    { step: 3, title: "Ship Back", desc: "Use the prepaid label we provide to return the item at no cost to you." },
    { step: 4, title: "Receive Resolution", desc: "Once received, we'll process your replacement or refund within 3 business days." }
];

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
};

export default function ShippingPage() {
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
                            <Truck className="w-4 h-4" />
                            <span className="text-sm font-medium">Shipping & Returns</span>
                        </motion.div>
                        <motion.h1 variants={fadeInUp} className="font-serif text-5xl md:text-6xl font-bold">
                            Shipping & <span className="text-primary">Returns</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Everything you need to know about getting your custom embroidered items to your door.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Shipping Options */}
            <section className="container pb-20">
                <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="font-serif text-3xl font-bold mb-8 text-center"
                >
                    Shipping Options
                </motion.h2>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={stagger}
                    className="grid md:grid-cols-2 gap-6"
                >
                    {shippingInfo.map((item, index) => (
                        <motion.div
                            key={index}
                            variants={fadeInUp}
                            className="bg-card rounded-2xl border p-6 flex items-start gap-4 hover:shadow-lg transition-shadow"
                        >
                            <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                                <item.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                                <p className="text-muted-foreground">{item.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Delivery Estimates Table */}
            <section className="container pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-card rounded-2xl border overflow-hidden"
                >
                    <div className="p-6 border-b">
                        <h2 className="font-serif text-2xl font-bold">Delivery Estimates</h2>
                        <p className="text-muted-foreground mt-1">Total time from order to doorstep</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-secondary/30">
                                <tr>
                                    <th className="text-left p-4 font-medium">Destination</th>
                                    <th className="text-left p-4 font-medium">Standard</th>
                                    <th className="text-left p-4 font-medium">Express</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                <tr>
                                    <td className="p-4">Continental US</td>
                                    <td className="p-4 text-muted-foreground">8-12 business days</td>
                                    <td className="p-4 text-muted-foreground">6-9 business days</td>
                                </tr>
                                <tr>
                                    <td className="p-4">Alaska & Hawaii</td>
                                    <td className="p-4 text-muted-foreground">10-15 business days</td>
                                    <td className="p-4 text-muted-foreground">8-11 business days</td>
                                </tr>
                                <tr>
                                    <td className="p-4">Canada</td>
                                    <td className="p-4 text-muted-foreground">12-18 business days</td>
                                    <td className="p-4 text-muted-foreground">10-14 business days</td>
                                </tr>
                                <tr>
                                    <td className="p-4">Europe (Select Countries)</td>
                                    <td className="p-4 text-muted-foreground">14-21 business days</td>
                                    <td className="p-4 text-muted-foreground">—</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </section>

            {/* Returns Section */}
            <section className="bg-secondary/30 py-20">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                            <RotateCcw className="w-4 h-4" />
                            <span className="text-sm font-medium">Returns Policy</span>
                        </div>
                        <h2 className="font-serif text-4xl font-bold mb-4">Returns & Exchanges</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Due to the custom nature of our products, we can only accept returns for quality issues or errors on our part.
                        </p>
                    </motion.div>

                    {/* What We Cover */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-card rounded-2xl border p-8 mb-8"
                    >
                        <h3 className="font-bold text-xl mb-6">What We Cover</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                "Items damaged during shipping",
                                "Manufacturing defects (loose threads, poor stitching)",
                                "Wrong item shipped",
                                "Spelling errors made by our team",
                                "Color significantly different from preview"
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Return Process */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                    >
                        <h3 className="font-bold text-xl mb-6 text-center">How to Return</h3>
                        <div className="grid md:grid-cols-4 gap-6">
                            {returnSteps.map((item) => (
                                <motion.div
                                    key={item.step}
                                    variants={fadeInUp}
                                    className="bg-card rounded-xl border p-6 text-center"
                                >
                                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center mx-auto mb-4">
                                        {item.step}
                                    </div>
                                    <h4 className="font-bold mb-2">{item.title}</h4>
                                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="container py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <h2 className="font-serif text-3xl font-bold mb-4">Need Help?</h2>
                    <p className="text-muted-foreground mb-6">
                        Questions about your shipment or need to start a return? We're here to help.
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
