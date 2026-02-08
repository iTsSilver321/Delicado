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


export async function getCustomers() {
  await checkAdmin()

  // Fetch profiles - REMOVED ORDER BY created_at WHICH DOES NOT EXIST
  const { data: profiles, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('*')

  if (profileError) {
    console.error('getCustomers: Error fetching profiles', profileError);
  }

  // Fetch all users from Auth
  const { data: { users }, error: userError } = await supabaseAdmin.auth.admin.listUsers()
  
  if (userError || !users) {
    console.error('getCustomers: Error fetching users from auth', userError);
    return []
  }

  // Merge profile data with auth user data
  const customers = users.map(user => {
    const profile = profiles?.find(p => p.id === user.id)
    
    // Log if profile is missing for a user, especially for me (development)
    if (!profile) {
      console.warn(`getCustomers: No profile found for user ${user.email} (${user.id})`);
    } else {
        // Log if role mismatch
        if (profile.role !== 'admin' && user.email?.includes('eduar')) { // Assuming user's email
            console.log(`getCustomers: User ${user.email} has profile role '${profile.role}'`);
        }
    }

    return {
        id: user.id,
        email: user.email,
        full_name: profile?.full_name || user.user_metadata?.full_name || 'N/A',
        role: profile?.role || 'user',
        created_at: user.created_at,
        avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url
    }
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) // Sort by created_at descending

  return customers
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
