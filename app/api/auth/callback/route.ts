import { NextResponse } from 'next/server';
import { shopify, sessionStorage } from '@/lib/shopify';

export async function GET(request: Request) {
  console.log('Callback route called with URL:', request.url);
  
  const { searchParams } = new URL(request.url);
  const shop = searchParams.get('shop');
  const host = searchParams.get('host');
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const hmac = searchParams.get('hmac');

  console.log('Callback parameters:', { shop, host, code: code ? 'present' : 'missing', state, hmac });

  if (!shop || !code || !state || !hmac) {
    console.error('Missing required parameters:', { shop, code: !!code, state: !!state, hmac: !!hmac });
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    // Échanger le code contre un token d'accès
    const callback = await shopify.auth.callback({
      rawRequest: request,
      rawResponse: new Response(),
    });

    if (!callback.session || !callback.session.accessToken) {
      console.error('No session or access token in callback');
      return NextResponse.json(
        { error: 'Failed to get access token' },
        { status: 500 }
      );
    }

    console.log('Auth callback successful, session created');

    // Stocker la session
    await sessionStorage.storeSession(callback.session);

    // Déterminer si nous sommes en HTTPS
    const isSecure = request.url.startsWith('https:');
    console.log('Request is secure:', isSecure);

    // Rediriger vers l'application avec le host
    const redirectUrl = new URL('/', request.url);
    if (host) {
      redirectUrl.searchParams.set('host', host);
    }

    const response = NextResponse.redirect(redirectUrl);
    
    // Définir le cookie de session
    response.cookies.set('session_token', callback.session.accessToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error in callback route:', error);
    return NextResponse.json(
      { error: 'Failed to complete authentication' },
      { status: 500 }
    );
  }
} 