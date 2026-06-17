import { getCategories, getProducts } from '@/services/api'
import ProductsClient from './ProductsClient'
import { Metadata } from 'next'

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string
    query?: string
    page?: string
  }>
}

export const metadata: Metadata = {
  title: 'Product Catalog | Sangli Ceramica',
  description: 'Browse our exclusive catalog of vitrified floor slabs, bathroom wall cladding, sanitary ware, and premium bath mixers. Search and filter by category or finish.',
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const categorySlug = params.category || ''
  const searchVal = params.query || ''
  const pageVal = parseInt(params.page || '1')

  // Parallel server side fetching
  const [categories, { products, totalCount }] = await Promise.all([
    getCategories(),
    getProducts({
      categorySlug,
      query: searchVal,
      page: pageVal,
      limit: 12,
    }),
  ])

  return (
    <ProductsClient
      categories={categories}
      initialProducts={products}
      totalCount={totalCount}
      initialCategory={categorySlug}
      initialQuery={searchVal}
      initialPage={pageVal}
    />
  )
}
