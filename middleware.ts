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
  const { pathname } = new URL(request.url);

  // Skip middleware for auth routes and public assets
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static')
  ) {
    return NextResponse.next();
  }

  try {
    // Vérifier si nous avons un token de session valide
    const sessionToken = request.cookies.get('session_token')?.value;
    
    if (!sessionToken) {
      // Rediriger vers l'authentification si pas de session
      const shop = request.headers.get('x-shopify-shop-domain');
      if (!shop) {
        return NextResponse.json(
          { error: 'No shop provided' },
          { status: 400 }
        );
      }

      return NextResponse.redirect(
        new URL(`/api/auth?shop=${shop}`, request.url)
      );
    }

    // La session est valide, continuer
    return NextResponse.next();
  } catch (error) {
    console.error('Error in middleware:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 