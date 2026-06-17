import { getCategories, getProducts } from '@/services/api'
import { getAllInquiries, getAllAppointments } from '@/services/api.server'
import DashboardClient from './DashboardClient'

// Force Next.js to not cache admin console data so it remains dynamic
export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const [categories, { products }, inquiries, appointments] = await Promise.all([
    getCategories(),
    getProducts({ limit: 1000 }), // Get all products for statistics calculation
    getAllInquiries(),
    getAllAppointments(),
  ])

  return (
    <DashboardClient
      categories={categories}
      products={products}
      inquiries={inquiries}
      appointments={appointments}
    />
  )
}
