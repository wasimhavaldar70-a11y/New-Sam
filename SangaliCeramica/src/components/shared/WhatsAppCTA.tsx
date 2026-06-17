'use client'

import { MessageSquare } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getSettings } from '@/services/api'
import { Settings } from '@/types/database'

export default function WhatsAppCTA() {
  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    getSettings().then(setSettings)
  }, [])

  const whatsappNum = settings?.whatsapp || '919876543210'
  const message = encodeURIComponent(
    'Hello Sangli Ceramica, I am interested in your premium tile collections and sanitary ware. Please share your latest catalog.'
  )
  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${message}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-45 bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-108 flex items-center justify-center group border border-emerald-500/20"
      aria-label="Inquire on WhatsApp"
    >
      <MessageSquare className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 ease-out text-sm font-semibold whitespace-nowrap">
        Inquire on WhatsApp
      </span>
    </a>
  )
}
