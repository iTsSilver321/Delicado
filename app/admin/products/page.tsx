import { fetchProducts } from "../queries";
import { ProductsClient } from "./components/ProductsClient";
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProductsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const products = await fetchProducts();

    return (
        <div className="space-y-8">
            <ProductsClient initialProducts={products} />
        </div>
    );
}
