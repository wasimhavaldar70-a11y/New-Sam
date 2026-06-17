-- SANGLI CERAMICA DATABASE SCHEMA MIGRATION
-- Paste this script directly into the Supabase SQL Editor to configure your database.

-- =========================================================================
-- 1. CLEANUP & EXTENSIONS
-- =========================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.is_admin();
DROP TABLE IF EXISTS public.settings;
DROP TABLE IF EXISTS public.blogs;
DROP TABLE IF EXISTS public.projects;
DROP TABLE IF EXISTS public.gallery;
DROP TABLE IF EXISTS public.testimonials;
DROP TABLE IF EXISTS public.appointments;
DROP TABLE IF EXISTS public.inquiries;
DROP TABLE IF EXISTS public.product_images;
DROP TABLE IF EXISTS public.products;
DROP TABLE IF EXISTS public.categories;
DROP TABLE IF EXISTS public.users;

-- =========================================================================
-- 2. CREATE TABLES
-- =========================================================================

-- USERS TABLE (Syncs with auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CONSTRAINT role_check CHECK (role IN ('admin', 'customer')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- CATEGORIES TABLE
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- PRODUCTS TABLE
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    price NUMERIC NOT NULL DEFAULT 0 CONSTRAINT price_positive CHECK (price >= 0),
    brand TEXT DEFAULT 'Premium Brand',
    size TEXT, -- e.g., '600x1200 mm'
    finish TEXT, -- e.g., 'Glossy', 'Matt', 'Carving'
    material TEXT, -- e.g., 'Vitrified', 'Ceramic', 'Porcelain'
    stock_status TEXT NOT NULL DEFAULT 'In Stock' CONSTRAINT stock_status_check CHECK (stock_status IN ('In Stock', 'Out of Stock', 'Call for Availability')),
    featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- PRODUCT IMAGES TABLE
CREATE TABLE public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- INQUIRIES (LEADS) TABLE
CREATE TABLE public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CONSTRAINT status_check CHECK (status IN ('pending', 'in_progress', 'completed')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- APPOINTMENTS (BOOKINGS) TABLE
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    appointment_date TIMESTAMPTZ NOT NULL,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CONSTRAINT appointment_status_check CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- TESTIMONIALS (REVIEWS) TABLE
CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    designation TEXT,
    review TEXT NOT NULL,
    rating INTEGER NOT NULL CONSTRAINT rating_range CHECK (rating >= 1 AND rating <= 5),
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- GALLERY TABLE
CREATE TABLE public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL, -- e.g., 'Living Room', 'Bathroom', 'Elevation'
    created_at TIMESTAMPTZ DEFAULT now()
);

-- PROJECTS TABLE
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- BLOGS TABLE
CREATE TABLE public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    featured_image TEXT,
    published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- SETTINGS TABLE (Website Globals - Single Row Enforced)
CREATE TABLE public.settings (
    id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000000'::uuid,
    website_name TEXT NOT NULL DEFAULT 'Sangli Ceramica',
    logo TEXT,
    address TEXT NOT NULL DEFAULT 'Sangli-Miraj Road, Vishrambag, Sangli, Maharashtra 416415',
    phone TEXT NOT NULL DEFAULT '+91 98765 43210',
    email TEXT NOT NULL DEFAULT 'info@sangliceramica.com',
    whatsapp TEXT NOT NULL DEFAULT '919876543210',
    google_map TEXT NOT NULL DEFAULT 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3817.9626359570183!2d74.603348!3d16.852923!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc1230000000001%3A0x6b4fd4ef9c5f884f!2sSangli!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT settings_single_row CHECK (id = '00000000-0000-0000-0000-000000000000'::uuid)
);

-- =========================================================================
-- 3. INDEXES FOR PERFORMANCE
-- =========================================================================
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_product_images_product ON public.product_images(product_id);
CREATE INDEX idx_inquiries_product ON public.inquiries(product_id);
CREATE INDEX idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX idx_blogs_slug ON public.blogs(slug);

-- =========================================================================
-- 4. AUTH SYNC TRIGGER
-- =========================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, name, email, phone, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'Valued Customer'),
    new.email,
    new.raw_user_meta_data->>'phone',
    COALESCE(new.raw_user_meta_data->>'role', 'customer')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Helper function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- 5.1 Users policies
CREATE POLICY "Allow users to read their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id OR is_admin());
CREATE POLICY "Allow admins to update profiles" ON public.users
  FOR UPDATE USING (is_admin());

-- 5.2 Categories policies
CREATE POLICY "Allow public read access to categories" ON public.categories
  FOR SELECT USING (true);
CREATE POLICY "Allow admins full access to categories" ON public.categories
  ALL USING (is_admin());

-- 5.3 Products policies
CREATE POLICY "Allow public read access to products" ON public.products
  FOR SELECT USING (true);
CREATE POLICY "Allow admins full access to products" ON public.products
  ALL USING (is_admin());

-- 5.4 Product Images policies
CREATE POLICY "Allow public read access to product images" ON public.product_images
  FOR SELECT USING (true);
CREATE POLICY "Allow admins full access to product images" ON public.product_images
  ALL USING (is_admin());

-- 5.5 Inquiries policies
CREATE POLICY "Allow anyone to insert an inquiry" ON public.inquiries
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admins full access to inquiries" ON public.inquiries
  ALL USING (is_admin());

-- 5.6 Appointments policies
CREATE POLICY "Allow anyone to insert an appointment" ON public.appointments
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admins full access to appointments" ON public.appointments
  ALL USING (is_admin());

-- 5.7 Testimonials policies
CREATE POLICY "Allow public read access to testimonials" ON public.testimonials
  FOR SELECT USING (true);
CREATE POLICY "Allow admins full access to testimonials" ON public.testimonials
  ALL USING (is_admin());

-- 5.8 Gallery policies
CREATE POLICY "Allow public read access to gallery" ON public.gallery
  FOR SELECT USING (true);
CREATE POLICY "Allow admins full access to gallery" ON public.gallery
  ALL USING (is_admin());

-- 5.9 Projects policies
CREATE POLICY "Allow public read access to projects" ON public.projects
  FOR SELECT USING (true);
CREATE POLICY "Allow admins full access to projects" ON public.projects
  ALL USING (is_admin());

-- 5.10 Blogs policies
CREATE POLICY "Allow public read access to published blogs" ON public.blogs
  FOR SELECT USING (published = true OR is_admin());
CREATE POLICY "Allow admins full access to blogs" ON public.blogs
  ALL USING (is_admin());

-- 5.11 Settings policies
CREATE POLICY "Allow public read access to settings" ON public.settings
  FOR SELECT USING (true);
CREATE POLICY "Allow admins full access to settings" ON public.settings
  ALL USING (is_admin());

-- =========================================================================
-- 6. SEED INITIAL DATA
-- =========================================================================

-- 6.1 Default Website Settings
INSERT INTO public.settings (id, website_name, address, phone, email, whatsapp)
VALUES (
  '00000000-0000-0000-0000-000000000000'::uuid,
  'Sangli Ceramica',
  'Sangli-Miraj Road, Vishrambag, Sangli, Maharashtra 416415',
  '+91 98765 43210',
  'info@sangliceramica.com',
  '919876543210'
) ON CONFLICT (id) DO NOTHING;

-- 6.2 Categories
INSERT INTO public.categories (id, name, slug, image_url, description) VALUES
('b1111111-1111-1111-1111-111111111111'::uuid, 'Floor Tiles', 'floor-tiles', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80', 'Premium glazed vitrified tiles for elegant living spaces.'),
('b2222222-2222-2222-2222-222222222222'::uuid, 'Wall Tiles', 'wall-tiles', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80', 'Stylish wall tiles for kitchens, bathrooms, and features.'),
('b3333333-3333-3333-3333-333333333333'::uuid, 'Sanitary Ware', 'sanitary-ware', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80', 'Premium designer closets, wash basins, and vanities.'),
('b4444444-4444-4444-4444-444444444444'::uuid, 'Bath Fittings', 'bath-fittings', 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=600&q=80', 'Elegant faucets, showers, and designer bath accessories.'),
('b5555555-5555-5555-5555-555555555555'::uuid, 'Outdoor & Parking', 'outdoor-parking-tiles', 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=600&q=80', 'Heavy-duty exterior tiles designed to withstand heavy loads and weather.')
ON CONFLICT (slug) DO NOTHING;

-- 6.3 Products
INSERT INTO public.products (id, category_id, name, slug, description, price, brand, size, finish, material, stock_status, featured) VALUES
('c1111111-1111-1111-1111-111111111111'::uuid, 'b1111111-1111-1111-1111-111111111111'::uuid, 'Royal Statuario White', 'royal-statuario-white', 'Exquisite Italian replica white vitrified tiles with golden and grey veins.', 1250, 'Somany Premium', '800x1600 mm', 'Glossy / High Gloss', 'Glazed Vitrified', 'In Stock', true),
('c2222222-2222-2222-2222-222222222222'::uuid, 'b1111111-1111-1111-1111-111111111111'::uuid, 'Armani Bronze', 'armani-bronze', 'Luxurious dark brown marble-look tiles with fine crystalline webs.', 1450, 'Kajaria Eternity', '800x1600 mm', 'Super Glossy', 'Glazed Vitrified', 'In Stock', true),
('c3333333-3333-3333-3333-333333333333'::uuid, 'b2222222-2222-2222-2222-222222222222'::uuid, 'Hexa Deco Mint', 'hexa-deco-mint', 'Modern hexagonal ceramic tiles in mint green color, perfect for kitchen splashbacks.', 850, 'Simpolo Ceramica', '300x300 mm', 'Satin / Matt', 'Ceramic', 'In Stock', false),
('c4444444-4444-4444-4444-444444444444'::uuid, 'b3333333-3333-3333-3333-333333333333'::uuid, 'Matte Black Smart Closet', 'matte-black-smart-closet', 'Luxury intelligent wall-hung toilet featuring auto-flush, seat heating, and bidet controls.', 45000, 'TOTO', 'Standard', 'Matte', 'Ceramic Vitreous China', 'In Stock', true),
('c5555555-5555-5555-5555-555555555555'::uuid, 'b4444444-4444-4444-4444-444444444444'::uuid, 'Rose Gold Basin Mixer', 'rose-gold-basin-mixer', 'Sophisticated brass basin faucet with a durable rose gold PVD coating.', 6500, 'Jaquar Artize', 'PVD Mirror Finish', 'Solid Brass', 'In Stock', true),
('c6666666-6666-6666-6666-666666666666'::uuid, 'b5555555-5555-5555-5555-555555555555'::uuid, 'Stone Grip Grey Parking', 'stone-grip-grey-parking', 'Heavy-duty 16mm vitrified tiles with high slip-resistance for driveways.', 620, 'Kajaria', 'Rough / Anti-skid', 'Vitrified', 'In Stock', false)
ON CONFLICT (slug) DO NOTHING;

-- 6.4 Product Images
INSERT INTO public.product_images (product_id, image_url, sort_order) VALUES
('c1111111-1111-1111-1111-111111111111'::uuid, 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=600&q=80', 0),
('c1111111-1111-1111-1111-111111111111'::uuid, 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80', 1),
('c2222222-2222-2222-2222-222222222222'::uuid, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80', 0),
('c3333333-3333-3333-3333-333333333333'::uuid, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80', 0),
('c4444444-4444-4444-4444-444444444444'::uuid, 'https://images.unsplash.com/photo-1521207418485-99c705420785?auto=format&fit=crop&w=600&q=80', 0),
('c5555555-5555-5555-5555-555555555555'::uuid, 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=600&q=80', 0);

-- 6.5 Testimonials
INSERT INTO public.testimonials (name, designation, review, rating, image_url) VALUES
('Rahul Deshmukh', 'Architect, Sangli', 'Sangli Ceramica has an incredible collection of large slab tiles. The designs are premium and their suggestions helped us finalize the floorings for our luxury villa project.', 5, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'),
('Priya Kulkarni', 'Home Owner, Vishrambag', 'I bought my bathroom sanitary ware and rose gold faucets from here. It has been 2 years and everything functions perfectly. Highly recommend their high-end Jaquar fittings!', 5, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'),
('Amit Patil', 'Builder, Patil Developers', 'Reliable pricing, prompt delivery, and highly professional staff. We source all our tiles in bulk for commercial projects in Sangli from them.', 5, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80');

-- 6.6 Gallery Showcase
INSERT INTO public.gallery (title, image_url, category) VALUES
('Modern Living Room Slab Tiles', 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=600&q=80', 'Living Room'),
('Premium Bathroom with Wall Hung Closet', 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=600&q=80', 'Bathroom'),
('Lobby Entrance Slab Work', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=600&q=80', 'Lobby'),
('Modern Kitchen Backsplash', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80', 'Kitchen');

-- 6.7 Projects Completed
INSERT INTO public.projects (title, description, location, image_url) VALUES
('The White House Villa', 'Complete flooring work with 800x1600mm Statuario slabs, luxury bathrooms, and modern elevation cladding.', 'Vishrambag, Sangli', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'),
('Heights Commercial Complex', 'High-traffic parking tiles and vitrified corridors for a 5-storey shopping and office space.', 'Miraj, Sangli', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'),
('Patil Residence Bathroom Reno', 'Retrofitting bathroom with smart sanitaries, wall-hung items, and matching grey terrazzo theme.', 'South Shivaji Nagar, Sangli', 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=600&q=80');

-- 6.8 Blogs
INSERT INTO public.blogs (title, slug, content, featured_image, published) VALUES
('How to Choose the Perfect Tiles for Your Living Room', 'how-to-choose-living-room-tiles', 'Choosing the right tiles for your living room is one of the most critical aspects of interior design. Large format glazed vitrified tiles (GVT) in sizes like 800x1600mm are extremely popular today as they reduce grout lines and make the space look massive. Light colors like white, beige, and light grey reflect more light, making your room brighter. For a premium look, you can select marble replicas like Royal Statuario or Carrara White.', 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=600&q=80', true),
('5 Bathroom Sanitary Ware Trends in 2026', 'bathroom-sanitary-ware-trends-2026', 'Bathroom designs have evolved from pure utility to premium personal wellness sanctuaries. Smart toilets with auto flushing and sanitization, matte black wall-hung closets, and thin-rim tabletop basins are leading the trend this year. Integrating concealed divertors and rose-gold fittings offers an ultra-luxurious feel. Visit Sangli Ceramica to see these setups live!', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80', true);
