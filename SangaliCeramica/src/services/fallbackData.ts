import { Category, Product, Testimonial, GalleryItem, Project, Blog, Settings } from '@/types/database'

export const FALLBACK_SETTINGS: Settings = {
  id: '00000000-0000-0000-0000-000000000000',
  website_name: 'Sangli Ceramica',
  logo: null,
  address: 'Sangli-Miraj Road, Vishrambag, Sangli, Maharashtra 416415',
  phone: '+91 98765 43210',
  email: 'info@sangliceramica.com',
  whatsapp: '919876543210',
  google_map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3817.9626359570183!2d74.603348!3d16.852923!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc1230000000001%3A0x6b4fd4ef9c5f884f!2sSangli!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  created_at: new Date().toISOString()
}

export const FALLBACK_CATEGORIES: Category[] = [
  {
    id: 'b1111111-1111-1111-1111-111111111111',
    name: 'Floor Tiles',
    slug: 'floor-tiles',
    image_url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80',
    description: 'Premium glazed vitrified tiles for elegant living spaces.',
    created_at: new Date().toISOString()
  },
  {
    id: 'b2222222-2222-2222-2222-222222222222',
    name: 'Wall Tiles',
    slug: 'wall-tiles',
    image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
    description: 'Stylish wall tiles for kitchens, bathrooms, and features.',
    created_at: new Date().toISOString()
  },
  {
    id: 'b3333333-3333-3333-3333-333333333333',
    name: 'Sanitary Ware',
    slug: 'sanitary-ware',
    image_url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    description: 'Premium designer closets, wash basins, and vanities.',
    created_at: new Date().toISOString()
  },
  {
    id: 'b4444444-4444-4444-4444-444444444444',
    name: 'Bath Fittings',
    slug: 'bath-fittings',
    image_url: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=600&q=80',
    description: 'Elegant faucets, showers, and designer bath accessories.',
    created_at: new Date().toISOString()
  },
  {
    id: 'b5555555-5555-5555-5555-555555555555',
    name: 'Outdoor & Parking',
    slug: 'outdoor-parking-tiles',
    image_url: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=600&q=80',
    description: 'Heavy-duty exterior tiles designed to withstand heavy loads and weather.',
    created_at: new Date().toISOString()
  }
]

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    category_id: 'b1111111-1111-1111-1111-111111111111',
    name: 'Royal Statuario White',
    slug: 'royal-statuario-white',
    description: 'Exquisite Italian replica white vitrified tiles with golden and grey veins.',
    price: 1250,
    brand: 'Somany Premium',
    size: '800x1600 mm',
    finish: 'Glossy / High Gloss',
    material: 'Glazed Vitrified',
    stock_status: 'In Stock',
    featured: true,
    created_at: new Date().toISOString(),
    product_images: [
      { id: '1', product_id: 'c1111111-1111-1111-1111-111111111111', image_url: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=600&q=80', sort_order: 0, created_at: '' },
      { id: '2', product_id: 'c1111111-1111-1111-1111-111111111111', image_url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80', sort_order: 1, created_at: '' }
    ]
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    category_id: 'b1111111-1111-1111-1111-111111111111',
    name: 'Armani Bronze',
    slug: 'armani-bronze',
    description: 'Luxurious dark brown marble-look tiles with fine crystalline webs.',
    price: 1450,
    brand: 'Kajaria Eternity',
    size: '800x1600 mm',
    finish: 'Super Glossy',
    material: 'Glazed Vitrified',
    stock_status: 'In Stock',
    featured: true,
    created_at: new Date().toISOString(),
    product_images: [
      { id: '3', product_id: 'c2222222-2222-2222-2222-222222222222', image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80', sort_order: 0, created_at: '' }
    ]
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    category_id: 'b2222222-2222-2222-2222-222222222222',
    name: 'Hexa Deco Mint',
    slug: 'hexa-deco-mint',
    description: 'Modern hexagonal ceramic tiles in mint green color, perfect for kitchen splashbacks.',
    price: 850,
    brand: 'Simpolo Ceramica',
    size: '300x300 mm',
    finish: 'Satin / Matt',
    material: 'Ceramic',
    stock_status: 'In Stock',
    featured: false,
    created_at: new Date().toISOString(),
    product_images: [
      { id: '4', product_id: 'c3333333-3333-3333-3333-333333333333', image_url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80', sort_order: 0, created_at: '' }
    ]
  },
  {
    id: 'c4444444-4444-4444-4444-444444444444',
    category_id: 'b3333333-3333-3333-3333-333333333333',
    name: 'Matte Black Smart Closet',
    slug: 'matte-black-smart-closet',
    description: 'Luxury intelligent wall-hung toilet featuring auto-flush, seat heating, and bidet controls.',
    price: 45000,
    brand: 'TOTO',
    size: 'Standard',
    finish: 'Matte',
    material: 'Ceramic Vitreous China',
    stock_status: 'In Stock',
    featured: true,
    created_at: new Date().toISOString(),
    product_images: [
      { id: '5', product_id: 'c4444444-4444-4444-4444-444444444444', image_url: 'https://images.unsplash.com/photo-1521207418485-99c705420785?auto=format&fit=crop&w=600&q=80', sort_order: 0, created_at: '' }
    ]
  },
  {
    id: 'c5555555-5555-5555-5555-555555555555',
    category_id: 'b4444444-4444-4444-4444-444444444444',
    name: 'Rose Gold Basin Mixer',
    slug: 'rose-gold-basin-mixer',
    description: 'Sophisticated brass basin faucet with a durable rose gold PVD coating.',
    price: 6500,
    brand: 'Jaquar Artize',
    size: 'PVD Mirror Finish',
    finish: 'Solid Brass',
    material: 'Solid Brass',
    stock_status: 'In Stock',
    featured: true,
    created_at: new Date().toISOString(),
    product_images: [
      { id: '6', product_id: 'c5555555-5555-5555-5555-555555555555', image_url: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=600&q=80', sort_order: 0, created_at: '' }
    ]
  },
  {
    id: 'c6666666-6666-6666-6666-666666666666',
    category_id: 'b5555555-5555-5555-5555-555555555555',
    name: 'Stone Grip Parking Tile',
    slug: 'stone-grip-grey-parking',
    description: 'Heavy-duty 16mm vitrified tiles with high slip-resistance for driveways.',
    price: 620,
    brand: 'Kajaria',
    size: '400x400 mm',
    finish: 'Rough / Anti-skid',
    material: 'Vitrified',
    stock_status: 'In Stock',
    featured: false,
    created_at: new Date().toISOString(),
    product_images: [
      { id: '7', product_id: 'c6666666-6666-6666-6666-666666666666', image_url: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=600&q=80', sort_order: 0, created_at: '' }
    ]
  }
]

export const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Rahul Deshmukh',
    designation: 'Architect, Sangli',
    review: 'Sangli Ceramica has an incredible collection of large slab tiles. The designs are premium and their suggestions helped us finalize the floorings for our luxury villa project.',
    rating: 5,
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Priya Kulkarni',
    designation: 'Home Owner, Vishrambag',
    review: 'I bought my bathroom sanitary ware and rose gold faucets from here. It has been 2 years and everything functions perfectly. Highly recommend their high-end Jaquar fittings!',
    rating: 5,
    image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Amit Patil',
    designation: 'Builder, Patil Developers',
    review: 'Reliable pricing, prompt delivery, and highly professional staff. We source all our tiles in bulk for commercial projects in Sangli from them.',
    rating: 5,
    image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    created_at: new Date().toISOString()
  }
]

export const FALLBACK_GALLERY: GalleryItem[] = [
  { id: '1', title: 'Modern Living Room Slab Tiles', image_url: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=600&q=80', category: 'Living Room', created_at: '' },
  { id: '2', title: 'Premium Bathroom with Closet', image_url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=600&q=80', category: 'Bathroom', created_at: '' },
  { id: '3', title: 'Lobby Entrance Slab Work', image_url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=600&q=80', category: 'Lobby', created_at: '' },
  { id: '4', title: 'Modern Kitchen Backsplash', image_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80', category: 'Kitchen', created_at: '' }
]

export const FALLBACK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'The White House Villa',
    description: 'Complete flooring work with 800x1600mm Statuario slabs, luxury bathrooms, and modern elevation cladding.',
    location: 'Vishrambag, Sangli',
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Heights Commercial Complex',
    description: 'High-traffic parking tiles and vitrified corridors for a 5-storey shopping and office space.',
    location: 'Miraj, Sangli',
    image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Patil Residence Bathroom Reno',
    description: 'Retrofitting bathroom with smart sanitaries, wall-hung items, and matching grey terrazzo theme.',
    location: 'South Shivaji Nagar, Sangli',
    image_url: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=600&q=80',
    created_at: new Date().toISOString()
  }
]

export const FALLBACK_BLOGS: Blog[] = [
  {
    id: '1',
    title: 'How to Choose the Perfect Tiles for Your Living Room',
    slug: 'how-to-choose-living-room-tiles',
    content: 'Choosing the right tiles for your living room is one of the most critical aspects of interior design. Large format glazed vitrified tiles (GVT) in sizes like 800x1600mm are extremely popular today as they reduce grout lines and make the space look massive. Light colors like white, beige, and light grey reflect more light, making your room brighter. For a premium look, you can select marble replicas like Royal Statuario or Carrara White.',
    featured_image: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=600&q=80',
    published: true,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: '5 Bathroom Sanitary Ware Trends in 2026',
    slug: 'bathroom-sanitary-ware-trends-2026',
    content: 'Bathroom designs have evolved from pure utility to premium personal wellness sanctuaries. Smart toilets with auto flushing and sanitization, matte black wall-hung closets, and thin-rim tabletop basins are leading the trend this year. Integrating concealed divertors and rose-gold fittings offers an ultra-luxurious feel. Visit Sangli Ceramica to see these setups live!',
    featured_image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    published: true,
    created_at: new Date().toISOString()
  }
]

export interface Inquiry {
  id: string
  customer_name: string
  phone: string
  email: string | null
  product_id: string | null
  message: string | null
  status: 'pending' | 'in_progress' | 'completed'
  created_at: string
  products?: { name: string; slug: string } | null
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

export const FALLBACK_INQUIRIES: any[] = [
  {
    id: 'l1111111-1111-1111-1111-111111111111',
    customer_name: 'Vikram Shinde',
    phone: '+91 99887 76655',
    email: 'vikram@example.com',
    product_id: 'c1111111-1111-1111-1111-111111111111',
    message: 'Looking for 2500 sq ft flooring tiles. Please send price list for Royal Statuario.',
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    products: { name: 'Royal Statuario White', slug: 'royal-statuario-white' }
  },
  {
    id: 'l2222222-2222-2222-2222-222222222222',
    customer_name: 'Anjali Mane',
    phone: '+91 91234 56789',
    email: 'anjali.m@example.com',
    product_id: 'c4444444-4444-4444-4444-444444444444',
    message: 'Need 2 smart closets for my penthouse bathroom. Share brochure.',
    status: 'in_progress',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    products: { name: 'Matte Black Smart Closet', slug: 'matte-black-smart-closet' }
  }
]

export const FALLBACK_APPOINTMENTS: any[] = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    customer_name: 'Dr. Mahesh Patil',
    phone: '+91 98900 98900',
    email: 'mahesh@example.com',
    appointment_date: new Date(Date.now() + 3600000 * 24 * 2).toISOString(),
    message: 'Renovating my clinic lobby. Need to inspect heavy duty slabs.',
    status: 'scheduled',
    created_at: new Date().toISOString()
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    customer_name: 'Suresh Gaikwad',
    phone: '+91 98450 98450',
    email: null,
    appointment_date: new Date(Date.now() + 3600000 * 24 * 3).toISOString(),
    message: 'Need bathroom concepts walkthrough.',
    status: 'pending',
    created_at: new Date().toISOString()
  }
]

