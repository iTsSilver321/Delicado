import { createClient } from "@/lib/supabase/server";
import { CollectionClient } from "@/components/shop/CollectionClient";

// Fallback sample products when database is empty
const sampleProducts = [
    {
        id: "sample-pillow",
        slug: "bedding",
        name: "Luxury Silk Pillowcase",
        description: "Personalize with your initials or name",
        price: 7900,
        image_url: "/products/Pillow.png",
        is_customizable: true,
        category: "bedding",
    },
    {
        id: "sample-shirt",
        slug: "clothing",
        name: "Classic Embroidered Robe",
        description: "Luxurious cotton robe with custom monogram",
        price: 14900,
        image_url: "/products/T-shirt.png",
        is_customizable: true,
        category: "clothing",
    },
    {
        id: "sample-tablecloth",
        slug: "tableware",
        name: "Elegant Table Runner",
        description: "Linen table runner with custom monogram",
        price: 8900,
        image_url: "/products/Tablecloth.png",
        is_customizable: true,
        category: "tableware",
    },
    {
        id: "sample-pillow-2",
        slug: "bedding",
        name: "Cotton Sheet Set",
        description: "Premium Egyptian cotton sheets",
        price: 19900,
        image_url: "/products/Pillow.png",
        is_customizable: false,
        category: "bedding",
    },
];

export default async function CollectionsPage() {
    const supabase = await createClient();

    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    // Use sample products if database is empty or has error
    const allProducts = (products && products.length > 0) ? products : sampleProducts;

    const customizableProducts = allProducts.filter((p: any) => p.is_customizable === true);
    const readyMadeProducts = allProducts.filter((p: any) => p.is_customizable !== true);

    return (
        <CollectionClient
            customizableProducts={customizableProducts}
            readyMadeProducts={readyMadeProducts}
        />
    );
}
