"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./ProductCard";
import {
    Sparkles,
    Palette,
    ShoppingBag,
    ArrowRight,
    Bed,
    Shirt,
    UtensilsCrossed
} from "lucide-react";

interface Product {
    id: string;
    slug: string;
    name: string;
    description?: string;
    price: number;
    image_url: string;
    is_customizable?: boolean;
    category?: string;
}

interface CollectionClientProps {
    customizableProducts: Product[];
    readyMadeProducts: Product[];
}

const categories = [
    { name: "Bedding", icon: Bed, href: "/products/bedding", color: "from-rose-500/20 to-rose-500/5" },
    { name: "Clothing", icon: Shirt, href: "/products/clothing", color: "from-amber-500/20 to-amber-500/5" },
    { name: "Tableware", icon: UtensilsCrossed, href: "/products/tableware", color: "from-emerald-500/20 to-emerald-500/5" },
];

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
};

export function CollectionClient({ customizableProducts, readyMadeProducts }: CollectionClientProps) {
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
                        className="space-y-4 max-w-3xl mx-auto"
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mx-auto">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-medium">Our Collections</span>
                        </motion.div>
                        <motion.h1 variants={fadeInUp} className="font-serif text-5xl md:text-6xl font-bold">
                            Explore Our <span className="text-primary">Collection</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-lg text-muted-foreground">
                            Discover ready-to-ship pieces or create something uniquely yours with our customization studio.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Category Quick Links */}
            <section className="container pb-16">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={stagger}
                    className="grid md:grid-cols-3 gap-6"
                >
                    {categories.map((category) => (
                        <motion.div key={category.name} variants={fadeInUp}>
                            <Link href={category.href}>
                                <div className={`relative group rounded-2xl p-8 bg-gradient-to-br ${category.color} border hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-background shadow-sm">
                                            <category.icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-serif text-xl font-bold">{category.name}</h3>
                                            <p className="text-sm text-muted-foreground">Browse collection</p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 ml-auto text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Customizable Products Section */}
            <section className="container pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8"
                >
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
                            <Palette className="w-4 h-4" />
                            <span>Make It Yours</span>
                        </div>
                        <h2 className="font-serif text-4xl font-bold">Customizable Products</h2>
                        <p className="text-muted-foreground mt-2">
                            Design your perfect piece with our real-time customization studio.
                        </p>
                    </div>
                    <Link href="/product/bedding">
                        <Button size="lg" className="gap-2">
                            <Palette className="w-4 h-4" />
                            Start Customizing
                        </Button>
                    </Link>
                </motion.div>

                {customizableProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {customizableProducts.slice(0, 8).map((product, index) => (
                            <ProductCard key={product.id} product={product} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-card rounded-2xl border p-12 text-center">
                        <Palette className="w-12 h-12 text-primary/30 mx-auto mb-4" />
                        <h3 className="font-serif text-xl font-bold mb-2">Customizable Products Coming Soon</h3>
                        <p className="text-muted-foreground">
                            We're preparing an amazing collection of customizable items for you.
                        </p>
                    </div>
                )}
            </section>

            {/* Ready-Made Products Section */}
            <section className="bg-secondary/30 py-20">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8"
                    >
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
                                <ShoppingBag className="w-4 h-4" />
                                <span>Ready to Ship</span>
                            </div>
                            <h2 className="font-serif text-4xl font-bold">Ready-Made Collection</h2>
                            <p className="text-muted-foreground mt-2">
                                Beautifully crafted pieces ready for immediate delivery.
                            </p>
                        </div>
                    </motion.div>

                    {readyMadeProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {readyMadeProducts.slice(0, 8).map((product, index) => (
                                <ProductCard key={product.id} product={product} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-card rounded-2xl border p-12 text-center">
                            <ShoppingBag className="w-12 h-12 text-primary/30 mx-auto mb-4" />
                            <h3 className="font-serif text-xl font-bold mb-2">Ready-Made Items Coming Soon</h3>
                            <p className="text-muted-foreground mb-6">
                                In the meantime, explore our customizable collection!
                            </p>
                            <Link href="/product/bedding">
                                <Button>
                                    <Palette className="w-4 h-4 mr-2" />
                                    Customize Your Own
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="container py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-primary/5 rounded-3xl p-12 md:p-16 text-center"
                >
                    <h2 className="font-serif text-4xl font-bold mb-4">
                        Can't Find What You're Looking For?
                    </h2>
                    <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                        Our artisans can create custom pieces tailored to your exact specifications.
                        Contact us for special orders and bespoke creations.
                    </p>
                    <Link href="/contact">
                        <Button size="lg" variant="outline" className="gap-2">
                            Get in Touch
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </motion.div>
            </section>
        </div>
    );
}
