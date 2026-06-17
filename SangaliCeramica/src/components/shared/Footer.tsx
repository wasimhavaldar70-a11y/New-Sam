'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, ShieldCheck, ArrowRight } from 'lucide-react'
import { getSettings } from '@/services/api'
import { Settings } from '@/types/database'

export default function Footer() {
  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    getSettings().then(setSettings)
  }, [])

  const websiteName = settings?.website_name || 'Sangli Ceramica'
  const address = settings?.address || 'Sangli-Miraj Road, Vishrambag, Sangli, Maharashtra 416415'
  const phone = settings?.phone || '+91 98765 43210'
  const email = settings?.email || 'info@sangliceramica.com'

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 pt-16 pb-8 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <span className="text-xl font-bold tracking-wider text-white flex items-center gap-1.5">
              <span className="text-accent">SANGLI</span>
              <span className="font-light text-zinc-300">CERAMICA</span>
            </span>
            <p className="text-sm leading-relaxed text-zinc-500">
              Sangli's premier showroom displaying luxury floor slabs, Italian replica tiles, smart sanitary ware, and premium bath fittings. Transforming design visions into landmarks.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-zinc-500">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span>Certified Dealer for Leading Brands</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-accent pl-3">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1 group">
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-700 group-hover:text-accent transition-colors" />
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors flex items-center gap-1 group">
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-700 group-hover:text-accent transition-colors" />
                  Product Catalog
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors flex items-center gap-1 group">
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-700 group-hover:text-accent transition-colors" />
                  Design Gallery
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-white transition-colors flex items-center gap-1 group">
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-700 group-hover:text-accent transition-colors" />
                  Completed Projects
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors flex items-center gap-1 group">
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-700 group-hover:text-accent transition-colors" />
                  Blogs & Design Trends
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Showroom Location */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-accent pl-3">
              Contact Us
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex gap-2.5">
                <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span className="leading-relaxed">{address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-accent shrink-0" />
                <span>{phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-accent shrink-0" />
                <span className="break-all">{email}</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Showroom Hours */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-accent pl-3">
              Store Hours
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex gap-2.5 items-start">
                <Clock className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Monday - Saturday</p>
                  <p className="text-xs text-zinc-500">09:30 AM - 08:30 PM</p>
                </div>
              </li>
              <li className="flex gap-2.5 items-start">
                <Clock className="h-5 w-5 text-zinc-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-zinc-500">Sunday</p>
                  <p className="text-xs text-zinc-600">Showroom Closed</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-zinc-900 text-xs flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-600">
          <div>
            <p>&copy; {new Date().getFullYear()} Sangli Ceramica. All Rights Reserved.</p>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-zinc-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-zinc-400 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/admin" className="hover:text-zinc-400 transition-colors font-medium text-zinc-500">
              Admin CMS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
