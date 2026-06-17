'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Calendar,
  Settings as SettingsIcon,
  LogOut,
  Globe,
  Database,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { adminLogout } from '@/app/actions/adminActions'
import { useEffect, useState, useTransition } from 'react'
import { isDbConfigured } from '@/services/api'

const sidebarLinks = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Products Catalog', href: '/admin/products', icon: Package },
  { name: 'Customer Inquiries', href: '/admin/inquiries', icon: MessageSquare },
  { name: 'Showroom Bookings', href: '/admin/appointments', icon: Calendar },
  { name: 'Store Settings', href: '/admin/settings', icon: SettingsIcon },
]

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isPreview, setIsPreview] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    isDbConfigured().then((configured) => {
      setIsPreview(!configured)
    })
  }, [])

  const handleLogout = async () => {
    startTransition(async () => {
      await adminLogout()
      router.push('/admin/login')
      router.refresh()
    })
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col md:flex-row text-zinc-350">
      {/* Sidebar - Pinned on left */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-zinc-900 bg-zinc-900/50 flex flex-col shrink-0">
        {/* Brand Header */}
        <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
          <Link href="/admin/dashboard" className="group">
            <span className="text-sm font-bold tracking-widest text-white flex items-center gap-1">
              <span className="text-accent">SANGLI</span>
              <span className="font-light text-zinc-400">CMS</span>
            </span>
          </Link>
          <div className="md:hidden">
            {/* Mobile indicator */}
            {isPreview && <Database className="h-4 w-4 text-amber-500" />}
          </div>
        </div>

        {/* Links Navigation */}
        <nav className="flex-grow p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors',
                  isActive
                    ? 'bg-zinc-900 text-accent border border-zinc-800'
                    : 'text-zinc-400 hover:bg-zinc-900/40 hover:text-white'
                )}
              >
                <Icon className={cn('h-4.5 w-4.5', isActive ? 'text-accent' : 'text-zinc-500')} />
                {link.name}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-zinc-900 space-y-2">
          {/* Back to Site Link */}
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-zinc-400 hover:bg-zinc-900/40 hover:text-white transition-colors"
          >
            <Globe className="h-4.5 w-4.5 text-zinc-550" />
            View Website
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isPending}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors cursor-pointer text-left"
          >
            <LogOut className="h-4.5 w-4.5 text-red-500/80" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col min-h-0 bg-zinc-950">
        {/* Top Header Row */}
        <header className="border-b border-zinc-900 px-8 py-4 flex items-center justify-between bg-zinc-950/40">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white">
              {sidebarLinks.find((l) => l.href === pathname)?.name || 'Admin Console'}
            </h2>
          </div>

          {/* Mode Indicator */}
          {isPreview && (
            <div className="bg-amber-600/10 border border-amber-500/20 text-amber-300 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider">
              <Database className="h-3.5 w-3.5 text-amber-500" />
              Preview Mode
            </div>
          )}
        </header>

        {/* Content body */}
        <div className="flex-grow p-8 overflow-y-auto">{children}</div>
      </main>
    </div>
  )
}
