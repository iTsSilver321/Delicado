import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://delicado.vercel.app'
  const supabase = await createClient()

  // Static routes
  const routes = [
    '',
    '/collections',
    '/about',
    '/contact',
    '/login',
    '/signup',
    '/track-order',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Fetch products for dynamic routes
  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at')
  
  const productRoutes = products?.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  })) || []

  // Fetch categories (assuming they are hardcoded for now or we can query distinct categories)
  // For now just hardcoding common ones
  const categoryRoutes = ['bedding', 'clothing', 'tableware'].map((cat) => ({
    url: `${baseUrl}/collections/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...routes, ...categoryRoutes, ...productRoutes]
}
