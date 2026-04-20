"use client";

import { useCartStore } from "@/lib/store";
import { trackBeginCheckout } from "@/lib/analytics";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, ShoppingBag, ArrowRight, Trash2, Truck, Undo2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const FREE_SHIPPING_THRESHOLD = 10000; // $100 in cents

export function CartSheet() {
    const router = useRouter();
    const { items, isOpen, closeCart, removeItem, updateQuantity } = useCartStore();
    const [confirmingRemove, setConfirmingRemove] = useState<string | null>(null);

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 999;
    const total = subtotal + shipping;
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
    const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

    const handleCheckout = () => {
        trackBeginCheckout(items);
        closeCart();
        router.push('/checkout');
    };

    const handleRemove = (itemId: string) => {
        if (confirmingRemove === itemId) {
            removeItem(itemId);
            setConfirmingRemove(null);
        } else {
            setConfirmingRemove(itemId);
            setTimeout(() => setConfirmingRemove((prev) => prev === itemId ? null : prev), 3000);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={closeCart}>
            <SheetContent className="w-full sm:w-[440px] flex flex-col pr-0 sm:max-w-none">
                <SheetHeader className="px-6 pb-4 border-b">
                    <SheetTitle className="font-serif text-xl font-bold">Your Bag</SheetTitle>
                    <SheetDescription className="text-sm text-muted-foreground">
                        {items.length === 0
                            ? "Your cart is empty"
                            : `${totalItems} item${totalItems === 1 ? '' : 's'}`}
                    </SheetDescription>
                </SheetHeader>

                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-4 px-6">
                        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
                            <ShoppingBag className="w-8 h-8 text-muted-foreground/30" />
                        </div>
                        <p className="text-sm text-muted-foreground">Nothing here yet</p>
                        <Button size="sm" className="rounded-full" onClick={closeCart}>
                            Start Shopping
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Free Shipping Progress (compact) */}
                        <div className="px-6 pt-4 pb-2">
                            <div className="flex items-center gap-2 text-xs mb-1.5">
                                <Truck className="w-3.5 h-3.5 text-primary shrink-0" />
                                {remaining <= 0 ? (
                                    <span className="text-primary font-medium">Free shipping unlocked! 🎉</span>
                                ) : (
                                    <span className="text-muted-foreground">
                                        <span className="font-medium text-foreground">${(remaining / 100).toFixed(2)}</span> away from free shipping
                                    </span>
                                )}
                            </div>
                            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-primary rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${shippingProgress}%` }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                />
                            </div>
                        </div>

                        <ScrollArea className="flex-1 px-6">
                            <AnimatePresence>
                                <div className="divide-y py-2">
                                    {items.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            exit={{ opacity: 0, x: -30 }}
                                            className="flex gap-4 py-4"
                                        >
                                            <div className="relative w-18 h-20 overflow-hidden rounded-lg bg-secondary/30 shrink-0">
                                                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="72px" />
                                            </div>

                                            <div className="flex-1 flex flex-col justify-between min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-serif text-sm font-semibold truncate pr-2">{item.name}</h3>
                                                    <p className="text-sm font-semibold text-primary shrink-0">
                                                        ${((item.price * item.quantity) / 100).toFixed(2)}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center bg-secondary rounded-full border shadow-sm">
                                                        <button
                                                            className="h-7 w-7 flex items-center justify-center hover:text-primary transition-colors"
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                                                        <button
                                                            className="h-7 w-7 flex items-center justify-center hover:text-primary transition-colors"
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
                                                                className="flex items-center gap-1.5"
                                                            >
                                                                <button
                                                                    onClick={() => handleRemove(item.id)}
                                                                    className="text-[11px] font-medium text-destructive hover:underline"
                                                                >
                                                                    Confirm
                                                                </button>
                                                                <button
                                                                    onClick={() => setConfirmingRemove(null)}
                                                                    className="text-muted-foreground hover:text-foreground"
                                                                >
                                                                    <Undo2 className="w-3 h-3" />
                                                                </button>
                                                            </motion.div>
                                                        ) : (
                                                            <motion.button
                                                                key="remove"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                exit={{ opacity: 0 }}
                                                                className="text-muted-foreground hover:text-destructive transition-colors"
                                                                onClick={() => handleRemove(item.id)}
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </motion.button>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </AnimatePresence>
                        </ScrollArea>
                    </>
                )}

                {items.length > 0 && (
                    <SheetFooter className="border-t p-6 bg-background flex-col !items-stretch space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Items ({totalItems})</span>
                                <span className="font-medium">${(subtotal / 100).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className={shipping === 0 ? "text-primary font-medium" : ""}>
                                    {shipping === 0 ? "Free" : `$${(shipping / 100).toFixed(2)}`}
                                </span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between items-baseline">
                                <span className="text-sm font-medium">Total</span>
                                <span className="font-serif text-xl font-bold text-primary">${(total / 100).toFixed(2)}</span>
                            </div>
                        </div>

                        <Button size="lg" className="w-full shadow-md rounded-xl" onClick={handleCheckout}>
                            Checkout
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={closeCart}>
                            Continue Shopping
                        </Button>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
}
