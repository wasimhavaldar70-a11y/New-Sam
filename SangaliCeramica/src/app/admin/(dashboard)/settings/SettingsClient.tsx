'use client'

import { useState, useTransition } from 'react'
import { Settings } from '@/types/database'
import {
  Settings as SettingsIcon,
  Save,
  CheckCircle,
  Loader2,
  Globe,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
} from 'lucide-react'
import { updateSettingsAction } from '@/app/actions/adminActions'

interface SettingsClientProps {
  initialSettings: Settings
}

export default function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [settings, setSettings] = useState<Settings>(initialSettings)
  const [isPending, startTransition] = useTransition()

  // Form states
  const [websiteName, setWebsiteName] = useState(settings.website_name)
  const [address, setAddress] = useState(settings.address)
  const [phone, setPhone] = useState(settings.phone)
  const [email, setEmail] = useState(settings.email)
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp)
  const [googleMap, setGoogleMap] = useState(settings.google_map)

  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    const payload = {
      website_name: websiteName,
      address,
      phone,
      email,
      whatsapp,
      google_map: googleMap,
    }

    startTransition(async () => {
      const res = await updateSettingsAction(payload)
      if (res.success) {
        setSuccessMsg(res.message || 'Settings saved successfully!')
        setSettings((prev) => ({ ...prev, ...payload }))
        setTimeout(() => setSuccessMsg(''), 2500)
      } else {
        setErrorMsg(res.error || 'Failed to save settings')
      }
    })
  }

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-850 p-6 md:p-8 rounded-3xl shadow-xl glass-panel space-y-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-850 pb-2 flex items-center gap-1.5">
          <SettingsIcon className="h-4.5 w-4.5 text-accent" /> Website Configuration
        </h3>

        {errorMsg && (
          <div className="bg-red-900/15 border border-red-500/25 text-red-200 px-4 py-2.5 rounded-xl text-xs text-center">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-950/40 border border-emerald-900 text-emerald-400 px-4 py-2.5 rounded-xl text-xs text-center flex items-center justify-center gap-1.5">
            <CheckCircle className="h-4 w-4" /> {successMsg}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5 text-xs sm:text-sm">
          {/* Website Name */}
          <div className="space-y-1.5 text-xs">
            <label className="text-zinc-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <Globe className="h-3.5 w-3.5 text-accent" /> Website Name *
            </label>
            <input
              type="text"
              value={websiteName}
              onChange={(e) => setWebsiteName(e.target.value)}
              required
              placeholder="e.g. Sangli Ceramica"
              className="w-full bg-zinc-950 border border-zinc-850 text-white rounded-xl px-3 py-2.5 text-xs focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder-zinc-700"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phone */}
            <div className="space-y-1.5 text-xs">
              <label className="text-zinc-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-accent" /> Contact Number *
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="e.g. +91 98765 43210"
                className="w-full bg-zinc-950 border border-zinc-850 text-white rounded-xl px-3 py-2.5 text-xs focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder-zinc-700"
              />
            </div>

            {/* WhatsApp */}
            <div className="space-y-1.5 text-xs">
              <label className="text-zinc-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5 text-accent" /> WhatsApp Number (No symbols) *
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                required
                placeholder="e.g. 919876543210"
                className="w-full bg-zinc-950 border border-zinc-855 text-white rounded-xl px-3 py-2.5 text-xs focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder-zinc-700"
              />
              <span className="text-[10px] text-zinc-550 block">Include country code without + (e.g., 91 for India).</span>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5 text-xs">
            <label className="text-zinc-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <Mail className="h-3.5 w-3.5 text-accent" /> Email Enquiries *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. info@sangliceramica.com"
              className="w-full bg-zinc-950 border border-zinc-850 text-white rounded-xl px-3 py-2.5 text-xs focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder-zinc-700"
            />
          </div>

          {/* Address */}
          <div className="space-y-1.5 text-xs">
            <label className="text-zinc-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-accent" /> Showroom Address *
            </label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="e.g. Sangli-Miraj Road, Vishrambag..."
              className="w-full bg-zinc-950 border border-zinc-850 text-white rounded-xl px-3 py-2.5 text-xs focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder-zinc-700 resize-none"
            />
          </div>

          {/* Google Map Embedded URL */}
          <div className="space-y-1.5 text-xs">
            <label className="text-zinc-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              Google Map iframe Embed URL *
            </label>
            <textarea
              rows={3}
              value={googleMap}
              onChange={(e) => setGoogleMap(e.target.value)}
              required
              placeholder="Paste Google Maps embed URL..."
              className="w-full bg-zinc-950 border border-zinc-850 text-white rounded-xl px-3 py-2.5 text-[11px] focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder-zinc-700 resize-none font-mono"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-accent hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-101 disabled:opacity-55 cursor-pointer text-xs uppercase tracking-wider"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving changes...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save Global Configuration
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
