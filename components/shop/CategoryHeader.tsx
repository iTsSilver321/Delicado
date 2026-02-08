"use client";

import { motion } from "framer-motion";
import { Bed, Shirt, UtensilsCrossed } from "lucide-react";

const categoryIcons = {
    bedding: Bed,
    clothing: Shirt,
    tableware: UtensilsCrossed,
};

interface CategoryHeaderProps {
    title: string;
    description: string;
    category: "bedding" | "clothing" | "tableware";
}

export function CategoryHeader({ title, description, category }: CategoryHeaderProps) {
    const Icon = categoryIcons[category];

    return (
        <section className="relative py-16 md:py-20 overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(128,0,32,0.08),transparent_50%)]" />

            <div className="container text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4 max-w-2xl mx-auto"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="inline-flex items-center justify-center p-4 rounded-2xl bg-primary/10 text-primary mx-auto"
                    >
                        <Icon className="w-8 h-8" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="font-serif text-5xl md:text-6xl font-bold"
                    >
                        {title}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-muted-foreground"
                    >
                        {description}
                    </motion.p>
                </motion.div>
            </div>
        </section>
    );
}
