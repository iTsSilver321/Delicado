import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/shop/ProductCard";
import { CategoryHeader } from "@/components/shop/CategoryHeader";

// Fallback sample products when database is empty
const sampleTablewareProducts = [
    {
        id: "sample-table-1",
        slug: "tableware",
        name: "Elegant Table Runner",
        description: "Linen table runner with custom monogram",
        price: 8900,
        image_url: "/products/Tablecloth.png",
        is_customizable: true,
    },
    {
        id: "sample-table-2",
        slug: "tableware",
        name: "Personalized Napkin Set",
        description: "Set of 6 cotton napkins with embroidered initials",
        price: 6900,
        image_url: "/products/Tablecloth.png",
        is_customizable: true,
    },
    {
        id: "sample-table-3",
        slug: "tableware",
        name: "Custom Tablecloth",
        description: "Rectangle tablecloth with corner embroidery",
        price: 15900,
        image_url: "/products/Tablecloth.png",
        is_customizable: true,
    },
];

export default async function TablewarePage() {
    const supabase = await createClient();

    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', 'tableware')
        .order('created_at', { ascending: false });

    // Use sample products if database is empty or has error
    const displayProducts = (products && products.length > 0) ? products : sampleTablewareProducts;

    return (
        <div className="min-h-screen">
            <CategoryHeader
                title="Tableware"
                description="Set a memorable table with personalized linens. From napkins to tablecloths, add elegance to every meal."
                category="tableware"
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
