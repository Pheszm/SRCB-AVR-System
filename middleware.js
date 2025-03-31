// middleware.js

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export function middleware(req) {
  const userCookie = cookies().get('user'); //user=authenticated

  if (!userCookie) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/User', '/Incharge' ,'/Admin'],  
};