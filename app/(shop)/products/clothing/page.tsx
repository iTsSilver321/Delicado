import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/shop/ProductCard";
import { CategoryHeader } from "@/components/shop/CategoryHeader";

// Fallback sample products when database is empty
const sampleClothingProducts = [
    {
        id: "sample-shirt-1",
        slug: "clothing",
        name: "Classic Embroidered Robe",
        description: "Luxurious cotton robe with custom monogram",
        price: 14900,
        image_url: "/products/T-shirt.png",
        is_customizable: true,
    },
    {
        id: "sample-shirt-2",
        slug: "clothing",
        name: "Personalized Polo Shirt",
        description: "Premium pique polo with embroidered design",
        price: 8900,
        image_url: "/products/T-shirt.png",
        is_customizable: true,
    },
    {
        id: "sample-shirt-3",
        slug: "clothing",
        name: "Custom Oxford Shirt",
        description: "Classic Oxford with personalized cuff embroidery",
        price: 11900,
        image_url: "/products/T-shirt.png",
        is_customizable: true,
    },
];

export default async function ClothingPage() {
    const supabase = await createClient();

    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', 'clothing')
        .order('created_at', { ascending: false });

    // Use sample products if database is empty or has error
    const displayProducts = (products && products.length > 0) ? products : sampleClothingProducts;

    return (
        <div className="min-h-screen">
            <CategoryHeader
                title="Clothing"
                description="Elevate your wardrobe with personalized elegance. From robes to dress shirts, make every piece uniquely yours."
                category="clothing"
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
