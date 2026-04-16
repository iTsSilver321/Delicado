"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { products, type DesignFamily } from "@/lib/products";
import { ProductCard } from "@/components/shop/ProductCard";

type FilterTab = 'all' | DesignFamily;

const tabs: { value: FilterTab; label: string }[] = [
    { value: 'all', label: 'All Products' },
    { value: 'branch', label: 'Branch' },
    { value: 'flower', label: 'Flower' },
];

export default function ShopPage() {
    const [activeTab, setActiveTab] = useState<FilterTab>('all');

    const filtered = activeTab === 'all'
        ? products
        : products.filter((p) => p.design === activeTab);

    return (
        <div className="container py-16 md:py-24">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-14"
            >
                <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Our Collection</h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Each piece is crafted with premium cotton and adorned with intricate embroidery.
                </p>
            </motion.div>

            {/* Filter Tabs — pill style with animated indicator */}
            <div className="flex justify-center mb-14">
                <div className="inline-flex bg-secondary/60 p-1 rounded-full">
                    {tabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setActiveTab(tab.value)}
                            className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                                activeTab === tab.value
                                    ? 'text-primary-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {activeTab === tab.value && (
                                <motion.div
                                    layoutId="activeShopTab"
                                    className="absolute inset-0 bg-primary rounded-full"
                                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                                />
                            )}
                            <span className="relative z-10">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Grid */}
            <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10"
            >
                {filtered.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                ))}
            </motion.div>
        </div>
    );
}
