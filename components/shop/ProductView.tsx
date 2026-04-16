"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Product, getColorVariants, products } from "@/lib/products";
import {
    Minus, Plus, ShoppingBag, Truck, ShieldCheck, RotateCcw,
    ChevronRight, ChevronDown, Ruler, Sparkles, WashingMachine, MessageSquare
} from "lucide-react";
import { ReviewList, Review } from "./ReviewList";
import { StarRating } from "./StarRating";
import { WishlistButton } from "./WishlistButton";

interface ProductViewProps {
    product: Product;
}

// Reviews — connect to Supabase later
const reviews: Review[] = [];
const avgRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

// Accordion data
const productDetails = [
    {
        id: "materials",
        icon: Sparkles,
        title: "Details & Materials",
        content: "Made from 100% premium long-staple cotton with a 300+ thread count sateen weave. The embroidery is crafted using high-density stitching for exceptional detail and durability. Each set includes a duvet cover, fitted sheet, and two pillowcases."
    },
    {
        id: "sizing",
        icon: Ruler,
        title: "Sizing Guide",
        content: "Queen: Duvet 90\"×90\", Fitted Sheet 60\"×80\"+15\", Pillowcases 20\"×30\" (×2). King: Duvet 106\"×92\", Fitted Sheet 78\"×80\"+15\", Pillowcases 20\"×36\" (×2). Fits standard mattresses up to 15\" deep."
    },
    {
        id: "care",
        icon: WashingMachine,
        title: "Care Instructions",
        content: "Machine wash cold on a gentle cycle with like colors. Tumble dry on low heat. Do not bleach. Iron on low heat if needed, avoiding the embroidered areas. We recommend using a duvet cover protector for extended longevity."
    },
];

export function ProductView({ product }: ProductViewProps) {
    const [activeImage, setActiveImage] = useState<'tucked' | 'normal'>('tucked');
    const [quantity, setQuantity] = useState(1);
    const [isZoomed, setIsZoomed] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
    const [openAccordion, setOpenAccordion] = useState<string | null>("materials");
    const [showStickyBar, setShowStickyBar] = useState(false);

    const ctaRef = useRef<HTMLDivElement>(null);
    const colorVariants = getColorVariants(product);

    // "You may also like" — products from the other design family
    const otherDesignProducts = products.filter(p => p.design !== product.design).slice(0, 3);

    // Sticky bar on mobile — show when CTA scrolls out of view
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setShowStickyBar(!entry.isIntersecting),
            { threshold: 0 }
        );
        if (ctaRef.current) observer.observe(ctaRef.current);
        return () => observer.disconnect();
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePos({ x, y });
    };

    const handleAddToCart = () => {
        useCartStore.getState().addItem({
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.images.tucked,
            quantity,
        });

        toast.success("Added to cart", {
            description: `${product.name} × ${quantity}`,
        });
    };

    return (
        <>
            <div className="container py-10 md:py-16">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                    <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-foreground font-medium">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

                    {/* ─────── Left: Image Gallery (vertical thumbs on desktop) ─────── */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="sticky top-24">
                            <div className="flex gap-4">
                                {/* Vertical thumbnail strip (desktop only) */}
                                <div className="hidden md:flex flex-col gap-3">
                                    <button
                                        onClick={() => setActiveImage('tucked')}
                                        className={`relative w-[72px] h-[90px] rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                                            activeImage === 'tucked' ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-border'
                                        }`}
                                    >
                                        <Image src={product.images.tucked} alt="Folded view" fill className="object-cover" sizes="72px" />
                                    </button>
                                    <button
                                        onClick={() => setActiveImage('normal')}
                                        className={`relative w-[72px] h-[90px] rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                                            activeImage === 'normal' ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-border'
                                        }`}
                                    >
                                        <Image src={product.images.normal} alt="Room view" fill className="object-cover" sizes="72px" />
                                    </button>
                                </div>

                                {/* Main Image */}
                                <div
                                    className="relative aspect-[4/5] flex-1 rounded-2xl overflow-hidden bg-secondary/30 cursor-zoom-in"
                                    onMouseEnter={() => setIsZoomed(true)}
                                    onMouseLeave={() => setIsZoomed(false)}
                                    onMouseMove={handleMouseMove}
                                >
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeImage}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.4 }}
                                            className="absolute inset-0"
                                        >
                                            <Image
                                                src={product.images[activeImage]}
                                                alt={`${product.name} — ${activeImage === 'tucked' ? 'folded view' : 'on the bed'}`}
                                                fill
                                                priority
                                                className="object-cover transition-transform duration-300"
                                                style={{
                                                    transform: isZoomed ? `scale(1.8)` : 'scale(1)',
                                                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                                                }}
                                                sizes="(max-width: 1024px) 100vw, 50vw"
                                            />
                                        </motion.div>
                                    </AnimatePresence>

                                    {/* Image label pill */}
                                    <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium pointer-events-none">
                                        {activeImage === 'tucked' ? '📦 Product View' : '🛏️ Room View'}
                                    </div>
                                </div>
                            </div>

                            {/* Horizontal thumbnails (mobile only) */}
                            <div className="flex md:hidden gap-3 mt-4">
                                <button
                                    onClick={() => setActiveImage('tucked')}
                                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                                        activeImage === 'tucked' ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-border'
                                    }`}
                                >
                                    <Image src={product.images.tucked} alt="Folded view" fill className="object-cover" sizes="80px" />
                                </button>
                                <button
                                    onClick={() => setActiveImage('normal')}
                                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                                        activeImage === 'normal' ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-border'
                                    }`}
                                >
                                    <Image src={product.images.normal} alt="Room view" fill className="object-cover" sizes="80px" />
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* ─────── Right: Product Details ─────── */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <p className="text-primary text-sm font-medium tracking-[0.15em] uppercase">{product.design} Collection</p>
                            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">{product.name}</h1>

                            {/* Rating summary */}
                            {reviews.length > 0 ? (
                                <a href="#reviews" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                    <StarRating value={avgRating} readOnly size={16} />
                                    <span className="text-sm text-muted-foreground">
                                        {avgRating.toFixed(1)} ({reviews.length} review{reviews.length === 1 ? '' : 's'})
                                    </span>
                                </a>
                            ) : (
                                <a href="#reviews" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    No reviews yet — be the first
                                </a>
                            )}

                            <p className="text-3xl font-medium text-primary">${(product.price / 100).toFixed(2)}</p>
                            <p className="text-muted-foreground leading-relaxed text-lg">{product.description}</p>
                        </div>

                        {/* Color Variants */}
                        {colorVariants.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                                    Color — {product.color}
                                </h3>
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-full border-2 border-primary ring-2 ring-primary/20 cursor-default"
                                        style={{ backgroundColor: product.colorHex }}
                                        title={product.color}
                                    />
                                    {colorVariants.map((variant) => (
                                        <Link key={variant.id} href={`/product/${variant.slug}`}>
                                            <div
                                                className="w-10 h-10 rounded-full border-2 border-border hover:border-primary/50 transition-colors cursor-pointer"
                                                style={{ backgroundColor: variant.colorHex }}
                                                title={variant.color}
                                            />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity & Add to Cart */}
                        <div ref={ctaRef} className="space-y-4 pt-4 border-t">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Quantity</span>
                                <div className="flex items-center bg-secondary rounded-full border shadow-sm">
                                    <Button
                                        variant="ghost" size="icon"
                                        className="h-10 w-10 rounded-l-full hover:bg-transparent hover:text-primary"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </Button>
                                    <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                                    <Button
                                        variant="ghost" size="icon"
                                        className="h-10 w-10 rounded-r-full hover:bg-transparent hover:text-primary"
                                        onClick={() => setQuantity(quantity + 1)}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    size="lg"
                                    className="flex-1 text-lg h-14 shadow-md hover:shadow-lg transition-all rounded-xl"
                                    onClick={handleAddToCart}
                                >
                                    <ShoppingBag className="w-5 h-5 mr-2" />
                                    Add to Cart — ${((product.price * quantity) / 100).toFixed(2)}
                                </Button>
                                <WishlistButton
                                    productId={product.id}
                                    productName={product.name}
                                    variant="icon"
                                    size="lg"
                                    className="h-14 w-14 rounded-xl"
                                />
                            </div>
                        </div>

                        {/* Trust Info */}
                        <div className="flex flex-wrap gap-6 pt-4 border-t text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Truck className="w-4 h-4 text-primary" />
                                <span>Free Shipping</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-primary" />
                                <span>Premium Cotton</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <RotateCcw className="w-4 h-4 text-primary" />
                                <span>30-Day Returns</span>
                            </div>
                        </div>

                        {/* ─── Accordion: Details / Sizing / Care ─── */}
                        <div className="border-t pt-4 space-y-0 divide-y">
                            {productDetails.map((detail) => {
                                const Icon = detail.icon;
                                const isOpen = openAccordion === detail.id;

                                return (
                                    <div key={detail.id}>
                                        <button
                                            onClick={() => setOpenAccordion(isOpen ? null : detail.id)}
                                            className="flex items-center justify-between w-full py-4 text-left group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon className="w-4 h-4 text-primary" />
                                                <span className="text-sm font-medium">{detail.title}</span>
                                            </div>
                                            <ChevronDown
                                                className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                                            />
                                        </button>
                                        <AnimatePresence initial={false}>
                                            {isOpen && (
                                                <motion.div
                                                    key={detail.id}
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                    className="overflow-hidden"
                                                >
                                                    <p className="text-sm text-muted-foreground leading-relaxed pb-4 pl-7">
                                                        {detail.content}
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>

                {/* ─── Reviews Section ─── */}
                <section id="reviews" className="mt-24 pt-12 border-t scroll-mt-24">
                    {reviews.length > 0 ? (
                        <div className="grid lg:grid-cols-[280px_1fr] gap-12">
                            {/* Left — Rating Summary */}
                            <div className="text-center lg:text-left">
                                <p className="text-5xl font-bold text-primary mb-2">{avgRating.toFixed(1)}</p>
                                <StarRating value={avgRating} readOnly size={20} />
                                <p className="text-sm text-muted-foreground mt-2">
                                    Based on {reviews.length} review{reviews.length === 1 ? '' : 's'}
                                </p>
                            </div>

                            {/* Right — Review list */}
                            <ReviewList reviews={reviews} />
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/60 mb-5">
                                <MessageSquare className="w-7 h-7 text-muted-foreground/40" />
                            </div>
                            <h3 className="font-serif text-2xl font-bold mb-2">No Reviews Yet</h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                Be the first to share your experience with this product.
                                Your feedback helps others make informed decisions.
                            </p>
                        </div>
                    )}
                </section>

                {/* ─── You May Also Like ─── */}
                <section className="mt-24 pt-12 border-t">
                    <h2 className="font-serif text-2xl md:text-3xl font-bold mb-8">You May Also Like</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {otherDesignProducts.map((p, i) => (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link href={`/product/${p.slug}`} className="group block">
                                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-secondary/30 mb-4">
                                        <Image
                                            src={p.images.tucked}
                                            alt={p.name}
                                            fill
                                            className="object-cover transition-all duration-700 group-hover:opacity-0 group-hover:scale-105"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                        <Image
                                            src={p.images.normal}
                                            alt={`${p.name} on the bed`}
                                            fill
                                            className="object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-105"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-serif text-base font-semibold group-hover:text-primary transition-colors">
                                            {p.name}
                                        </h3>
                                        <span
                                            className="w-4 h-4 rounded-full border shadow-sm shrink-0"
                                            style={{ backgroundColor: p.colorHex }}
                                        />
                                    </div>
                                    <p className="text-sm text-muted-foreground">${(p.price / 100).toFixed(2)}</p>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>

            {/* ─── Sticky Add-to-Cart Bar (mobile) ─── */}
            <AnimatePresence>
                {showStickyBar && (
                    <motion.div
                        initial={{ y: 80, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 80, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/95 backdrop-blur-lg border-t shadow-2xl"
                    >
                        <div className="container flex items-center justify-between gap-4 py-3">
                            <div className="min-w-0">
                                <p className="text-sm font-semibold truncate">{product.name}</p>
                                <p className="text-primary font-medium">${(product.price / 100).toFixed(2)}</p>
                            </div>
                            <Button
                                size="lg"
                                className="rounded-xl shadow-md shrink-0 px-6"
                                onClick={handleAddToCart}
                            >
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                Add to Cart
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
