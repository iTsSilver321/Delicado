import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function CancelPage() {
    return (
        <div className="container min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <XCircle className="w-12 h-12" />
            </div>
            <h1 className="text-4xl font-serif font-bold">Order Cancelled</h1>
            <p className="text-lg text-muted-foreground max-w-md">
                Your payment was cancelled and you have not been charged.
            </p>
            <Button asChild size="lg">
                <Link href="/product/bedding">Return to Cart</Link>
            </Button>
        </div>
    );
}
