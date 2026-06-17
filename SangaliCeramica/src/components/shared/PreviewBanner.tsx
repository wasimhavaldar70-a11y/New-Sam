'use client'

import { useEffect, useState } from 'react'
import { isDbConfigured } from '@/services/api'
import { AlertTriangle, Database } from 'lucide-react'

export default function PreviewBanner() {
  const [isPreview, setIsPreview] = useState(false)

  useEffect(() => {
    isDbConfigured().then((configured) => {
      setIsPreview(!configured)
    })
  }, [])

  if (!isPreview) return null

  return (
    <div className="bg-amber-600/90 text-amber-50 backdrop-blur-md px-4 py-2 text-xs md:text-sm font-medium flex items-center justify-between shadow-md sticky top-0 z-50 border-b border-amber-500/20">
      <div className="flex items-center gap-2 mx-auto md:mx-0">
        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-200 animate-pulse" />
        <span>
          <strong>Offline Preview Mode:</strong> Running with a premium local catalog. To connect your live database, configure <code>.env.local</code>.
        </span>
      </div>
      <div className="hidden md:flex items-center gap-4 text-xs">
        <span className="bg-amber-800/40 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
          <Database className="h-3 w-3" />
          Admin Login: admin@sangliceramica.com / admin123
        </span>
      </div>
    </div>
  )
}
