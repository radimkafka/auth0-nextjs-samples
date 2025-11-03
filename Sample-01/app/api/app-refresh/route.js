import { NextResponse } from 'next/server';
import { auth0 } from '../../../lib/auth0';

export const GET = async function shows() {
  try {
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { token, expiresAt } = await auth0.getAccessToken({
      refresh: true
    });

    console.log('Token refreshed, ends with:', token.slice(-20));

    return NextResponse.json({
      success: true,
      message: 'Token refreshed',
      expires_at: expiresAt
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
};
