import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * Legacy URL redirects for test levels.
 * Handles problematic "+" in paths (often decoded as space).
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/test/')) {
    return NextResponse.next();
  }

  const segment = pathname.slice('/test/'.length);

  // Redirect legacy numeric ranges.
  if (segment === '50-100') {
    return NextResponse.redirect(new URL('/test/basic', request.url));
  }
  if (segment === '100-150') {
    return NextResponse.redirect(new URL('/test/advanced', request.url));
  }

  // Elite legacy paths: "/test/150+" or encoded "/test/150%2B"
  // NextRequest.pathname is already decoded, so "150+" may arrive as "150 " or "150+".
  const normalized = segment.replace(/\s+/g, '+');
  if (normalized === '150+' || segment === '150%2B') {
    return NextResponse.redirect(new URL('/test/elite', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/test/:path*']
};

