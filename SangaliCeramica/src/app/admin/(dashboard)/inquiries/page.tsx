import { getAllInquiries } from '@/services/api.server'
import InquiriesClient from './InquiriesClient'

export const dynamic = 'force-dynamic'

export default async function AdminInquiriesPage() {
  const inquiries = await getAllInquiries()
  return <InquiriesClient initialInquiries={inquiries} />
}
