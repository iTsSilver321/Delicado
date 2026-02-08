"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Loader2, Bed, Shirt, UtensilsCrossed } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Product {
    id: string;
    slug: string;
    name: string;
    price: number;
    category: string;
    image_url?: string;
}

interface SearchDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const categoryIcons: Record<string, React.ElementType> = {
    bedding: Bed,
    clothing: Shirt,
    tableware: UtensilsCrossed,
};

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
    const [mounted, setMounted] = useState(false);
    const [query, setQuery] = useState("");

    useEffect(() => {
        setMounted(true);
    }, []);
    const [results, setResults] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const router = useRouter();

    // Search products
    const searchProducts = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        setIsLoading(true);
        const supabase = createClient();

        const { data, error } = await supabase
            .from('products')
            .select('id, slug, name, price, category, image_url')
            .ilike('name', `%${searchQuery}%`)
            .limit(8);

        if (!error && data) {
            setResults(data);
        }
        setIsLoading(false);
    }, []);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            searchProducts(query);
        }, 300);

        return () => clearTimeout(timer);
    }, [query, searchProducts]);

    // Reset on close
    useEffect(() => {
        if (!isOpen) {
            setQuery("");
            setResults([]);
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setSelectedIndex((prev) => Math.max(prev - 1, 0));
                    break;
                case "Enter":
                    e.preventDefault();
                    if (results[selectedIndex]) {
                        navigateToProduct(results[selectedIndex].slug);
                    }
                    break;
                case "Escape":
                    onClose();
                    break;
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, results, selectedIndex, onClose]);

    const navigateToProduct = (slug: string) => {
        router.push(`/product/${slug}`);
        onClose();
    };

    // Quick links when no query
    const quickLinks = [
        { name: "Bedding", href: "/products/bedding", icon: Bed },
        { name: "Clothing", href: "/products/clothing", icon: Shirt },
        { name: "Tableware", href: "/products/tableware", icon: UtensilsCrossed },
    ];

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                    />

                    {/* Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed left-1/2 top-[10%] z-50 w-full max-w-xl -translate-x-1/2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mx-4 overflow-hidden rounded-2xl bg-background shadow-2xl border">
                            {/* Search Input */}
                            <div className="flex items-center border-b px-4">
                                <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => {
                                        setQuery(e.target.value);
                                        setSelectedIndex(0);
                                    }}
                                    placeholder="Search products..."
                                    autoFocus
                                    className="flex-1 bg-transparent px-4 py-4 text-lg outline-none placeholder:text-muted-foreground"
                                />
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                ) : query && (
                                    <button
                                        onClick={() => setQuery("")}
                                        className="p-1 hover:bg-secondary rounded-full"
                                    >
                                        <X className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                )}
                            </div>

                            {/* Results / Quick Links */}
                            <div className="max-h-[60vh] overflow-y-auto p-2">
                                {query.trim() ? (
                                    results.length > 0 ? (
                                        <div className="space-y-1">
                                            <p className="px-3 py-2 text-xs font-medium text-muted-foreground">
                                                Products
                                            </p>
                                            {results.map((product, index) => {
                                                const Icon = categoryIcons[product.category] || Bed;
                                                return (
                                                    <button
                                                        key={product.id}
                                                        onClick={() => navigateToProduct(product.slug)}
                                                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors ${index === selectedIndex
                                                            ? "bg-primary/10 text-primary"
                                                            : "hover:bg-secondary"
                                                            }`}
                                                    >
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary shrink-0 overflow-hidden">
                                                            {product.image_url ? (
                                                                <img
                                                                    src={product.image_url}
                                                                    alt={product.name}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <Icon className="h-5 w-5 text-muted-foreground" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium truncate">{product.name}</p>
                                                            <p className="text-sm text-muted-foreground capitalize">
                                                                {product.category}
                                                            </p>
                                                        </div>
                                                        <span className="text-sm font-medium">
                                                            ${(product.price / 100).toFixed(2)}
                                                        </span>
                                                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ) : !isLoading ? (
                                        <div className="py-12 text-center">
                                            <Search className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
                                            <p className="text-muted-foreground">No products found for "{query}"</p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Try a different search term
                                            </p>
                                        </div>
                                    ) : null
                                ) : (
                                    <div className="space-y-1">
                                        <p className="px-3 py-2 text-xs font-medium text-muted-foreground">
                                            Quick Links
                                        </p>
                                        {quickLinks.map((link) => (
                                            <button
                                                key={link.name}
                                                onClick={() => {
                                                    router.push(link.href);
                                                    onClose();
                                                }}
                                                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left hover:bg-secondary transition-colors"
                                            >
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                    <link.icon className="h-5 w-5 text-primary" />
                                                </div>
                                                <span className="font-medium">{link.name}</span>
                                                <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="border-t px-4 py-3 flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 rounded bg-secondary font-mono">↑</kbd>
                                        <kbd className="px-1.5 py-0.5 rounded bg-secondary font-mono">↓</kbd>
                                        to navigate
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 rounded bg-secondary font-mono">↵</kbd>
                                        to select
                                    </span>
                                </div>
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 rounded bg-secondary font-mono">esc</kbd>
                                    to close
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )
            }
        </AnimatePresence>,
        document.body
    );
}
