export interface UserProfile {
  id: string
  name: string
  email: string
  phone: string | null
  role: 'admin' | 'customer'
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  image_url: string | null
  description: string | null
  created_at: string
}

export interface Product {
  id: string
  category_id: string
  name: string
  slug: string
  description: string | null
  price: number
  brand: string
  size: string | null
  finish: string | null
  material: string | null
  stock_status: 'In Stock' | 'Out of Stock' | 'Call for Availability'
  featured: boolean
  created_at: string
  // Joined relation fields:
  categories?: Category
  product_images?: ProductImage[]
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  sort_order: number
  created_at: string
}

export interface Inquiry {
  id: string
  customer_name: string
  phone: string
  email: string | null
  product_id: string | null
  message: string | null
  status: 'pending' | 'in_progress' | 'completed'
  created_at: string
  // Relations
  products?: {
    name: string
    slug: string
  } | null
}

export interface Appointment {
  id: string
  customer_name: string
  phone: string
  email: string | null
  appointment_date: string
  message: string | null
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled'
  created_at: string
}

export interface Testimonial {
  id: string
  name: string
  designation: string | null
  review: string
  rating: number
  image_url: string | null
  created_at: string
}

export interface GalleryItem {
  id: string
  title: string
  image_url: string
  category: string
  created_at: string
}

export interface Project {
  id: string
  title: string
  description: string | null
  location: string | null
  image_url: string | null
  created_at: string
}

export interface Blog {
  id: string
  title: string
  slug: string
  content: string
  featured_image: string | null
  published: boolean
  created_at: string
}

export interface Settings {
  id: string
  website_name: string
  logo: string | null
  address: string
  phone: string
  email: string
  whatsapp: string
  google_map: string
  created_at: string
}
