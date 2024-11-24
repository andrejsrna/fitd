// middleware.js

import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Definujte mapovanie starých cesty na nové
  const redirectMap = {
    // '/vsetko-co-potrebujete-vediet-o-keto-diete': '/clanky/vsetko-co-potrebujete-vediet-o-keto-diete',
    // Pridajte ďalšie konkrétne presmerovania tu
    // '/stara-cesta': '/nova-cesta',
  }


  // Príklad pre presmerovanie z root na /clanky/
  // Všetky cesty, ktoré sa nachádzajú v root a potrebujú byť presmerované pod /clanky/
  const clankyRedirectPattern = /^\/([a-zA-Z0-9-]+)\/?$/
  if (clankyRedirectPattern.test(pathname)) {
    const newPath = `/clanky${pathname}`
    return NextResponse.redirect(new URL(newPath, request.url), 301)
  }

  // Ak neexistuje žiadne presmerovanie, pokračujte bez zmien
  return NextResponse.next()
}

// Definujte, pre ktoré cesty sa má middleware aplikovať
export const config = {
  matcher: [
    '/:slug*', // Prispôsobte podľa potreby
  ],
}
