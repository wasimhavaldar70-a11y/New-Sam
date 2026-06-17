'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  Truck,
  HelpCircle,
  MapPin,
  Phone,
  Calendar,
  Layers,
  Star,
} from 'lucide-react'
import {
  getCategories,
  getProducts,
  getTestimonials,
  getProjects,
  getSettings,
} from '@/services/api'
import { Category, Product, Testimonial, Project, Settings } from '@/types/database'
import { FALLBACK_SETTINGS } from '@/services/fallbackData'
import { formatPrice } from '@/lib/utils'

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [cats, prods, reviews, activeProjects, siteSettings] = await Promise.all([
          getCategories(),
          getProducts({ featured: true, limit: 4 }),
          getTestimonials(),
          getProjects(),
          getSettings(),
        ])
        setCategories(cats)
        setFeaturedProducts(prods.products)
        setTestimonials(reviews.slice(0, 3))
        setProjects(activeProjects.slice(0, 3))
        setSettings(siteSettings)
      } catch (err) {
        console.error('Failed to load home page data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadHomeData()
  }, [])

  const phone = settings?.phone || '+91 98765 43210'
  const address = settings?.address || 'Sangli-Miraj Road, Vishrambag, Sangli, Maharashtra'

  return (
    <div className="space-y-24 pb-20">
      {/* SECTION 1: HERO SECTION */}
      <section className="relative min-h-[65vh] flex items-center justify-center bg-radial from-zinc-900 via-zinc-950 to-black overflow-hidden pt-28 pb-16 md:pb-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-900/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-accent text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            Premium Design Destination
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Redefine Luxury for Your <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-accent via-amber-400 to-white bg-clip-text text-transparent">
              Living Spaces
            </span>
          </h1>

          <p className="text-base md:text-lg text-zinc-400 max-w-2xl mx-auto font-medium">
            Explore premium tiles, high-end Italian slabs, modern sanitary ware, and luxurious bath fittings at Sangli's largest designer showroom.
          </p>

          <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center pt-2">
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-zinc-150 text-zinc-950 px-6 py-3 rounded-xl text-base font-bold transition-all shadow-xl hover:scale-103"
            >
              Explore Products
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/book"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-white px-6 py-3 rounded-xl text-base font-bold transition-all hover:scale-103 glass-panel"
            >
              <Calendar className="h-5 w-5 text-accent" />
              Book Showroom Visit
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2: DYNAMIC CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Exclusive Collections
          </h2>
          <p className="text-zinc-500 max-w-xl mx-auto text-sm md:text-base">
            Browse our curated categories handpicked for high-end residential and commercial builds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-80 bg-zinc-900 rounded-2xl animate-pulse border border-zinc-800"
                ></div>
              ))
            : categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="group relative h-84 rounded-2xl overflow-hidden border border-zinc-800 flex flex-col justify-end p-6 hover:border-accent/40 transition-all duration-300 shadow-lg"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${cat.image_url})` }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>

                  <div className="relative z-10 space-y-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors flex items-center gap-1">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-light">
                      {cat.description}
                    </p>
                  </div>
                </Link>
              ))}
        </div>
      </section>

      {/* SECTION 3: FEATURED PRODUCTS */}
      <section className="bg-zinc-950 border-y border-zinc-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-accent">
                Trending Slabs & Fixtures
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                Featured Showroom Highlights
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-accent hover:text-amber-500 font-semibold text-sm transition-colors group"
            >
              View All Products
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[420px] bg-zinc-900 rounded-2xl border border-zinc-800 animate-pulse"
                  ></div>
                ))
              : featuredProducts.map((prod) => {
                  const image =
                    prod.product_images && prod.product_images.length > 0
                      ? prod.product_images[0].image_url
                      : 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80'
                  return (
                    <Link
                      key={prod.id}
                      href={`/products/${prod.slug}`}
                      className="group bg-zinc-900/50 rounded-2xl overflow-hidden border border-zinc-850 hover:border-zinc-800 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* Image */}
                        <div className="h-60 relative overflow-hidden bg-zinc-950">
                          <img
                            src={image}
                            alt={prod.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          {prod.featured && (
                            <span className="absolute top-4 left-4 bg-accent text-zinc-950 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                              Featured
                            </span>
                          )}
                        </div>

                        {/* Details */}
                        <div className="p-6 space-y-3">
                          <span className="text-xs text-zinc-500 font-medium tracking-wide">
                            {prod.brand}
                          </span>
                          <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors line-clamp-1">
                            {prod.name}
                          </h3>
                          <div className="flex flex-wrap gap-1.5 text-xs text-zinc-400">
                            {prod.size && (
                              <span className="bg-zinc-850 px-2 py-0.5 rounded-md border border-zinc-800">
                                {prod.size}
                              </span>
                            )}
                            {prod.finish && (
                              <span className="bg-zinc-850 px-2 py-0.5 rounded-md border border-zinc-800">
                                {prod.finish}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="p-6 pt-0 border-t border-zinc-900 mt-4 flex items-center justify-between">
                        <span className="text-lg font-bold text-white">
                          {formatPrice(prod.price)}
                        </span>
                        <span className="text-accent text-xs font-bold group-hover:translate-x-1.5 transition-transform duration-300 flex items-center gap-1">
                          Inquire Now <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </Link>
                  )
                })}
          </div>
        </div>
      </section>

      {/* SECTION 4: WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-accent">
            Our Commitment
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Why Decorators Choose Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-zinc-900/40 p-8 rounded-2xl border border-zinc-850 space-y-4 hover:border-zinc-800 transition-colors">
            <div className="h-12 w-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Premium Quality Assured</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              We source directly from leading manufacturers and premium Italian replica slab brands, ensuring defect-free shipments and design exclusivity.
            </p>
          </div>

          <div className="bg-zinc-900/40 p-8 rounded-2xl border border-zinc-850 space-y-4 hover:border-zinc-800 transition-colors">
            <div className="h-12 w-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Massive Collection</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              View hundreds of tile designs, finishes, custom basins, smart closets, and gold mixers displayed in realistic mock settings inside our showroom.
            </p>
          </div>

          <div className="bg-zinc-900/40 p-8 rounded-2xl border border-zinc-850 space-y-4 hover:border-zinc-800 transition-colors">
            <div className="h-12 w-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
              <Truck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Reliable Logistics</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Our specialized tile-loading vans and careful logistics handling guarantee that your premium ceramics reach your site safely and in perfect condition.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: PROJECT SHOWCASE */}
      <section className="bg-zinc-950 border-y border-zinc-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              Portfolio
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Completed Projects
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto text-sm md:text-base">
              See how our premium slabs and fittings transform villas and commercial landmarks in Maharashtra.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-96 bg-zinc-900 rounded-2xl animate-pulse border border-zinc-800"
                  ></div>
                ))
              : projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="group bg-zinc-900/30 rounded-2xl overflow-hidden border border-zinc-850 hover:border-zinc-800 transition-all duration-300"
                  >
                    <div className="h-64 relative overflow-hidden bg-zinc-950">
                      <img
                        src={proj.image_url || ''}
                        alt={proj.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-1 text-xs text-accent font-semibold">
                        <MapPin className="h-3.5 w-3.5" />
                        {proj.location}
                      </div>
                      <h3 className="text-lg font-bold text-white">{proj.title}</h3>
                      <p className="text-xs text-zinc-500 leading-relaxed font-light">
                        {proj.description}
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: CLIENT REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-accent">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            What Architects & Homeowners Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-60 bg-zinc-900 rounded-2xl animate-pulse border border-zinc-800"
                ></div>
              ))
            : testimonials.map((review) => (
                <div
                  key={review.id}
                  className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-850 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: review.rating }).map((_, idx) => (
                        <Star key={idx} className="h-4 w-4 fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-sm italic text-zinc-400 leading-relaxed font-light">
                      "{review.review}"
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-6 pt-6 border-t border-zinc-850">
                    {review.image_url && (
                      <img
                        src={review.image_url}
                        alt={review.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-white">{review.name}</h4>
                      <p className="text-xs text-zinc-500">{review.designation}</p>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </section>

      {/* SECTION 7: APPOINTMENT CTA & MAP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Banner Details */}
        <div className="space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            Ready to design your <br />
            dream space? Visit us!
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-light">
            Book a VIP visit to our Sangli showroom. Meet our specialized design consultant, inspect catalog slabs, and receive custom bulk discounts for commercial or home renovations.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-accent shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">Showroom Address</h4>
                <p className="text-xs text-zinc-500 mt-0.5">{address}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="h-6 w-6 text-accent shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">Phone Enquiries</h4>
                <p className="text-xs text-zinc-500 mt-0.5">{phone}</p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 bg-accent hover:bg-amber-600 text-white px-8 py-3.5 rounded-xl text-base font-bold transition-all shadow-lg shadow-accent/15"
            >
              <Calendar className="h-5 w-5" />
              Schedule Showroom Visit
            </Link>
          </div>
        </div>

        {/* Embedded Map */}
        <div className="h-80 sm:h-96 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl">
          <iframe
            src={settings?.google_map || FALLBACK_SETTINGS.google_map}
            className="w-full h-full border-none grayscale invert contrast-[1.15]"
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Sangli Ceramica Showroom Google Map Location"
          ></iframe>
        </div>
      </section>
    </div>
  )
}
