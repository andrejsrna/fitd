// middleware.js
import { NextResponse } from 'next/server';

const MAIN_ORIGIN = 'https://www.fitdoplnky.sk';
const PAGE_SLUGS = new Set(['kontakt', 'ochrana-osobnych-udajov']);

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host');

  if (host === 'admin.fitdoplnky.sk') {
    return handleAdminRequest(request, pathname);
  }

  if (
    pathname.startsWith('/clanky') ||
    pathname.startsWith('/stranky') ||
    pathname.startsWith('/obchod') ||
    pathname.startsWith('/kategoria-produktu') ||
    pathname.startsWith('/znacka') ||
    pathname.startsWith('/tag') ||
    pathname.startsWith('/author') ||
    pathname.startsWith('/produkt')
  ) {
    return NextResponse.next();
  }

  if (pathname === '/' || pathname === '/index') {
    return NextResponse.next();
  }

  const segments = pathname.split('/').filter(Boolean);
  if (segments.length !== 1) {
    return NextResponse.next();
  }

  if (segments[0].includes('.')) {
    return NextResponse.next();
  }

  const slug = segments[0];
  const url = request.nextUrl.clone();
  url.pathname = PAGE_SLUGS.has(slug) ? `/stranky/${slug}` : `/clanky/${slug}`;
  return NextResponse.redirect(url, 301);
}

function handleAdminRequest(request, pathname) {
  if (pathname.startsWith('/wp-content/uploads/')) {
    const cdnPath = pathname.replace('/wp-content/uploads', '');
    return NextResponse.redirect(`https://cdn.fitdoplnky.sk${cdnPath}`, 301);
  }

  if (
    pathname === '/' ||
    pathname === '/index' ||
    pathname === '/index.php' ||
    pathname === '/wp-login.php' ||
    pathname === '/xmlrpc.php' ||
    pathname.startsWith('/wp-admin') ||
    pathname.startsWith('/feed')
  ) {
    return NextResponse.redirect(MAIN_ORIGIN, 301);
  }

  if (pathname.startsWith('/obchod') || pathname.startsWith('/kategoria-produktu')) {
    return NextResponse.redirect(`${MAIN_ORIGIN}${pathname}`, 301);
  }

  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 1 && !segments[0].includes('.')) {
    const slug = segments[0];
    const destination = PAGE_SLUGS.has(slug) ? `/stranky/${slug}` : `/clanky/${slug}`;
    return NextResponse.redirect(`${MAIN_ORIGIN}${destination}`, 301);
  }

  const url = request.nextUrl.clone();
  url.host = 'www.fitdoplnky.sk';
  url.protocol = 'https';
  return NextResponse.redirect(url, 301);
}

// Define middleware paths
export const config = {
  matcher: '/:path*',
};
