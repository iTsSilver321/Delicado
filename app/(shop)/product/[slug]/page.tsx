import { notFound } from "next/navigation";
import { ProductView } from "@/components/shop/ProductView";
import { getProductBySlug, getAllSlugs } from "@/lib/products";

export async function generateStaticParams() {
    return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const product = getProductBySlug(slug);
    if (!product) return { title: "Product Not Found" };

    return {
        title: `${product.name} | Delicado`,
        description: product.description,
        openGraph: {
            title: `${product.name} | Delicado`,
            description: product.description,
            images: [product.images.tucked],
        },
    };
}

export default async function ProductPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const product = getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    return <ProductView product={product} />;
}
