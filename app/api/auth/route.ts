import { NextResponse } from 'next/server';
import { shopify, sessionStorage } from '@/lib/shopify';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shop = searchParams.get('shop');

  if (!shop) {
    return NextResponse.json({ error: 'No shop provided' }, { status: 400 });
  }

  try {
    // Vérifier si une session existe déjà
    const sessionId = await shopify.session.getCurrentId({
      isOnline: true,
      rawRequest: request,
      rawResponse: new Response(),
    });

    if (!sessionId) {
      // Rediriger vers l'authentification Shopify
      const authRoute = await shopify.auth.begin({
        shop,
        callbackPath: '/api/auth/callback',
        isOnline: true,
        rawRequest: request,
        rawResponse: new Response(),
      });

      return NextResponse.redirect(authRoute.url);
    }

    // La session existe, récupérer les informations
    const session = await sessionStorage.loadSession(sessionId);
    
    if (!session || !session.accessToken) {
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