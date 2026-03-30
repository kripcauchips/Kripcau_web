import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js 16.2.0 Proxy (previously Middleware)
 * Protects admin routes and manages session redirects.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    const adminSession = request.cookies.get('admin-session');

    if (!adminSession || adminSession.value !== 'true') {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Prevent logged in users from visiting /login
  if (pathname === '/login') {
    const adminSession = request.cookies.get('admin-session');
    if (adminSession && adminSession.value === 'true') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
