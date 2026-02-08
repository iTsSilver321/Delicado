"use client";

import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ProductPreview } from "@/components/customizer/ProductPreview";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Helper to determine product type from name/slug (since we don't store slug in cart currently, we might need to infer or add it)
// Added 'productId' to cart item, but for ProductPreview we need 'pillow' | 'tshirt' | 'tablecloth'.
// We can infer from name or add 'type' to cart item. Inferring for now to avoid store breaking changes if possible.
function getProductType(name: string): 'pillow' | 'tshirt' | 'tablecloth' {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('robe') || lowerName.includes('shirt') || lowerName.includes('clothing')) return 'tshirt';
    if (lowerName.includes('table') || lowerName.includes('runner') || lowerName.includes('napkin')) return 'tablecloth';
    return 'pillow';
}

export default function CartPage() {
    const { items, removeItem, updateQuantity } = useCartStore();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleCheckout = () => {
        setIsLoading(true);
        router.push('/checkout');
    };

    return (
        <div className="container py-16 md:py-24 min-h-[80vh]">
            <div className="mb-10 text-center">
                <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Your Shopping Bag</h1>
                <p className="text-muted-foreground text-lg">
                    {items.length === 0 ? "Is currently empty" : `${items.length} item${items.length === 1 ? '' : 's'} ready for checkout`}
                </p>
            </div>

            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center space-y-6 py-12">
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
                        <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <Link href="/collections">
                        <Button size="lg" className="rounded-full px-8">
                            Start Shopping
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        <AnimatePresence mode="popLayout">
                            {items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex flex-col sm:flex-row gap-6 p-6 rounded-2xl bg-card border shadow-sm group hover:shadow-md transition-shadow"
                                >
                                    {/* Product Visual */}
                                    <div className="w-full sm:w-40 aspect-square rounded-xl overflow-hidden bg-muted relative shrink-0">
                                        {/* 
                                            If customized, render ProductPreview with customization. 
                                            If standard, render ProductPreview with empty customization (or just the image).
                                            Our updated ProductPreview handles customization prop.
                                        */}
                                        <ProductPreview
                                            productType={getProductType(item.name)}
                                            productImage={item.image}
                                            customization={item.isCustomized ? {
                                                text: item.customization.text,
                                                font: item.customization.font,
                                                color: item.customization.color,
                                                textSize: item.customization.textSize,
                                                position: item.customization.position
                                            } : {
                                                text: '',
                                                font: '',
                                                color: '',
                                                textSize: 0,
                                                position: { x: 0, y: 0 }
                                            }}
                                        />

                                        {!item.isCustomized && (
                                            <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                                        )}
                                    </div>

                                    {/* Item Details */}
                                    <div className="flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-serif text-xl font-bold">{item.name}</h3>
                                                <p className="text-muted-foreground text-sm flex items-center gap-2 mt-1">
                                                    {item.isCustomized ? (
                                                        <span className="flex items-center gap-1.5 text-primary bg-primary/10 px-2 py-0.5 rounded-full text-xs font-medium">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                            Customized
                                                        </span>
                                                    ) : (
                                                        <span className="text-secondary-foreground/70 bg-secondary px-2 py-0.5 rounded-full text-xs font-medium">Standard</span>
                                                    )}
                                                </p>
                                            </div>
                                            <p className="font-medium text-lg">
                                                ${((item.price * item.quantity) / 100).toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Customization Details */}
                                        {item.isCustomized && (
                                            <div className="mt-2 mb-4 p-3 bg-secondary/30 rounded-lg text-sm space-y-1 border border-transparent group-hover:border-border/50 transition-colors">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-muted-foreground">Text:</span>
                                                    <span className="font-medium font-serif">"{item.customization.text}"</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-muted-foreground">Font:</span>
                                                    <span>{item.customization.font}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-muted-foreground">Color:</span>
                                                    <div className="flex items-center gap-1.5">
                                                        <span
                                                            className="w-3 h-3 rounded-full border shadow-sm"
                                                            style={{ backgroundColor: item.customization.color }}
                                                        />
                                                        <span className="text-xs uppercase">{item.customization.color}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex-1" />

                                        {/* Controls */}
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center bg-secondary rounded-full border shadow-sm">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 rounded-l-full hover:bg-transparent hover:text-primary"
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                >
                                                    <Minus className="w-3.5 h-3.5" />
                                                </Button>
                                                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 rounded-r-full hover:bg-transparent hover:text-primary"
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full px-3"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 rounded-2xl border bg-card/50 backdrop-blur-sm p-6 shadow-lg">
                            <h2 className="font-serif text-2xl font-bold mb-6">Order Summary</h2>

                            <div className="space-y-3 text-sm mb-6">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-medium">${(subtotal / 100).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Est. Taxes</span>
                                    <span className="text-muted-foreground">Calculated at checkout</span>
                                </div>
                            </div>

                            <Separator className="mb-6" />

                            <div className="flex justify-between items-end mb-8">
                                <span className="text-lg font-medium">Total</span>
                                <span className="font-serif text-3xl font-bold">${(subtotal / 100).toFixed(2)}</span>
                            </div>

                            <Button
                                className="w-full h-14 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                                size="lg"
                                onClick={handleCheckout}
                                disabled={isLoading}
                            >
                                {isLoading ? "Processing..." : "Checkout"}
                                {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
                            </Button>

                            <div className="mt-6 space-y-3">
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <ShieldCheck className="w-4 h-4 text-primary" />
                                    <span>Secure SSL Encryption</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <Truck className="w-4 h-4 text-primary" />
                                    <span>Free Express Shipping</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
