import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getWishlist } from "@/app/(shop)/actions/wishlist";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
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
        <div className="container py-16 md:py-24">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-red-500/10 rounded-xl">
                            <Heart className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">My Wishlist</h1>
                            <p className="text-muted-foreground">
                                {wishlistItems?.length || 0} item{wishlistItems?.length !== 1 ? 's' : ''} saved
                            </p>
                        </div>
                    </div>
                </div>

                {/* Wishlist Content */}
                {!wishlistItems || wishlistItems.length === 0 ? (
                    <div className="bg-card rounded-2xl border p-16 text-center space-y-6">
                        <div className="w-20 h-20 mx-auto bg-secondary/50 rounded-full flex items-center justify-center">
                            <Heart className="w-10 h-10 text-muted-foreground/30" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="font-serif text-xl font-bold">Your wishlist is empty</h2>
                            <p className="text-muted-foreground max-w-sm mx-auto">
                                Save products you love by clicking the heart icon on any product.
                            </p>
                        </div>
                        <Button asChild size="lg" className="gap-2">
                            <Link href="/search">
                                <ShoppingBag className="w-4 h-4" />
                                Start Shopping
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {wishlistItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-card rounded-2xl border p-4 flex items-center gap-4 group hover:shadow-lg transition-shadow"
                            >
                                {/* Product Image */}
                                <Link
                                    href={`/product/${item.product.slug}`}
                                    className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-secondary/30 flex-shrink-0"
                                >
                                    {item.product.image_url ? (
                                        <Image
                                            src={item.product.image_url}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
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
                                <div className="flex-1 min-w-0 space-y-1">
                                    <Link href={`/product/${item.product.slug}`} className="hover:text-primary transition-colors">
                                        <h3 className="font-serif text-lg font-bold truncate">
                                            {item.product.name}
                                        </h3>
                                    </Link>
                                    {item.product.description && (
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {item.product.description}
                                        </p>
                                    )}
                                    <p className="text-lg font-medium text-primary">
                                        ${(item.product.price / 100).toFixed(2)}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2 flex-shrink-0">
                                    <Button asChild variant="default" size="sm" className="gap-2">
                                        <Link href={`/product/${item.product.slug}`}>
                                            <ShoppingBag className="w-4 h-4" />
                                            <span className="hidden md:inline">View Product</span>
                                        </Link>
                                    </Button>
                                    <WishlistButton
                                        productId={item.product_id}
                                        productName={item.product.name}
                                        initialIsInWishlist={true}
                                        isAuthenticated={true}
                                        variant="default"
                                        size="sm"
                                        className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Continue Shopping */}
                {wishlistItems && wishlistItems.length > 0 && (
                    <div className="text-center pt-4">
                        <Button asChild variant="outline" size="lg">
                            <Link href="/search">Continue Shopping</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
