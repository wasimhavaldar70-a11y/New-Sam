'use server'

import { isDbConfigured } from '@/services/api'
import {
  appointmentSchema,
  contactSchema,
  inquirySchema,
} from '@/lib/validation/schemas'

export async function submitInquiry(formData: any) {
  // Validate data server-side
  const result = inquirySchema.safeParse(formData)
  if (!result.success) {
    return { success: false, error: result.error.flatten().fieldErrors }
  }

  const validatedData = result.data
  const configured = await isDbConfigured()

  if (!configured) {
    console.log('OFFLINE CAPTURED LEAD (Inquiry):', validatedData)
    return {
      success: true,
      offline: true,
      message: 'Inquiry received in Offline Preview Mode! Set up Supabase to save it in your database.',
    }
  }

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { error } = await supabase.from('inquiries').insert({
      customer_name: validatedData.customer_name,
      phone: validatedData.phone,
      email: validatedData.email || null,
      product_id: validatedData.product_id || null,
      message: validatedData.message,
      status: 'pending',
    })

    if (error) throw error

    return {
      success: true,
      message: 'Thank you for your inquiry! Our team will contact you soon.',
    }
  } catch (error: any) {
    console.error('Error submitting inquiry:', error)
    return {
      success: false,
      error: error.message || 'An error occurred while submitting your inquiry.',
    }
  }
}

export async function submitAppointment(formData: any) {
  // Validate data server-side
  const result = appointmentSchema.safeParse(formData)
  if (!result.success) {
    return { success: false, error: result.error.flatten().fieldErrors }
  }

  const validatedData = result.data
  const configured = await isDbConfigured()

  if (!configured) {
    console.log('OFFLINE CAPTURED APPOINTMENT:', validatedData)
    return {
      success: true,
      offline: true,
      message: 'Appointment booking simulated in Offline Preview Mode!',
    }
  }

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { error } = await supabase.from('appointments').insert({
      customer_name: validatedData.customer_name,
      phone: validatedData.phone,
      email: validatedData.email || null,
      appointment_date: validatedData.appointment_date,
      message: validatedData.message || null,
      status: 'pending',
    })

    if (error) throw error

    return {
      success: true,
      message: 'Showroom visit booked! We will call you to confirm your slot.',
    }
  } catch (error: any) {
    console.error('Error booking appointment:', error)
    return {
      success: false,
      error: error.message || 'An error occurred while booking your visit.',
    }
  }
}

export async function submitContact(formData: any) {
  // Validate data server-side
  const result = contactSchema.safeParse(formData)
  if (!result.success) {
    return { success: false, error: result.error.flatten().fieldErrors }
  }

  const validatedData = result.data
  const configured = await isDbConfigured()

  if (!configured) {
    console.log('OFFLINE CAPTURED CONTACT FORM:', validatedData)
    return {
      success: true,
      offline: true,
      message: 'Message captured in Offline Preview Mode! Thank you.',
    }
  }

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { error } = await supabase.from('inquiries').insert({
      customer_name: validatedData.customer_name,
      phone: validatedData.phone,
      email: validatedData.email || null,
      product_id: null,
      message: `[General Contact Request] ${validatedData.message}`,
      status: 'pending',
    })

    if (error) throw error

    return {
      success: true,
      message: 'Your message has been sent. We will respond within 24 hours.',
    }
  } catch (error: any) {
    console.error('Error submitting contact request:', error)
    return {
      success: false,
      error: error.message || 'An error occurred while sending your message.',
    }
  }
}
