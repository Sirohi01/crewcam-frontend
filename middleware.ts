import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hasSession = request.cookies.get('has_session_employer')?.value === 'true';
  const isRsc = request.headers.has('rsc') || request.nextUrl.searchParams.has('_rsc');

  const isDashboardArea = pathname.startsWith('/dashboard');
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');

  if (isDashboardArea && !hasSession) {
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
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
