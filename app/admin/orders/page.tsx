import { fetchOrders } from "../queries";
import { OrdersTable } from "./components/OrdersTable";
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function OrdersPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const orders = await fetchOrders();

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-serif font-bold tracking-tight">Orders</h2>
                <p className="text-muted-foreground">
                    Manage and track your customer orders.
                </p>
            </div>

            <div className="rounded-md border bg-card">
                <OrdersTable initialOrders={orders} />
            </div>
        </div>
    );
}
