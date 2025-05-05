import { NextResponse } from 'next/server';
import { shopify, sessionStorage } from '@/lib/shopify';

export async function GET(request: Request) {
  console.log('Auth route called with URL:', request.url);
  
  const { searchParams } = new URL(request.url);
  const shop = searchParams.get('shop');
  console.log('Extracted shop parameter:', shop);

  if (!shop) {
    console.error('No shop parameter provided in URL');
    return NextResponse.json({ error: 'No shop provided' }, { status: 400 });
  }

  // Valider le format du shop
  if (!shopify.utils.sanitizeShop(shop)) {
    console.error('Invalid shop format:', shop);
    return NextResponse.json({ error: 'Invalid shop format' }, { status: 400 });
  }

  try {
    console.log('Checking for existing session...');
    // Vérifier si une session existe déjà
    const sessionId = await shopify.session.getCurrentId({
      isOnline: true,
      rawRequest: request,
      rawResponse: new Response(),
    });
    console.log('Session ID found:', sessionId);

    if (!sessionId) {
      console.log('No existing session, starting new auth flow...');
      // Rediriger vers l'authentification Shopify
      const authRoute = await shopify.auth.begin({
        shop,
        callbackPath: '/api/auth/callback',
        isOnline: true,
        rawRequest: request,
        rawResponse: new Response(),
      });
      console.log('Auth route generated:', authRoute.url);

      return NextResponse.redirect(authRoute.url);
    }

    // La session existe, récupérer les informations
    console.log('Loading existing session...');
    const session = await sessionStorage.loadSession(sessionId);
    console.log('Session loaded:', session ? 'Yes' : 'No');
    
    if (!session || !session.accessToken) {
      console.log('Session invalid or missing token, restarting auth...');
      // Si la session n'existe plus dans le stockage ou n'a pas de token, redémarrer l'authentification
      const authRoute = await shopify.auth.begin({
        shop,
        callbackPath: '/api/auth/callback',
        isOnline: true,
        rawRequest: request,
        rawResponse: new Response(),
      });

      return NextResponse.redirect(authRoute.url);
    }

    // La session est valide, stocker les informations nécessaires
    console.log('Valid session found, setting up response...');
    const response = NextResponse.redirect(new URL('/', request.url));
    
    // Stocker le token de session dans un cookie
    response.cookies.set('session_token', session.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error in auth route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 