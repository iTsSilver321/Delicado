"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Product } from "@/lib/products";
import { WishlistButton } from "./WishlistButton";

interface ProductCardProps {
    product: Product;
    index?: number;
    isInWishlist?: boolean;
    isAuthenticated?: boolean;
}

export function ProductCard({ product, index = 0, isInWishlist = false, isAuthenticated = false }: ProductCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: [0.25, 0.1, 0.25, 1.0]
            }}
            className="group"
        >
            <div className="relative">
                <Link href={`/product/${product.slug}`} className="block">
                    {/* Image Container with hover swap */}
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-secondary/30 mb-4">
                        {/* Tucked image (default) */}
                        <Image
                            src={product.images.tucked}
                            alt={`${product.name} — folded view`}
                            fill
                            className="object-cover transition-all duration-700 ease-in-out group-hover:opacity-0 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {/* Normal/bed image (shown on hover) */}
                        <Image
                            src={product.images.normal}
                            alt={`${product.name} — on the bed`}
                            fill
                            className="object-cover transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {/* Subtle overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                    </div>
                </Link>

                {/* Wishlist button — floats top-right */}
                <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <WishlistButton
                        productId={product.id}
                        productName={product.name}
                        initialIsInWishlist={isInWishlist}
                        isAuthenticated={isAuthenticated}
                        variant="icon"
                        size="sm"
                    />
                </div>
            </div>

            {/* Content */}
            <Link href={`/product/${product.slug}`} className="block">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="font-serif text-base font-semibold group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                    <span
                        className="w-4 h-4 rounded-full border shadow-sm shrink-0"
                        style={{ backgroundColor: product.colorHex }}
                        title={product.color}
                    />
                </div>
                <p className="text-sm text-muted-foreground">
                    ${(product.price / 100).toFixed(2)}
                </p>
            </Link>
        </motion.div>
    );
}
