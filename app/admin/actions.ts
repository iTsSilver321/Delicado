'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { formatCurrency } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('Unauthorized')
  }
}



export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await checkAdmin()
    
    const { error } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', orderId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Error updating order status:', error)
    return { success: false, error: 'Failed to update status' }
  }
}

export async function getCustomerOrders(email: string) {
    await checkAdmin()

    // Fetch orders by email since user_id might not always be populated for guest checking out with same email
    // Or prefer user_id if we have it? Admin view usually wants ALL orders for that person.
    // Let's use Email for now as it's visible in the table.
    
    // Actually, looking at profile page, it uses user_id. 
    // But for admin customer view, using email is safer to catch guest orders too.
    const { data: orders, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('customer_email', email)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching customer orders:', error)
        return []
    }
    return orders
}
