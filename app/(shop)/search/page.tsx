import { createClient } from "@/lib/supabase/server";
import { ProductFilter } from "@/components/shop/ProductFilter";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { SearchInput } from "@/components/shop/SearchInput";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getWishlistProductIds } from "@/app/(shop)/actions/wishlist";

// Fallback sample products (same as other pages for consistency if DB is empty)
const sampleProducts = [
    {
        id: "sample-pillow-1",
        slug: "bedding",
        name: "Luxury Silk Pillowcase",
        description: "Personalize with your initials or name",
        price: 7900,
        image_url: "/products/Pillow.png",
        is_customizable: true,
        category: "bedding",
        stock_quantity: 10,
        created_at: "2024-01-01"
    },
    {
        id: "sample-shirt",
        slug: "clothing",
        name: "Classic Embroidered Robe",
        description: "Luxurious cotton robe",
        price: 14900,
        image_url: "/products/T-shirt.png",
        is_customizable: true,
        category: "clothing",
        stock_quantity: 5,
        created_at: "2024-01-02"
    },
    {
        id: "sample-tablecloth",
        slug: "tableware",
        name: "Elegant Table Runner",
        description: "Linen table runner",
        price: 8900,
        image_url: "/products/Tablecloth.png",
        is_customizable: true,
        category: "tableware",
        stock_quantity: 0,
        created_at: "2024-01-03"
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
        stock_quantity: 15,
        created_at: "2024-01-04"
    },
];

interface SearchPageProps {
    searchParams: {
        q?: string;
        category?: string;
        min?: string;
        max?: string;
        sort?: string;
    };
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
    const { q } = await searchParams;
    return {
        title: q ? `Search Results for "${q}" - Delicado` : "Search Products - Delicado",
        description: "Browse our collection of personalized bedding, clothing, and home goods.",
    };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const supabase = await createClient();
    const { q, category, min, max, sort } = await searchParams;

    // Fetch user and wishlist
    const { data: { user } } = await supabase.auth.getUser();
    const { data: wishlistProductIds } = await getWishlistProductIds();

    let query = supabase.from("products").select("*");

    // Apply Search
    if (q) {
        query = query.ilike("name", `%${q}%`);
    }

    // Apply Category Filter
    if (category) {
        const categories = category.split(",");
        query = query.in("category", categories);
    }

    // Apply Price Filter
    // Note: Prices are stored in cents
    if (min) {
        query = query.gte("price", Number(min) * 100);
    }
    if (max) {
        query = query.lte("price", Number(max) * 100);
    }

    // Apply Sorting
    if (sort === "price_asc") {
        query = query.order("price", { ascending: true });
    } else if (sort === "price_desc") {
        query = query.order("price", { ascending: false });
    } else {
        // Default to newest
        query = query.order("created_at", { ascending: false });
    }

    const { data: products, error } = await query;

    // Use sample products if DB is empty and we are not strictly searching/filtering 
    // (OR if DB is empty, maybe we should just show empty? 
    // Implementation decision: if no products found in DB, reuse sample products but FILTER them in memory to simulate behavior)

    let displayProducts = products || [];

    if (!products || products.length === 0) {
        if (process.env.NODE_ENV === 'development' && (!products)) {
            // Only use samples if the DB query actually returned no data at all (e.g. initial setup)
            // Check if DB is truly empty by checking count? 
            // For simplicity in this demo, if no products returned, we might want to use sample data
            // BUT if I search for "xyz" and it returns 0, I shouldn't show sample data.
            // So I will ONLY use sample data if the DB connection failed or if we prefer to have a fallback.
            // Let's assume if error or (products is null), we use samples.
            if (error || !products) {
                displayProducts = sampleProducts;
            }
        }
    }

    // In-memory filtering for sample products (only if we fell back to them)
    if (displayProducts === sampleProducts) {
        displayProducts = displayProducts.filter(p => {
            if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
            if (category) {
                const cats = category.split(",");
                if (!cats.includes(p.category)) return false;
            }
            if (min && p.price < Number(min) * 100) return false;
            if (max && p.price > Number(max) * 100) return false;

            return true;
        });

        if (sort === "price_asc") {
            displayProducts.sort((a, b) => a.price - b.price);
        } else if (sort === "price_desc") {
            displayProducts.sort((a, b) => b.price - a.price);
        } else {
            // newest
            displayProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
    }

    return (
        <div className="container py-12 min-h-screen">
            <div className="flex flex-col md:flex-row items-baseline justify-between mb-8">
                <div>
                    <h1 className="font-serif text-4xl font-bold mb-2">Search Results</h1>
                    <p className="text-muted-foreground">
                        {displayProducts.length} results found
                        {q && <span> for &quot;{q}&quot;</span>}
                    </p>
                </div>

                {/* Mobile Search Input (Optional, maybe in header?) 
            For now, let's add a search input here to refine search
        */}
                <SearchInput className="w-full max-w-xs mt-4 md:mt-0" />
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="w-full lg:w-64 flex-shrink-0">
                    <ProductFilter maxPrice={300} />
                    {/* maxPrice 300 because sample data max is 199. Real data might vary. */}
                </aside>

                <main className="flex-1">
                    <ProductGrid
                        products={displayProducts}
                        wishlistProductIds={wishlistProductIds || []}
                        isAuthenticated={!!user}
                    />
                </main>
            </div>
        </div>
    );
}

