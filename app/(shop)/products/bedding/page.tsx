import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/shop/ProductCard";
import { CategoryHeader } from "@/components/shop/CategoryHeader";

// Fallback sample products when database is empty
const sampleBeddingProducts = [
    {
        id: "sample-pillow-1",
        slug: "bedding",
        name: "Luxury Silk Pillowcase",
        description: "Personalize with your initials or name for the perfect gift",
        price: 7900,
        image_url: "/products/Pillow.png",
        is_customizable: true,
    },
    {
        id: "sample-pillow-2",
        slug: "bedding",
        name: "Premium Cotton Pillowcase Set",
        description: "Set of 2 customizable pillowcases in Egyptian cotton",
        price: 12900,
        image_url: "/products/Pillow.png",
        is_customizable: true,
    },
    {
        id: "sample-pillow-3",
        slug: "bedding",
        name: "Monogrammed Sheet Set",
        description: "Queen size sheet set with custom embroidery",
        price: 24900,
        image_url: "/products/Pillow.png",
        is_customizable: true,
    },
];

export default async function BeddingPage() {
    const supabase = await createClient();

    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', 'bedding')
        .order('created_at', { ascending: false });

    // Use sample products if database is empty or has error
    const displayProducts = (products && products.length > 0) ? products : sampleBeddingProducts;

    return (
        <div className="min-h-screen">
            <CategoryHeader
                title="Bedding"
                description="Transform your bedroom into a personalized sanctuary. From luxurious pillowcases to elegant sheets, add your unique touch to where you rest."
                category="bedding"
            />

            <section className="container pb-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {displayProducts.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                    ))}
                </div>
            </section>
        </div>
    );
}
