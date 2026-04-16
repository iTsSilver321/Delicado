import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full border-t bg-background">
            <div className="container py-12 md:py-16">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
                    <div className="flex flex-col gap-3">
                        <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-primary">
                            Delicado
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Artisan-crafted embroidered bedding sets. Premium cotton, exquisite designs, timeless elegance.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h3 className="text-sm font-semibold">Shop</h3>
                        <Link href="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors">All Products</Link>
                        <Link href="/shop?design=branch" className="text-sm text-muted-foreground hover:text-primary transition-colors">Branch Collection</Link>
                        <Link href="/shop?design=flower" className="text-sm text-muted-foreground hover:text-primary transition-colors">Flower Collection</Link>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h3 className="text-sm font-semibold">Support</h3>
                        <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link>
                        <Link href="/shipping" className="text-sm text-muted-foreground hover:text-primary transition-colors">Shipping & Returns</Link>
                        <Link href="/track-order" className="text-sm text-muted-foreground hover:text-primary transition-colors">Track Order</Link>
                        <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h3 className="text-sm font-semibold">Legal</h3>
                        <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
                    </div>
                </div>
                <div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Delicado. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
