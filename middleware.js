// middleware.js
import { NextResponse } from 'next/server'

export async function middleware(request) {
  const { pathname, origin } = request.nextUrl
  const user_type = request.cookies.get('user_type')?.value
  const user_id = request.cookies.get('user_id')?.value

  // Public routes
  if (pathname === '/login' || pathname === '/') {
    return NextResponse.next()
  }

  // Redirect to role-specific dashboards
  if (pathname === '/') {
    if (!user_type || !user_id) return NextResponse.redirect(new URL('/login', origin))
    
    const rolePath = {
      'Incharge': '/Incharge',
      'Admin': '/Admin',
      'Student': '/User',
      'Staff': '/User'
    }[user_type]
    
    if (rolePath) return NextResponse.redirect(new URL(rolePath, origin))
  }

  // Route protection with absolute URLs
  if (pathname.startsWith('/Incharge') && user_type !== 'Incharge') {
    return NextResponse.redirect(new URL('/', origin))
  }

  if (pathname.startsWith('/Admin') && user_type !== 'Admin') {
    return NextResponse.redirect(new URL('/', origin))
  }

  if (pathname.startsWith('/User') && user_type !== 'Student' && user_type !== 'Staff') {
    return NextResponse.redirect(new URL('/', origin))
  }

  // Add user info to headers for backend use
  const response = NextResponse.next()
  if (user_id) response.headers.set('x-user-id', user_id)
  if (user_type) response.headers.set('x-user-role', user_type)

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}