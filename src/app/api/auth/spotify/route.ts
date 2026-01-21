import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { nanoid } from 'nanoid';
import { getSpotifyAuthUrl } from '@/lib/spotify/auth';

export async function GET() {
  const state = nanoid();
  const cookieStore = await cookies();

  // Store state for CSRF protection
  cookieStore.set('spotify_auth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
  });

  const authUrl = getSpotifyAuthUrl(state);
  return NextResponse.redirect(authUrl);
}
