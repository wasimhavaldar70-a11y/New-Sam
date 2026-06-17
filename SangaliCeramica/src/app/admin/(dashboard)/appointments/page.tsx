import { getAllAppointments } from '@/services/api.server'
import AppointmentsClient from './AppointmentsClient'

export const dynamic = 'force-dynamic'

export default async function AdminAppointmentsPage() {
  const appointments = await getAllAppointments()
  return <AppointmentsClient initialAppointments={appointments} />
}
