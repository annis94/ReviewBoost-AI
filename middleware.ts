import { NextRequest, NextResponse } from 'next/server';

// Forcer l'utilisation du runtime Node.js
export const config = {
  runtime: 'nodejs',
  matcher: '/:path*', // Match absolument tout temporairement
};

export function middleware(request: NextRequest) {
  // Logs détaillés de la requête
  console.log('=== MIDDLEWARE DEBUG INFO ===');
  console.log(`Request URL: ${request.url}`);
  console.log(`Request Method: ${request.method}`);
  console.log(`Request Headers:`, Object.fromEntries(request.headers.entries()));
  console.log(`Search Params:`, Object.fromEntries(request.nextUrl.searchParams.entries()));
  
  // Log des cookies de manière compatible
  const cookies: Record<string, string> = {};
  request.cookies.getAll().forEach(cookie => {
    cookies[cookie.name] = cookie.value;
  });
  console.log(`Cookies:`, cookies);
  
  console.log('===========================');

  // Vérifier spécifiquement le paramètre shop
  const shopParam = request.nextUrl.searchParams.get('shop');
  console.log(`Shop Query Param = ${shopParam}`);

  // Si pas de shop, vérifier les autres sources possibles
  if (!shopParam) {
    const shopFromHeader = request.headers.get('x-shopify-shop-domain');
    const shopFromCookie = request.cookies.get('shopify_shop')?.value;
    console.log('Shop from other sources:', {
      header: shopFromHeader,
      cookie: shopFromCookie
    });
  }

  // Pour l'instant, on laisse passer toutes les requêtes
  return NextResponse.next();
} 