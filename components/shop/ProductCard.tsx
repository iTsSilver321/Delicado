"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface ProductCardProps {
    product: {
        id: string;
        slug: string;
        name: string;
        description?: string;
        price: number;
        image_url: string;
        is_customizable?: boolean;
    };
    index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.25, 0.1, 0.25, 1.0]
            }}
            whileHover={{ y: -8 }}
            className="group"
        >
            <Link href={`/product/${product.slug}`} className="block">
                <div className="bg-card rounded-2xl border overflow-hidden transition-shadow duration-300 group-hover:shadow-xl">
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden bg-secondary/30">
                        {product.image_url ? (
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="font-serif text-4xl text-primary/20">{product.name[0]}</span>
                            </div>
                        )}

                        {/* Overlay on Hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                        {/* Customizable Badge */}
                        {product.is_customizable && (
                            <div className="absolute top-3 left-3 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                                Customizable
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2">
                        <h3 className="font-serif text-lg font-bold group-hover:text-primary transition-colors">
                            {product.name}
                        </h3>

                        <div className="flex items-center justify-between">
                            <span className="text-lg font-medium">
                                ${(product.price / 100).toFixed(2)}
                            </span>

                            {/* Star Rating */}
                            <div className="flex items-center gap-1 text-yellow-500">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span className="text-xs text-muted-foreground">4.9</span>
                            </div>
                        </div>

                        {product.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {product.description}
                            </p>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
