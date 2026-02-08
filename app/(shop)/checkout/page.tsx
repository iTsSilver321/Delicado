"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import {
    ShoppingBag,
    CreditCard,
    Banknote,
    Truck,
    ArrowLeft,
    Package,
    AlertCircle,
    Loader2
} from "lucide-react";

export default function CheckoutPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { items, clearCart } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cod">("stripe");

    const [customerInfo, setCustomerInfo] = useState({
        name: "",
        email: "",
        phone: "",
        address: {
            line1: "",
            line2: "",
            city: "",
            state: "",
            postal_code: "",
            country: "US",
        },
    });
    const [notes, setNotes] = useState("");

    useEffect(() => {
        setMounted(true);
        if (searchParams.get('cancelled') === 'true') {
            toast.error("Payment was cancelled. Your cart is still intact.");
        }
    }, [searchParams]);

    if (!mounted) {
        return (
            <div className="container py-16 flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="container py-16 min-h-[60vh]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md mx-auto text-center space-y-6"
                >
                    <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/40" />
                    <h1 className="font-serif text-2xl font-bold">Your cart is empty</h1>
                    <p className="text-muted-foreground">Add some items to checkout.</p>
                    <Button asChild>
                        <Link href="/collections">Browse Products</Link>
                    </Button>
                </motion.div>
            </div>
        );
    }

    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = subtotal >= 10000 ? 0 : 999;
    const total = subtotal + shipping;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (!customerInfo.address.line1 || !customerInfo.address.city || !customerInfo.address.postal_code) {
            toast.error("Please fill in your shipping address");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items,
                    customerInfo,
                    paymentMethod,
                    notes,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Checkout failed");
            }

            if (data.paymentMethod === "cod") {
                clearCart();
                router.push(data.redirectUrl);
            } else if (data.redirectUrl) {
                // Redirect to Stripe Checkout
                window.location.href = data.redirectUrl;
            }
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
            setIsLoading(false);
        }
    };

    return (
        <div className="container py-10 md:py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Link
                    href="/collections"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Continue Shopping
                </Link>

                <h1 className="font-serif text-3xl md:text-4xl font-bold mb-8">Checkout</h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid lg:grid-cols-[1fr_400px] gap-12">
                        {/* Left: Form */}
                        <div className="space-y-8">
                            {/* Contact Info */}
                            <div className="bg-card rounded-2xl border p-6 space-y-4">
                                <h2 className="font-serif text-xl font-bold flex items-center gap-2">
                                    <Package className="w-5 h-5 text-primary" />
                                    Contact Information
                                </h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input
                                            id="name"
                                            value={customerInfo.name}
                                            onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={customerInfo.email}
                                            onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                                            placeholder="john@example.com"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="phone">Phone *</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={customerInfo.phone}
                                            onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                                            placeholder="+1 (555) 123-4567"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-card rounded-2xl border p-6 space-y-4">
                                <h2 className="font-serif text-xl font-bold flex items-center gap-2">
                                    <Truck className="w-5 h-5 text-primary" />
                                    Shipping Address
                                </h2>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="address1">Address Line 1 *</Label>
                                        <Input
                                            id="address1"
                                            value={customerInfo.address.line1}
                                            onChange={(e) => setCustomerInfo({
                                                ...customerInfo,
                                                address: { ...customerInfo.address, line1: e.target.value }
                                            })}
                                            placeholder="123 Main Street"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="address2">Address Line 2</Label>
                                        <Input
                                            id="address2"
                                            value={customerInfo.address.line2}
                                            onChange={(e) => setCustomerInfo({
                                                ...customerInfo,
                                                address: { ...customerInfo.address, line2: e.target.value }
                                            })}
                                            placeholder="Apt 4B"
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="city">City *</Label>
                                            <Input
                                                id="city"
                                                value={customerInfo.address.city}
                                                onChange={(e) => setCustomerInfo({
                                                    ...customerInfo,
                                                    address: { ...customerInfo.address, city: e.target.value }
                                                })}
                                                placeholder="New York"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="state">State</Label>
                                            <Input
                                                id="state"
                                                value={customerInfo.address.state}
                                                onChange={(e) => setCustomerInfo({
                                                    ...customerInfo,
                                                    address: { ...customerInfo.address, state: e.target.value }
                                                })}
                                                placeholder="NY"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="postal">Postal Code *</Label>
                                            <Input
                                                id="postal"
                                                value={customerInfo.address.postal_code}
                                                onChange={(e) => setCustomerInfo({
                                                    ...customerInfo,
                                                    address: { ...customerInfo.address, postal_code: e.target.value }
                                                })}
                                                placeholder="10001"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-card rounded-2xl border p-6 space-y-4">
                                <h2 className="font-serif text-xl font-bold flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-primary" />
                                    Payment Method
                                </h2>
                                <RadioGroup
                                    value={paymentMethod}
                                    onValueChange={(v) => setPaymentMethod(v as "stripe" | "cod")}
                                    className="space-y-3"
                                >
                                    <label
                                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "stripe"
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50"
                                            }`}
                                    >
                                        <RadioGroupItem value="stripe" id="stripe" />
                                        <CreditCard className="w-6 h-6 text-primary" />
                                        <div className="flex-1">
                                            <p className="font-medium">Pay with Card</p>
                                            <p className="text-sm text-muted-foreground">Secure payment via Stripe</p>
                                        </div>
                                    </label>
                                    <label
                                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "cod"
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50"
                                            }`}
                                    >
                                        <RadioGroupItem value="cod" id="cod" />
                                        <Banknote className="w-6 h-6 text-emerald-600" />
                                        <div className="flex-1">
                                            <p className="font-medium">Cash on Delivery</p>
                                            <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                                        </div>
                                    </label>
                                </RadioGroup>
                            </div>

                            {/* Notes */}
                            <div className="bg-card rounded-2xl border p-6 space-y-4">
                                <h2 className="font-serif text-xl font-bold">Order Notes (Optional)</h2>
                                <Textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Any special instructions for your order..."
                                    rows={3}
                                />
                            </div>
                        </div>

                        {/* Right: Order Summary */}
                        <div className="lg:sticky lg:top-24 h-fit">
                            <div className="bg-card rounded-2xl border p-6 space-y-6">
                                <h2 className="font-serif text-xl font-bold">Order Summary</h2>

                                <div className="space-y-4 max-h-[300px] overflow-y-auto">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-secondary/30 flex-shrink-0">
                                                {item.image && (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Qty: {item.quantity}
                                                    {item.isCustomized && item.customization?.text && (
                                                        <span className="ml-2">• "{item.customization.text}"</span>
                                                    )}
                                                </p>
                                            </div>
                                            <p className="font-medium">
                                                ${((item.price * item.quantity) / 100).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t pt-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>${(subtotal / 100).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Shipping</span>
                                        <span>{shipping === 0 ? "Free" : `$${(shipping / 100).toFixed(2)}`}</span>
                                    </div>
                                    {shipping > 0 && (
                                        <p className="text-xs text-muted-foreground">
                                            Free shipping on orders over $100
                                        </p>
                                    )}
                                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                                        <span>Total</span>
                                        <span>${(total / 100).toFixed(2)}</span>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full h-14 text-lg"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                            Processing...
                                        </>
                                    ) : paymentMethod === "stripe" ? (
                                        <>
                                            <CreditCard className="w-5 h-5 mr-2" />
                                            Pay ${(total / 100).toFixed(2)}
                                        </>
                                    ) : (
                                        <>
                                            <Banknote className="w-5 h-5 mr-2" />
                                            Place Order (COD)
                                        </>
                                    )}
                                </Button>

                                <p className="text-xs text-center text-muted-foreground">
                                    By placing this order, you agree to our Terms of Service and Privacy Policy.
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
