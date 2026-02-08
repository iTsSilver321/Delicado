'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface WishlistItem {
  id: string
  product_id: string
  created_at: string
  product: {
    id: string
    slug: string
    name: string
    description: string | null
    price: number
    image_url: string | null
  }
}

export async function addToWishlist(productId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'You must be logged in to add items to your wishlist' }
  }

  const { error } = await supabase
    .from('wishlist_items')
    .insert({ user_id: user.id, product_id: productId })

  if (error) {
    if (error.code === '23505') { // Unique violation - already in wishlist
      return { error: 'Item already in wishlist' }
    }
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function removeFromWishlist(productId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'You must be logged in to remove items from your wishlist' }
  }

  const { error } = await supabase
    .from('wishlist_items')
    .delete()
    .eq('user_id', user.id)
    .eq('product_id', productId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function getWishlist(): Promise<{ data: WishlistItem[] | null; error: string | null }> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { data: null, error: 'You must be logged in to view your wishlist' }
  }

  const { data, error } = await supabase
    .from('wishlist_items')
    .select(`
      id,
      product_id,
      created_at,
      product:products (
        id,
        slug,
        name,
        description,
        price,
        image_url
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return { data: null, error: error.message }
  }

  return { data: data as unknown as WishlistItem[], error: null }
}

export async function getWishlistProductIds(): Promise<{ data: string[] | null; error: string | null }> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { data: null, error: null } // Not an error, just not logged in
  }

  const { data, error } = await supabase
    .from('wishlist_items')
    .select('product_id')
    .eq('user_id', user.id)

  if (error) {
    return { data: null, error: error.message }
  }

  return { data: data.map(item => item.product_id), error: null }
}

export async function isInWishlist(productId: string): Promise<boolean> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return false
  }

  const { data, error } = await supabase
    .from('wishlist_items')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .maybeSingle()

  if (error) {
    return false
  }

  return !!data
}

export async function toggleWishlist(productId: string) {
  const inWishlist = await isInWishlist(productId)
  
  if (inWishlist) {
    return removeFromWishlist(productId)
  } else {
    return addToWishlist(productId)
  }
}
