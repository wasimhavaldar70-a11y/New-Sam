import { Inquiry, Appointment } from '@/types/database'
import { FALLBACK_INQUIRIES, FALLBACK_APPOINTMENTS } from './fallbackData'
import { isDbConfigured } from './api'

// Import server supabase connection helper (only runs on server)
async function getSupabase() {
  const { createClient } = await import('@/lib/supabase/server')
  return await createClient()
}

export async function getAllInquiries(): Promise<Inquiry[]> {
  if (!(await isDbConfigured())) return FALLBACK_INQUIRIES
  try {
    const supabase = await getSupabase()
    const { data, error } = await supabase
      .from('inquiries')
      .select('*, products(name, slug)')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data as Inquiry[]
  } catch (error) {
    console.error('Failed to fetch inquiries server side, using fallback:', error)
    return FALLBACK_INQUIRIES
  }
}

export async function getAllAppointments(): Promise<Appointment[]> {
  if (!(await isDbConfigured())) return FALLBACK_APPOINTMENTS
  try {
    const supabase = await getSupabase()
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true })
    if (error) throw error
    return data as Appointment[]
  } catch (error) {
    console.error('Failed to fetch appointments server side, using fallback:', error)
    return FALLBACK_APPOINTMENTS
  }
}
