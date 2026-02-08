"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { useCartStore } from "@/lib/store";
import { useSearchParams } from "next/navigation";
import { Suspense } from 'react';

function SuccessContent() {
    const clearCart = useCartStore((state) => state.clearCart);
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");

    useEffect(() => {
        if (sessionId) {
            clearCart();
        }
    }, [sessionId, clearCart]);

    return (
        <div className="container min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <CheckCircle className="w-12 h-12" />
            </div>
            <h1 className="text-4xl font-serif font-bold">Order Confirmed!</h1>
            <p className="text-lg text-muted-foreground max-w-md">
                Thank you for your purchase. We have received your order and will begin crafting your personalized items immediately.
            </p>
            <div className="flex gap-4">
                <Button asChild size="lg">
                    <Link href="/">Return Home</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                    <Link href="/product/bedding">Shop More</Link>
                </Button>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
