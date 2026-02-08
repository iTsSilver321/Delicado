"use client";

import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Product {
    id: string;
    slug: string;
    name: string;
    description?: string;
    price: number;
    image_url: string;
    is_customizable?: boolean;
    category?: string;
    stock_quantity?: number | null;
}

interface ProductGridProps {
    products: Product[];
    wishlistProductIds?: string[];
    isAuthenticated?: boolean;
}

export function ProductGrid({ products, wishlistProductIds = [], isAuthenticated = false }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-secondary/20 rounded-3xl border border-dashed">
                <div className="p-4 bg-background rounded-full shadow-sm mb-4">
                    <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-2">No products found</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    We couldn&apos;t find any products matching your filters. Try adjusting your search criteria.
                </p>
                <Link href="/search">
                    <Button variant="outline">Clear Filters</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product, index) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    isInWishlist={wishlistProductIds.includes(product.id)}
                    isAuthenticated={isAuthenticated}
                />
            ))}
        </div>
    );
}

