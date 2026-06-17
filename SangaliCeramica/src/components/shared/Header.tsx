'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Calendar, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSettings } from '@/services/api'
import { Settings } from '@/types/database'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Projects', href: '/projects' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    getSettings().then(setSettings)

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const websiteName = settings?.website_name || 'Sangli Ceramica'

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300',
        scrolled ? 'glass-nav py-3 shadow-lg' : 'bg-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl md:text-2xl font-bold tracking-wider text-white flex items-center gap-1.5 font-sans">
              <span className="text-accent">SANGLI</span>
              <span className="font-light text-zinc-300">CERAMICA</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-accent relative py-1',
                    isActive ? 'text-accent font-semibold' : 'text-zinc-300 hover:text-white'
                  )}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Booking CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 bg-accent hover:bg-amber-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-accent/15 hover:shadow-accent/25 hover:scale-102"
            >
              <Calendar className="h-4 w-4" />
              Book Showroom Visit
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-zinc-300 hover:text-white p-2"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[60px] bottom-0 z-35 bg-zinc-950/95 backdrop-blur-lg animate-fade-in border-t border-zinc-900">
          <div className="px-4 pt-6 pb-8 space-y-6 flex flex-col h-full justify-between">
            <div className="space-y-4">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== '/' && pathname.startsWith(link.href))
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      'flex items-center justify-between px-3 py-3 rounded-lg text-base font-medium transition-colors',
                      isActive
                        ? 'bg-zinc-900 text-accent font-bold'
                        : 'text-zinc-300 hover:bg-zinc-900/50 hover:text-white'
                    )}
                  >
                    {link.name}
                    <ChevronRight className="h-4 w-4 text-zinc-600" />
                  </Link>
                );
              })}
            </div>

            <div className="pb-12">
              <Link
                href="/book"
                className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-amber-600 text-white py-3.5 rounded-lg text-base font-semibold transition-all shadow-lg"
              >
                <Calendar className="h-5 w-5" />
                Book Showroom Visit
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
