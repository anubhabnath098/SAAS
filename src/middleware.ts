import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest, NextFetchEvent } from 'next/server'

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"])

export default async function middleware(request: NextRequest, event: NextFetchEvent) {
  // Clerk authentication
  const auth = clerkMiddleware((auth, req) => {
    if (isProtectedRoute(req)) auth.protect()
  })

  // CORS handling
  const origin = request.headers.get('origin') ?? ''
  
  const allowedOrigins = [
    'http://localhost:3000',
    'http://www.localhost:3000',
    // Add more origins as needed
  ]
  
  const isAllowedOrigin = allowedOrigins.includes(origin)
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': isAllowedOrigin ? origin : '',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  }

  // First, handle CORS logic for API routes
  if (request.url.includes('/api/')) {
    const response = NextResponse.next({
      headers: corsHeaders,
    })

    // If it's an OPTIONS request (pre-flight), return early to avoid further processing
    if (request.method === 'OPTIONS') {
      return response
    }

    // Otherwise, proceed with the CORS headers applied
    return response
  }

  // Now run Clerk authentication logic
  return auth(request, event)
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
