"use client";

import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, Truck, ShieldCheck, Undo2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const FREE_SHIPPING_THRESHOLD = 10000; // $100 in cents

function FreeShippingBar({ subtotal }: { subtotal: number }) {
    const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
    const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
    const qualified = remaining <= 0;

    return (
        <div className="mb-10">
            <div className="flex items-center justify-between text-sm mb-2">
                <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-primary" />
                    {qualified ? (
                        <span className="font-medium text-primary">You've unlocked free shipping! 🎉</span>
                    ) : (
                        <span className="text-muted-foreground">
                            <span className="font-medium text-foreground">${(remaining / 100).toFixed(2)}</span> away from free shipping
                        </span>
                    )}
                </div>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />
            </div>
        </div>
    );
}

export default function CartPage() {
    const { items, removeItem, updateQuantity } = useCartStore();
    const [isLoading, setIsLoading] = useState(false);
    const [confirmingRemove, setConfirmingRemove] = useState<string | null>(null);
    const router = useRouter();

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 999;
    const total = subtotal + shipping;
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

    const handleCheckout = () => {
        setIsLoading(true);
        router.push('/checkout');
    };

    const handleRemove = (itemId: string) => {
        if (confirmingRemove === itemId) {
            removeItem(itemId);
            setConfirmingRemove(null);
        } else {
            setConfirmingRemove(itemId);
            // Auto-dismiss after 3s
            setTimeout(() => setConfirmingRemove((prev) => prev === itemId ? null : prev), 3000);
        }
    };

    return (
        <div className="container py-16 md:py-24 min-h-[70vh]">
            <div className="text-center mb-6">
                <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Shopping Bag</h1>
                <p className="text-muted-foreground">
                    {items.length === 0 ? "Your bag is empty" : `${totalItems} item${totalItems === 1 ? '' : 's'} in your bag`}
                </p>
            </div>

            {/* Continue Shopping */}
            <div className="flex justify-center mb-10">
                <Link href="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Continue shopping
                </Link>
            </div>

            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center space-y-6 py-12">
                    <div className="w-24 h-24 rounded-full bg-secondary/60 flex items-center justify-center">
                        <ShoppingBag className="w-10 h-10 text-muted-foreground/40" />
                    </div>
                    <p className="text-muted-foreground">Start adding items to your bag</p>
                    <Link href="/shop">
                        <Button size="lg" className="rounded-full px-8 shadow-md">
                            Shop Now
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            ) : (
                <>
                    {/* Free Shipping Progress */}
                    <FreeShippingBar subtotal={subtotal} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-0 divide-y">
                            <AnimatePresence>
                                {items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, x: -40 }}
                                        className="flex gap-5 py-6"
                                    >
                                        <Link href={`/product/${item.slug}`} className="w-24 h-28 relative overflow-hidden rounded-xl bg-secondary/30 shrink-0">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                                        </Link>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <Link href={`/product/${item.slug}`}>
                                                        <h3 className="font-serif font-semibold hover:text-primary transition-colors">{item.name}</h3>
                                                    </Link>
                                                    <p className="text-sm text-muted-foreground mt-0.5">
                                                        ${(item.price / 100).toFixed(2)} each
                                                    </p>
                                                </div>
                                                <p className="font-semibold text-primary ml-4">
                                                    ${((item.price * item.quantity) / 100).toFixed(2)}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center bg-secondary rounded-full border shadow-sm">
                                                    <button
                                                        className="h-8 w-8 flex items-center justify-center hover:text-primary transition-colors"
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                    <button
                                                        className="h-8 w-8 flex items-center justify-center hover:text-primary transition-colors"
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>

                                                {/* Remove with confirmation */}
                                                <AnimatePresence mode="wait">
                                                    {confirmingRemove === item.id ? (
                                                        <motion.div
                                                            key="confirm"
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.9 }}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <button
                                                                onClick={() => handleRemove(item.id)}
                                                                className="text-xs font-medium text-destructive hover:underline"
                                                            >
                                                                Confirm
                                                            </button>
                                                            <button
                                                                onClick={() => setConfirmingRemove(null)}
                                                                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                                                            >
                                                                <Undo2 className="w-3 h-3" />
                                                                Cancel
                                                            </button>
                                                        </motion.div>
                                                    ) : (
                                                        <motion.button
                                                            key="remove"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            onClick={() => handleRemove(item.id)}
                                                            className="text-sm text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                            Remove
                                                        </motion.button>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 bg-card border rounded-2xl p-8 shadow-sm">
                                <h2 className="font-serif text-lg font-bold mb-6">Order Summary</h2>

                                <div className="space-y-3 text-sm mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Items ({totalItems})</span>
                                        <span className="font-medium">${(subtotal / 100).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Shipping</span>
                                        <span className={shipping === 0 ? "text-primary font-medium" : ""}>
                                            {shipping === 0 ? "Free" : `$${(shipping / 100).toFixed(2)}`}
                                        </span>
                                    </div>
                                </div>

                                <Separator className="mb-4" />

                                <div className="flex justify-between items-baseline mb-8">
                                    <span className="text-sm font-medium">Total</span>
                                    <span className="font-serif text-2xl font-bold text-primary">${(total / 100).toFixed(2)}</span>
                                </div>

                                <Button
                                    className="w-full h-13 text-base shadow-md hover:shadow-lg transition-all rounded-xl"
                                    size="lg"
                                    onClick={handleCheckout}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Processing..." : "Proceed to Checkout"}
                                    {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
                                </Button>

                                {/* Trust Badges */}
                                <div className="mt-6 pt-6 border-t flex flex-col gap-3 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Truck className="w-3.5 h-3.5 text-primary" />
                                        <span>{shipping === 0 ? "Free shipping on this order" : "Free shipping on orders over $100"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                                        <span>Secure checkout with SSL encryption</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
