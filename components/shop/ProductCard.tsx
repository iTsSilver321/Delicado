"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { StockBadge } from "./StockBadge";
import { WishlistButton } from "./WishlistButton";

interface ProductCardProps {
    product: {
        id: string;
        slug: string;
        name: string;
        description?: string;
        price: number;
        image_url: string;
        is_customizable?: boolean;
        stock_quantity?: number | null;
    };
    index?: number;
    isInWishlist?: boolean;
    isAuthenticated?: boolean;
}

export function ProductCard({ product, index = 0, isInWishlist = false, isAuthenticated = false }: ProductCardProps) {
    const isOutOfStock = product.stock_quantity !== null && product.stock_quantity !== undefined && product.stock_quantity <= 0;

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
                <div className={`bg-card rounded-2xl border overflow-hidden transition-shadow duration-300 group-hover:shadow-xl ${isOutOfStock ? 'opacity-75' : ''}`}>
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden bg-secondary/30">
                        {product.image_url ? (
                            <Image
                                src={product.image_url}
                                alt={product.name}
                                fill
                                className={`object-cover transition-transform duration-500 group-hover:scale-110 ${isOutOfStock ? 'grayscale' : ''}`}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="font-serif text-4xl text-primary/20">{product.name[0]}</span>
                            </div>
                        )}

                        {/* Overlay on Hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                        {/* Wishlist Button - Top Right */}
                        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <WishlistButton
                                productId={product.id}
                                productName={product.name}
                                initialIsInWishlist={isInWishlist}
                                isAuthenticated={isAuthenticated}
                                size="sm"
                            />
                        </div>

                        {/* Customizable Badge - Top Left */}
                        {product.is_customizable && (
                            <div className="absolute top-3 left-3 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                                Customizable
                            </div>
                        )}

                        {/* Stock Badge - Bottom Left - only show if low or out */}
                        {(product.stock_quantity !== null && product.stock_quantity !== undefined && product.stock_quantity <= 10) && (
                            <div className="absolute bottom-3 left-3">
                                <StockBadge
                                    stockQuantity={product.stock_quantity}
                                    className="backdrop-blur-sm"
                                    showIcon={false}
                                />
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
