import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  const isAskingAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isAskingLogin = request.nextUrl.pathname.startsWith('/admin/login')

  // Return normal response if keys are not configured yet to avoid crashing, 
  // but enforce offline admin login check if accessing admin routes
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
    if (isAskingAdminRoute) {
      const previewSession = request.cookies.get('sb-admin-preview-session')?.value === 'true'
      if (!previewSession) {
        if (!isAskingLogin) {
          const url = request.nextUrl.clone()
          url.pathname = '/admin/login'
          return NextResponse.redirect(url)
        }
      } else {
        if (isAskingLogin) {
          const url = request.nextUrl.clone()
          url.pathname = '/admin/dashboard'
          return NextResponse.redirect(url)
        }
      }
    }
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (isAskingAdminRoute) {
    if (!user) {
      if (!isAskingLogin) {
        // Redirect anonymous users trying to access admin dashboards to login page
        const url = request.nextUrl.clone()
        url.pathname = '/admin/login'
        return NextResponse.redirect(url)
      }
    } else {
      // User is logged in, check role
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      const isAdmin = profile?.role === 'admin'

      if (isAskingLogin && isAdmin) {
        // Already logged in as admin, redirect to dashboard
        const url = request.nextUrl.clone()
        url.pathname = '/admin/dashboard'
        return NextResponse.redirect(url)
      }

      if (!isAdmin && !isAskingLogin) {
        // Logged in customer tries to access admin routes, redirect to home
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}
