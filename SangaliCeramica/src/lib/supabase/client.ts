import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const createClient = () => {
  // If keys are not set, print a helpful warning but don't crash the bundle
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
    if (typeof window !== 'undefined') {
      console.warn('Supabase URL/Key is missing or not set. Please configure .env.local.')
    }
  }
  return createBrowserClient(
    supabaseUrl || 'https://placeholder-project-id.supabase.co',
    supabaseAnonKey || 'placeholder-anon-key'
  )
}
export const supabase = createClient()
