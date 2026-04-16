import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getWishlist } from "@/app/(shop)/actions/wishlist";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WishlistButton } from "@/components/shop/WishlistButton";

export default async function WishlistPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login?redirect=/wishlist");
    }

    const { data: wishlistItems, error } = await getWishlist();

    return (
        <div className="container py-16 md:py-24 min-h-[70vh]">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center mb-14">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">My Wishlist</h1>
                    <p className="text-muted-foreground">
                        {!wishlistItems || wishlistItems.length === 0
                            ? "Save products you love for later"
                            : `${wishlistItems.length} item${wishlistItems.length !== 1 ? 's' : ''} saved`}
                    </p>
                </div>

                {/* Wishlist Content */}
                {!wishlistItems || wishlistItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center space-y-6 py-12">
                        <div className="w-24 h-24 rounded-full bg-secondary/60 flex items-center justify-center">
                            <Heart className="w-10 h-10 text-muted-foreground/40" />
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="font-serif text-xl font-bold">Your wishlist is empty</h2>
                            <p className="text-muted-foreground max-w-sm mx-auto">
                                Browse our collection and tap the heart icon on products you love.
                            </p>
                        </div>
                        <Link href="/shop">
                            <Button size="lg" className="rounded-full px-8 shadow-md">
                                Shop Now
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-0 divide-y">
                        {wishlistItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex gap-5 py-6 group"
                            >
                                {/* Product Image */}
                                <Link
                                    href={`/product/${item.product.slug}`}
                                    className="relative w-24 h-28 md:w-32 md:h-36 rounded-xl overflow-hidden bg-secondary/30 flex-shrink-0"
                                >
                                    {item.product.image_url ? (
                                        <Image
                                            src={item.product.image_url}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            sizes="128px"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="font-serif text-2xl text-primary/20">
                                                {item.product.name[0]}
                                            </span>
                                        </div>
                                    )}
                                </Link>

                                {/* Product Info */}
                                <div className="flex-1 flex flex-col justify-between min-w-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <Link href={`/product/${item.product.slug}`} className="hover:text-primary transition-colors">
                                                <h3 className="font-serif text-lg font-semibold">
                                                    {item.product.name}
                                                </h3>
                                            </Link>
                                            {item.product.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                                                    {item.product.description}
                                                </p>
                                            )}
                                        </div>
                                        <p className="font-semibold text-primary ml-4 shrink-0">
                                            ${(item.product.price / 100).toFixed(2)}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 mt-3">
                                        <Button asChild size="sm" className="rounded-xl gap-2">
                                            <Link href={`/product/${item.product.slug}`}>
                                                <ShoppingBag className="w-3.5 h-3.5" />
                                                View Product
                                            </Link>
                                        </Button>
                                        <WishlistButton
                                            productId={item.product_id}
                                            productName={item.product.name}
                                            initialIsInWishlist={true}
                                            isAuthenticated={true}
                                            variant="icon"
                                            size="sm"
                                            className="text-red-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Continue Shopping */}
                {wishlistItems && wishlistItems.length > 0 && (
                    <div className="text-center pt-4">
                        <Link href="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            ← Continue Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
