import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { exchangeCodeForTokens, getSpotifyUser } from '@/lib/spotify/auth';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const cookieStore = await cookies();
  const storedState = cookieStore.get('spotify_auth_state')?.value;

  // Clear the state cookie
  cookieStore.delete('spotify_auth_state');

  // Handle errors
  if (error) {
    return NextResponse.redirect(new URL('/?error=spotify_denied', request.url));
  }

  if (!code || !state || state !== storedState) {
    return NextResponse.redirect(new URL('/?error=invalid_state', request.url));
  }

  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);

    // Get Spotify user profile
    const spotifyUser = await getSpotifyUser(tokens.access_token);

    // Create Supabase admin client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Upsert user in database
    const { data: user, error: dbError } = await supabase
      .from('users')
      .upsert({
        spotify_id: spotifyUser.id,
        email: spotifyUser.email,
        display_name: spotifyUser.display_name,
      }, {
        onConflict: 'spotify_id',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.redirect(new URL('/?error=db_error', request.url));
    }

    // Store tokens in cookies
    const tokenExpiry = Date.now() + tokens.expires_in * 1000;

    cookieStore.set('spotify_access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in,
    });

    cookieStore.set('spotify_refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    cookieStore.set('spotify_token_expiry', tokenExpiry.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    });

    cookieStore.set('user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    });

    // Track event
    await supabase.from('events').insert({
      user_id: user.id,
      event_type: 'spotify_connected',
      metadata: {},
    });

    return NextResponse.redirect(new URL('/create', request.url));
  } catch (err) {
    console.error('OAuth error:', err);
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  }
}
