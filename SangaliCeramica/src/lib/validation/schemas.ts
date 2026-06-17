import { z } from 'zod'

// Phone number regex helper (supports Indian phone numbers e.g. +91 9876543210 or 9876543210)
const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/

export const inquirySchema = z.object({
  customer_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(phoneRegex, 'Please enter a valid 10-digit Indian phone number'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  product_id: z.string().uuid('Invalid product reference').optional().nullable(),
  message: z.string().min(5, 'Message must be at least 5 characters'),
})

export type InquiryFormInput = z.infer<typeof inquirySchema>

export const appointmentSchema = z.object({
  customer_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(phoneRegex, 'Please enter a valid 10-digit Indian phone number'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  appointment_date: z.string().refine((val) => {
    const selectedDate = new Date(val)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return selectedDate >= today
  }, 'Appointment date must be today or in the future'),
  message: z.string().optional().or(z.literal('')),
})

export type AppointmentFormInput = z.infer<typeof appointmentSchema>

export const contactSchema = z.object({
  customer_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(phoneRegex, 'Please enter a valid 10-digit Indian phone number'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  message: z.string().min(5, 'Message must be at least 5 characters'),
})

export type ContactFormInput = z.infer<typeof contactSchema>

export const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  category_id: z.string().uuid('Please select a valid category'),
  description: z.string().optional().or(z.literal('')),
  price: z.preprocess((val) => Number(val), z.number().min(0, 'Price must be 0 or greater')),
  brand: z.string().min(1, 'Brand is required'),
  size: z.string().min(1, 'Size is required (e.g. 800x1600 mm)'),
  finish: z.string().min(1, 'Finish is required (e.g. Glossy)'),
  material: z.string().min(1, 'Material is required (e.g. Vitrified)'),
  stock_status: z.enum(['In Stock', 'Out of Stock', 'Call for Availability']),
  featured: z.boolean().default(false),
})

export type ProductFormInput = z.infer<typeof productSchema>

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and hyphens'),
  description: z.string().optional().or(z.literal('')),
  image_url: z.string().url('Please enter a valid image URL').optional().or(z.literal('')),
})

export type CategoryFormInput = z.infer<typeof categorySchema>
