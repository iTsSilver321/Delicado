import { Header } from "@/components/shop/header";
import { Footer } from "@/components/shop/footer";
import { createClient } from "@/lib/supabase/server";
import { getWishlistProductIds } from "./actions/wishlist";
import { WishlistProvider } from "@/components/shop/WishlistProvider";

export default async function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    let wishlistIds: string[] = [];
    if (user) {
        const { data } = await getWishlistProductIds();
        if (data) wishlistIds = data;
    }

    return (
        <WishlistProvider isAuthenticated={!!user} initialWishlistIds={wishlistIds}>
            <div className="flex min-h-screen flex-col">
                <Header user={user} />
                <main className="flex-1">
                    {children}
                </main>
                <Footer />
            </div>
        </WishlistProvider>
    );
}
