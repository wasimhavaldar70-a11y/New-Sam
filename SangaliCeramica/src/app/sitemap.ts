import { MetadataRoute } from 'next'
import { getProducts, getBlogs } from '@/services/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://sangliceramica.com'

  // Fetch dynamic slugs to list in sitemap
  const { products } = await getProducts({ limit: 100 })
  const blogs = await getBlogs()

  const productUrls = products.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: new Date(p.created_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const blogUrls = blogs.map((b) => ({
    url: `${baseUrl}/blog/${b.slug}`,
    lastModified: new Date(b.created_at || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const staticUrls = [
    '',
    '/about',
    '/products',
    '/gallery',
    '/projects',
    '/blog',
    '/contact',
    '/book',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? ('daily' as const) : ('weekly' as const),
    priority: route === '' ? 1.0 : 0.8,
  }))

  return [...staticUrls, ...productUrls, ...blogUrls]
}
