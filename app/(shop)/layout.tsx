import { Header } from "@/components/shop/header";
import { Footer } from "@/components/shop/footer";
import { createClient } from "@/lib/supabase/server";

export default async function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="flex min-h-screen flex-col">
            <Header user={user} />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}
