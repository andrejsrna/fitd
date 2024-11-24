// middleware.js

import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Define static redirects
  const redirectMap = {
    //'/vsetko-co-potrebujete-vediet-o-keto-diete': '/clanky/vsetko-co-potrebujete-vediet-o-keto-diete',
    // Add more static redirects here
  }


  // Example: Redirect all root paths to /clanky/*
  const clankyPattern = /^\/([a-zA-Z0-9-]+)\/?$/
  if (clankyPattern.test(pathname)) {
    const newPath = `/clanky${pathname}`
    return NextResponse.redirect(new URL(newPath, request.url), 301)
  }

  // Continue without redirect if no conditions are met
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/:slug*'
  ],
}
