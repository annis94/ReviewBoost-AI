import { NextResponse } from 'next/server';
import { shopify, sessionStorage } from '@/lib/shopify';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const shop = searchParams.get('shop');
    const state = searchParams.get('state');
    const code = searchParams.get('code');

    if (!shop || !state || !code) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Verify the state matches what we stored
    const storedState = cookies().get('shopify_auth_state')?.value;
    if (state !== storedState) {
      return NextResponse.json(
        { error: 'Invalid state parameter' },
        { status: 400 }
      );
    }

    // Clear the state cookie
    cookies().delete('shopify_auth_state');

    // Complete the OAuth process
    const session = await shopify.auth.callback({
      rawRequest: request,
      rawResponse: new Response(),
    });

    // Store the session
    await sessionStorage.storeSession(session);

    // Redirect to the app
    return NextResponse.redirect(new URL('/app', request.url));
  } catch (error) {
    console.error('Error during auth callback:', error);
    return NextResponse.json(
      { error: 'Authentication callback failed' },
      { status: 500 }
    );
  }
} 