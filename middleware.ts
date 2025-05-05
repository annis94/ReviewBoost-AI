import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Forcer l'utilisation du runtime Node.js
export const config = {
  runtime: 'nodejs',
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};

export async function middleware(request: NextRequest) {
  console.log('Middleware called for URL:', request.url);
  const { pathname } = new URL(request.url);

  // Skip middleware for auth routes and public assets
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static')
  ) {
    console.log('Skipping middleware for path:', pathname);
    return NextResponse.next();
  }

  try {
    // Vérifier si nous avons un token de session valide
    const sessionToken = request.cookies.get('session_token')?.value;
    console.log('Session token found:', sessionToken ? 'Yes' : 'No');
    
    if (!sessionToken) {
      // Essayer de récupérer le shop de différentes sources
      const shop = request.headers.get('x-shopify-shop-domain') || 
                  request.nextUrl.searchParams.get('shop') ||
                  request.cookies.get('shopify_shop')?.value;
      
      console.log('Shop from various sources:', {
        header: request.headers.get('x-shopify-shop-domain'),
        query: request.nextUrl.searchParams.get('shop'),
        cookie: request.cookies.get('shopify_shop')?.value
      });

      if (!shop) {
        console.error('No shop found in any source');
        return NextResponse.json(
          { error: 'No shop provided' },
          { status: 400 }
        );
      }

      // Stocker le shop dans un cookie pour référence future
      const response = NextResponse.redirect(
        new URL(`/api/auth?shop=${shop}`, request.url)
      );
      response.cookies.set('shopify_shop', shop, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });

      console.log('Redirecting to auth with shop:', shop);
      return response;
    }

    // La session est valide, continuer
    console.log('Valid session found, proceeding with request');
    return NextResponse.next();
  } catch (error) {
    console.error('Error in middleware:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 