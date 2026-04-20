"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight, Loader2 } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { trackPurchase } from "@/lib/analytics";
import confetti from "canvas-confetti";

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("order_id");
    const sessionId = searchParams.get("session_id");
    const { items, clearCart } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const purchaseTracked = useRef(false);

    useEffect(() => {
        setMounted(true);

        // Track purchase event (once per order to avoid duplicates on refresh)
        if (orderId && !purchaseTracked.current && items.length > 0) {
            purchaseTracked.current = true;
            const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
            const shipping = subtotal >= 10000 ? 0 : 999;
            trackPurchase({
                orderId,
                total: subtotal + shipping,
                shipping,
                items: items.map((i) => ({
                    id: i.id,
                    name: i.name,
                    price: i.price,
                    quantity: i.quantity,
                })),
            });
        }

        // Clear cart on successful checkout
        clearCart();

        // Trigger confetti celebration
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#c4a35a', '#1a1a1a', '#ffffff']
        });
    }, [clearCart, orderId, items]);

    if (!mounted) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto text-center space-y-8"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-24 h-24 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center"
            >
                <CheckCircle className="w-12 h-12 text-emerald-500" />
            </motion.div>

            <div className="space-y-2">
                <h1 className="font-serif text-3xl md:text-4xl font-bold">Order Confirmed!</h1>
                <p className="text-muted-foreground text-lg">
                    Thank you for your purchase. We're preparing your order now.
                </p>
            </div>

            {orderId && (
                <div className="bg-card rounded-2xl border p-6 space-y-4">
                    <div className="flex items-center justify-center gap-2 text-primary">
                        <Package className="w-5 h-5" />
                        <span className="font-medium">Order Details</span>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Order Number</span>
                            <span className="font-mono text-xs">#{orderId.slice(0, 8).toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Status</span>
                            <span className="text-emerald-600 font-medium">Confirmed</span>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground pt-2 border-t">
                        You'll receive a confirmation email shortly with tracking details.
                    </p>
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline" size="lg">
                    <Link href="/profile">
                        View Order History
                    </Link>
                </Button>
                <Button asChild size="lg">
                    <Link href="/collections">
                        Continue Shopping
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </Button>
            </div>
        </motion.div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <div className="container py-16 md:py-24 min-h-[60vh]">
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
            }>
                <SuccessContent />
            </Suspense>
        </div>
    );
}
