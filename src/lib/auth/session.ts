import { cookies } from 'next/headers';
import { refreshAccessToken } from '@/lib/spotify/auth';

export interface Session {
  userId: string;
  accessToken: string;
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();

  const userId = cookieStore.get('user_id')?.value;
  const accessToken = cookieStore.get('spotify_access_token')?.value;
  const refreshToken = cookieStore.get('spotify_refresh_token')?.value;
  const tokenExpiry = cookieStore.get('spotify_token_expiry')?.value;

  if (!userId || !refreshToken) {
    return null;
  }

  // Check if token is expired or will expire in next 5 minutes
  const expiryTime = tokenExpiry ? parseInt(tokenExpiry) : 0;
  const isExpired = Date.now() > expiryTime - 5 * 60 * 1000;

  if (isExpired || !accessToken) {
    try {
      const newTokens = await refreshAccessToken(refreshToken);
      const newExpiry = Date.now() + newTokens.expires_in * 1000;

      cookieStore.set('spotify_access_token', newTokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: newTokens.expires_in,
      });

      cookieStore.set('spotify_token_expiry', newExpiry.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
      });

      if (newTokens.refresh_token) {
        cookieStore.set('spotify_refresh_token', newTokens.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30,
        });
      }

      return { userId, accessToken: newTokens.access_token };
    } catch {
      return null;
    }
  }

  return { userId, accessToken };
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('user_id');
  cookieStore.delete('spotify_access_token');
  cookieStore.delete('spotify_refresh_token');
  cookieStore.delete('spotify_token_expiry');
}
