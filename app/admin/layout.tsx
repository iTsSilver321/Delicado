import { AdminSidebar } from "./components/AdminSidebar";
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        redirect('/')
    }

    return (
        <div className="min-h-screen bg-muted/40">
            <AdminSidebar />
            <main className="md:pl-64 min-h-screen transition-all duration-200">
                <div className="container py-8 px-4 md:px-8 max-w-7xl">
                    {children}
                </div>
            </main>
        </div>
    );
}
