import { NextRequest, NextResponse } from 'next/server';

// Configuration minimale pour le middleware
export const config = {
  matcher: [
    // Match toutes les routes sauf les assets statiques
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

export function middleware(request: NextRequest) {
  // Logs détaillés de la requête
  console.log('\n=== MIDDLEWARE DEBUG INFO ===');
  console.log(`Request URL: ${request.url}`);
  
  // Log de tous les paramètres de l'URL
  const allParams = Object.fromEntries(request.nextUrl.searchParams.entries());
  console.log('All URL Parameters:', allParams);
  
  // Vérification explicite du paramètre shop
  const shopParam = request.nextUrl.searchParams.get('shop');
  console.log('Shop Parameter (direct):', shopParam);
  
  // Vérification alternative
  const shopParamAlt = allParams['shop'];
  console.log('Shop Parameter (from allParams):', shopParamAlt);
  
  // Vérification de l'URL brute
  console.log('Raw URL:', request.nextUrl.toString());
  console.log('Search String:', request.nextUrl.search);
  
  // Pour le test, on retourne une erreur si pas de shop
  if (!shopParam) {
    console.log('❌ No shop parameter found in URL');
    console.log('Full request details:', {
      url: request.url,
      searchParams: allParams,
      rawSearch: request.nextUrl.search
    });
    return NextResponse.json(
      { error: 'No shop provided' },
      { status: 400 }
    );
  }

  console.log('✅ Shop parameter found:', shopParam);
  console.log('===========================\n');
  
  return NextResponse.next();
} 