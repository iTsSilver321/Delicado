import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProductView } from "@/components/shop/ProductView";

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

    return <ProductView product={product} />;
}
