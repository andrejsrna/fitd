// middleware.js
import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  const host = request.headers.get('host')

  // Vylúčiť presmerovanie pre admin.fitdoplnky.sk
  if (host === 'admin.fitdoplnky.sk') {
    return NextResponse.next()
  }

   if (pathname.startsWith('/clanky') || pathname.startsWith('/pages')) {
    console.log('Skipping redirect for /clanky or /api')
    return NextResponse.next()
  }

  // Presmerovať len cesty s jedným segmentom (napr. /moj-clanok)
  const slugMatch = /^\/([^\/]+)$/.exec(pathname)
  if (slugMatch) {
    const slug = slugMatch[1]
    const url = request.nextUrl.clone()
    url.pathname = `/clanky/${slug}`
    return NextResponse.redirect(url, 301)
  }

  return NextResponse.next()
}

// Definovanie, pre ktoré cesty sa má middleware uplatniť
export const config = {
  matcher: '/:path*',
}
