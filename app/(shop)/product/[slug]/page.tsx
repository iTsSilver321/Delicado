import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProductView } from "@/components/shop/ProductView";
import { isInWishlist } from "@/app/(shop)/actions/wishlist";

export default async function ProductPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !product) {
        console.error("Error fetching product:", error);
        notFound();
    }

    const { data: { user } } = await supabase.auth.getUser();

    // Check wishlist status
    const inWishlist = user ? await isInWishlist(product.id) : false;

    // Fetch all ratings/reviews for this product
    const { data: rawReviews } = await supabase
        .from('product_ratings')
        .select('*')
        .eq('product_id', product.id)
        .order('created_at', { ascending: false });

    // Manually fetch profiles since foreign key might not be set up for direct join
    let reviews: any[] = [];
    if (rawReviews && rawReviews.length > 0) {
        const userIds = Array.from(new Set(rawReviews.map(r => r.user_id)));
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .in('id', userIds);

        const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

        reviews = rawReviews.map(r => ({
            ...r,
            profiles: profileMap.get(r.user_id) || null
        }));
    }

    const totalRatings = reviews.length;

    // Explicitly type the accumulator
    const averageRating = totalRatings > 0
        ? reviews.reduce((acc: number, curr: { rating: number }) => acc + curr.rating, 0) / totalRatings
        : 0;

    // Fetch current user's rating if logged in
    let userRating = null;
    if (user) {
        // Find in reviews list first to save a query
        const myReview = reviews.find((r: { user_id: string }) => r.user_id === user.id);
        if (myReview) {
            userRating = myReview.rating;
        } else {
            // Fallback fetch
            const { data: myRating } = await supabase
                .from('product_ratings')
                .select('rating')
                .eq('product_id', product.id)
                .eq('user_id', user.id)
                .single();

            if (myRating) {
                userRating = myRating.rating;
            }
        }
    }

    return (
        <ProductView
            product={product}
            averageRating={averageRating}
            totalRatings={totalRatings}
            userRating={userRating}
            isAuthenticated={!!user}
            reviews={reviews}
            isInWishlist={inWishlist}
        />
    );
}
