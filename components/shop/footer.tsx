import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full border-t bg-background">
            <div className="container py-10 md:py-16">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-primary">
                            Delicado
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Premium personalized embroidery for your home and lifestyle. See it before you stitch it.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="font-medium">Shop</h3>
                        <Link href="/products/bedding" className="text-sm text-muted-foreground hover:text-primary">Bedding</Link>
                        <Link href="/products/clothing" className="text-sm text-muted-foreground hover:text-primary">Clothing</Link>
                        <Link href="/products/tableware" className="text-sm text-muted-foreground hover:text-primary">Tableware</Link>
                        <Link href="/collections" className="text-sm text-muted-foreground hover:text-primary">All Collections</Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="font-medium">Support</h3>
                        <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary">FAQ</Link>
                        <Link href="/shipping" className="text-sm text-muted-foreground hover:text-primary">Shipping & Returns</Link>
                        <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact Us</Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="font-medium">Legal</h3>
                        <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link>
                        <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link>
                    </div>
                </div>
                <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Delicado. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
