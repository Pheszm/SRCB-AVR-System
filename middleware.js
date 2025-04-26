// middleware.js
import { NextResponse } from 'next/server'

export async function middleware(request) {
  const { pathname, origin } = request.nextUrl
  const userRole = request.cookies.get('userRole')?.value
  const userID = request.cookies.get('userID')?.value

  // Public routes
  if (pathname === '/login' || pathname === '/') {
    return NextResponse.next()
  }

  // Redirect to role-specific dashboards
  if (pathname === '/') {
    if (!userRole || !userID) return NextResponse.redirect(new URL('/login', origin))
    
    const rolePath = {
      'Incharge': '/Incharge',
      'Admin': '/Admin',
      'Student': '/User',
      'Staff': '/User'
    }[userRole]
    
    if (rolePath) return NextResponse.redirect(new URL(rolePath, origin))
  }

  // Route protection with absolute URLs
  if (pathname.startsWith('/Incharge') && userRole !== 'Incharge') {
    return NextResponse.redirect(new URL('/', origin))
  }

  if (pathname.startsWith('/Admin') && userRole !== 'Admin') {
    return NextResponse.redirect(new URL('/', origin))
  }

  if (pathname.startsWith('/User') && userRole !== 'Student' && userRole !== 'Staff') {
    return NextResponse.redirect(new URL('/', origin))
  }

  // Add user info to headers for backend use
  const response = NextResponse.next()
  if (userID) response.headers.set('x-user-id', userID)
  if (userRole) response.headers.set('x-user-role', userRole)

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}