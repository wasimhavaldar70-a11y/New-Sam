import { getCategories, getProducts } from '@/services/api'
import AdminProductsClient from './AdminProductsClient'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const [categories, { products }] = await Promise.all([
    getCategories(),
    getProducts({ limit: 1000 }), // retrieve full catalog list
  ])

  return <AdminProductsClient categories={categories} initialProducts={products} />
}
