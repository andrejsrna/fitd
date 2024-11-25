// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host');

  // Exclude redirect for admin.fitdoplnky.sk
  if (host === 'admin.fitdoplnky.sk') {
    return NextResponse.next();
  }

  // Exclude redirect for paths starting with /clanky or /pages
  if (pathname.startsWith('/clanky') || pathname.startsWith('/pages')) {
    console.log('Skipping redirect for /clanky or /pages');
    return NextResponse.next();
  }

  // Exclude root path
  if (pathname === '/' || pathname === '/index') {
    return NextResponse.next();
  }

  // Exclude paths with more than one segment
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length !== 1) {
    return NextResponse.next();
  }

  // Exclude paths with file extensions (e.g., .ico, .png, .css, .js)
  if (segments[0].includes('.')) {
    return NextResponse.next();
  }

  // Redirect paths with a single segment (e.g., /moj-clanok)
  const slug = segments[0];
  const url = request.nextUrl.clone();
  url.pathname = `/clanky/${slug}`;
  return NextResponse.redirect(url, 301);
}

// Define middleware paths
export const config = {
  matcher: '/:path*',
};
