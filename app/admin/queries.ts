import { SupabaseClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function fetchAdminStats(supabase: SupabaseClient | any) {
    // Determine which client to use - prefer the passed client if it has admin rights (unlikely if it's user session),
    // but for admin stats which hits 'orders' (RLS might key off user), we might need admin client anyway 
    // OR we rely on the caller to have checked permissions and use supabaseAdmin.
    // Given the current actions.ts uses supabaseAdmin, we should probably continue to use it
    // BUT we want to avoid the redundant auth check if possible if we already did it.
    // Actually, `supabaseAdmin` has the service role, so it bypasses RLS. 
    // So the data fetching itself doesn't need the user session, it just needs to be *guarded* by the user session check.

    const { data: orders, error: ordersError } = await supabaseAdmin
        .from('orders')
        .select('total, created_at, status');

    const { count: customersCount, error: customersError } = await supabaseAdmin
        .from('profiles')
        .select('*', { count: 'exact', head: true });

    // Calculate stats
    const totalRevenue = orders?.reduce((acc, order) => acc + (order.status === 'paid' || order.status === 'completed' || order.status === 'delivered' ? order.total : 0), 0) || 0;
    const totalOrders = orders?.length || 0;
    const activeOrders = orders?.filter(o => o.status === 'pending' || o.status === 'processing').length || 0;

    // Calculate monthly sales for chart
    const salesByMonth = orders?.reduce((acc: any, order) => {
        const date = new Date(order.created_at);
        const month = date.toLocaleString('default', { month: 'short' });
        if (order.status === 'paid' || order.status === 'completed' || order.status === 'delivered') {
            acc[month] = (acc[month] || 0) + (order.total / 100); // Convert cents to dollars
        }
        return acc;
    }, {});

    const chartData = Object.entries(salesByMonth || {}).map(([name, total]) => ({
        name,
        total
    }));

    return {
        revenue: totalRevenue / 100, // Convert cents to dollars
        totalOrders,
        activeOrders,
        totalCustomers: customersCount || 0,
        chartData
    };
}

export async function fetchRecentSales() {
    const { data: orders } = await supabaseAdmin
        .from('orders')
        .select('id, total, customer_name, customer_email, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

    return orders?.map(order => ({
        id: order.id,
        name: order.customer_name,
        email: order.customer_email,
        amount: order.total / 100 // Convert cents to dollars
    })) || [];
}
