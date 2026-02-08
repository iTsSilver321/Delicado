"use client";

import { useCartStore } from "@/lib/store";
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
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function CartSheet() {
    const router = useRouter();
    const { items, isOpen, closeCart, removeItem, updateQuantity } = useCartStore();

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = subtotal >= 10000 ? 0 : 999;
    const total = subtotal + shipping;

    const handleCheckout = () => {
        closeCart();
        router.push('/checkout');
    };

    return (
        <Sheet open={isOpen} onOpenChange={closeCart}>
            <SheetContent className="w-full sm:w-[540px] flex flex-col pr-0 sm:max-w-none">
                <SheetHeader className="px-6 border-b pb-4">
                    <SheetTitle className="flex items-center gap-2 font-serif text-2xl">
                        <ShoppingBag className="w-5 h-5" />
                        Your Creation
                    </SheetTitle>
                    <SheetDescription>
                        Review your custom embroidered items before checkout.
                    </SheetDescription>
                </SheetHeader>

                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-4 px-6">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                            <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-xl font-medium text-muted-foreground">Your cart is empty</p>
                        <Button variant="outline" onClick={closeCart}>
                            Start Customizing
                        </Button>
                    </div>
                ) : (
                    <ScrollArea className="flex-1 px-6">
                        <div className="space-y-6 py-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    {/* Product Image */}
                                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border bg-muted shrink-0">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-semibold text-lg leading-none">{item.name}</h3>
                                                <p className="font-medium">
                                                    ${((item.price * item.quantity) / 100).toFixed(2)}
                                                </p>
                                            </div>

                                            {/* Customization Badges */}
                                            {item.isCustomized && item.customization?.text && (
                                                <div className="mt-2 text-sm text-muted-foreground space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-foreground">"{item.customization.text}"</span>
                                                        <span className="px-1.5 py-0.5 rounded-full bg-secondary text-[10px] uppercase tracking-wide">
                                                            {item.customization.font}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <span
                                                            className="w-3 h-3 rounded-full border shadow-sm"
                                                            style={{ backgroundColor: item.customization.color }}
                                                        />
                                                        <span>Thread Color</span>
                                                    </div>
                                                </div>
                                            )}
                                            {!item.isCustomized && (
                                                <p className="mt-1 text-sm text-muted-foreground">Standard product</p>
                                            )}
                                        </div>

                                        {/* Controls */}
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center bg-secondary rounded-md">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-r-none hover:bg-transparent"
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </Button>
                                                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-l-none hover:bg-transparent"
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </Button>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-muted-foreground hover:text-destructive h-8 px-2"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}

                {items.length > 0 && (
                    <SheetFooter className="border-t p-6 bg-background space-y-4 sm:space-y-0 flex-col !items-stretch">
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-base">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>${(subtotal / 100).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-base">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className={shipping === 0 ? "text-emerald-600 font-medium" : ""}>
                                    {shipping === 0 ? "Free" : `$${(shipping / 100).toFixed(2)}`}
                                </span>
                            </div>
                            {shipping > 0 && (
                                <p className="text-xs text-muted-foreground">Free shipping on orders over $100</p>
                            )}
                            <Separator className="my-2" />
                            <div className="flex justify-between text-xl font-serif font-bold">
                                <span>Total</span>
                                <span>${(total / 100).toFixed(2)}</span>
                            </div>
                        </div>

                        <Button
                            size="lg"
                            className="w-full text-lg h-12"
                            onClick={handleCheckout}
                        >
                            Proceed to Checkout
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                        <Button variant="outline" className="w-full" onClick={closeCart}>
                            Continue Shopping
                        </Button>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
}
