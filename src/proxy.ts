import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
  const hasSession = request.cookies.get('has_session')?.value === 'true';
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register');
  const isProtectedPath = request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/super-admin');

  const isRsc = request.headers.has('rsc') || request.nextUrl.searchParams.has('_rsc');

  if (isProtectedPath && !hasSession) {
    if (isRsc) return NextResponse.next();
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthPage && hasSession) {
    if (isRsc) return NextResponse.next();
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/super-admin/:path*', '/login', '/register'],
};
