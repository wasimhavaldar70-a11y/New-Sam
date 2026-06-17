'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isDbConfigured } from '@/services/api'
import { adminLogin } from '@/app/actions/adminActions'
import { KeyRound, Mail, Loader2, Sparkles, Database } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isPreview, setIsPreview] = useState(false)

  useEffect(() => {
    isDbConfigured().then((configured) => {
      setIsPreview(!configured)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await adminLogin({ email, password })
      if (res.success) {
        // Redirect to admin dashboard
        router.push('/admin/dashboard')
        router.refresh()
      } else {
        setError(res.error || 'Authentication failed.')
      }
    } catch (err) {
      setError('An error occurred during sign in.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4 relative">
      <div className="absolute inset-0 bg-cover bg-center opacity-5 pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=80')` }}></div>

      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative z-10 glass-panel space-y-6">
        
        {/* Logo and Titles */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1 bg-accent/15 text-accent text-xs font-bold uppercase px-3 py-1 rounded-full border border-accent/20">
            <Sparkles className="h-3.5 w-3.5" /> CMS Panel Access
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Administrator Login
          </h1>
          <p className="text-xs text-zinc-500 font-light">
            Authenticate to manage products, categories, leads, and store settings.
          </p>
        </div>

        {/* Credentials Helper in Offline mode */}
        {isPreview && (
          <div className="bg-amber-600/10 border border-amber-500/20 text-amber-200 p-4 rounded-2xl text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold">
              <Database className="h-3.5 w-3.5 text-amber-400" />
              <span>Offline Preview Mode Credentials</span>
            </div>
            <p className="text-zinc-400 font-light">
              Log in with these credentials to review the admin dashboard:
            </p>
            <div className="font-mono bg-zinc-950/65 p-2 rounded-lg border border-zinc-850 space-y-1">
              <div>Email: <span className="text-white font-medium">admin@sangliceramica.com</span></div>
              <div>Pass: <span className="text-white font-medium">admin123</span></div>
            </div>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="bg-red-900/15 border border-red-500/25 text-red-200 px-4 py-3 rounded-xl text-xs text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email input */}
          <div className="space-y-1.5 text-xs">
            <label className="text-zinc-400 font-semibold uppercase tracking-wider">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-700" />
              <input
                type="email"
                placeholder="admin@sangliceramica.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-zinc-950 border border-zinc-850 focus:border-accent focus:ring-1 focus:ring-accent text-white rounded-xl pl-10 pr-3 py-3 text-xs transition-all placeholder-zinc-750"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5 text-xs">
            <label className="text-zinc-400 font-semibold uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-700" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-zinc-950 border border-zinc-855 focus:border-accent focus:ring-1 focus:ring-accent text-white rounded-xl pl-10 pr-3 py-3 text-xs transition-all placeholder-zinc-750"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-101 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer text-xs uppercase tracking-wider"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Authenticating...
              </>
            ) : (
              'Log In to Dashboard'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
