"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Award, Users, ArrowRight, Star } from "lucide-react";

const values = [
    {
        icon: Heart,
        title: "Crafted with Love",
        description: "Every stitch is placed with care. Our artisans pour their passion into each piece, ensuring your bedding feels as special as the moments you spend in it."
    },
    {
        icon: Sparkles,
        title: "Premium Quality",
        description: "We use only the finest long-staple cotton with 300+ thread counts and vibrant, colorfast embroidery threads that maintain their beauty wash after wash."
    },
    {
        icon: Award,
        title: "Attention to Detail",
        description: "From the precision of our high-density embroidery stitching to our meticulous quality checks, we obsess over the details so you don't have to."
    },
    {
        icon: Users,
        title: "Customer First",
        description: "Your satisfaction is our priority. From carefully packaged shipments to responsive support, every touchpoint is designed with you in mind."
    }
];

const stats = [
    { value: "10K+", label: "Happy Customers" },
    { value: "25K+", label: "Sets Sold" },
    { value: "2", label: "Signature Designs" },
    { value: "5★", label: "Average Rating" }
];

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
};

export default function AboutPage() {
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
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-medium">Our Story</span>
                        </motion.div>
                        <motion.h1 variants={fadeInUp} className="font-serif text-5xl md:text-6xl font-bold">
                            About <span className="text-primary">Delicado</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Where timeless craftsmanship meets modern elegance. We believe every thread tells a story—and every home deserves something extraordinary.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Story Section */}
            <section className="container pb-20">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <h2 className="font-serif text-4xl font-bold">
                            Bringing <span className="text-primary">Artisan Embroidery</span> Home
                        </h2>
                        <div className="space-y-4 text-muted-foreground">
                            <p>
                                Delicado was born from a simple belief: your bedroom should feel like a sanctuary. In a world of mass-produced basics, we wanted to bring back the art of beautiful, meaningful textiles—the kind that transform a bed into a centerpiece.
                            </p>
                            <p>
                                Our journey began in a small studio with a single embroidery machine and a passion for exquisite details. Today, we've grown into a team of dedicated artisans and designers, but our mission remains the same: to craft premium embroidered bedding that elevates everyday living.
                            </p>
                            <p>
                                Each Delicado set features hand-finished embroidery on luxurious long-staple cotton. Our two signature design families—Branch and Flower—are available in a curated palette of colors, allowing you to find the perfect match for your space.
                            </p>
                        </div>
                        <Button asChild size="lg" className="gap-2 rounded-xl">
                            <Link href="/shop">
                                Explore the Collection
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="aspect-square rounded-2xl overflow-hidden relative">
                            <Image
                                src="/assets/white_branch.jpeg"
                                alt="Delicado embroidered bedding on a bed"
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <p className="font-serif text-2xl font-bold">"Where every detail matters."</p>
                                <p className="text-white/80 text-sm mt-1">Our promise to you</p>
                            </div>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full -z-10" />
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/5 rounded-full -z-10" />
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="container pb-20">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={stagger}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={fadeInUp}
                            className="bg-card rounded-2xl border p-6 text-center"
                        >
                            <div className="font-serif text-4xl font-bold text-primary mb-2">{stat.value}</div>
                            <div className="text-muted-foreground">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Values Section */}
            <section className="container pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="font-serif text-4xl font-bold mb-4">What We <span className="text-primary">Stand For</span></h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Our values guide everything we do, from the cotton we source to the way we package every order.
                    </p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={stagger}
                    className="grid md:grid-cols-2 gap-6"
                >
                    {values.map((value, index) => (
                        <motion.div
                            key={index}
                            variants={fadeInUp}
                            className="bg-card rounded-2xl border p-6 flex gap-4 hover:shadow-md transition-shadow"
                        >
                            <div className="p-3 rounded-xl bg-primary/10 text-primary h-fit shrink-0">
                                <value.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-serif text-xl font-bold mb-2">{value.title}</h3>
                                <p className="text-muted-foreground">{value.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Testimonial Section */}
            <section className="container pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-primary/5 via-background to-primary/5 rounded-2xl border p-8 md:p-12"
                >
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="flex justify-center gap-1 mb-6">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
                            ))}
                        </div>
                        <blockquote className="font-serif text-2xl md:text-3xl font-medium mb-6">
                            "The embroidery is even more stunning in person. My bedroom feels like a luxury hotel now. Absolutely worth every penny."
                        </blockquote>
                        <div className="text-muted-foreground">
                            <span className="font-medium text-foreground">Sarah M.</span> — Verified Purchase
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* CTA Section */}
            <section className="container pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-primary rounded-2xl p-8 md:p-12 text-center text-primary-foreground"
                >
                    <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Ready to Elevate Your Bedroom?</h2>
                    <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
                        Discover our signature Branch and Flower collections. Premium cotton, exquisite embroidery, delivered to your door.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" variant="secondary" className="gap-2 rounded-xl">
                            <Link href="/shop">
                                Shop Now
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 rounded-xl">
                            <Link href="/contact">
                                Contact Us
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
