import { NextRequest, NextResponse } from 'next/server';
import { searchTracks } from '@/lib/musickit/api';

export async function GET(request: NextRequest) {
  // Note: MusicKit search uses developer token, not user auth
  // We could add session check here for rate limiting if needed

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const storefront = searchParams.get('storefront') || 'us';

  if (!query || query.length < 2) {
    return NextResponse.json({ error: 'Query too short' }, { status: 400 });
  }

  try {
    const tracks = await searchTracks(query, storefront, 20);

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'The jukebox is jammed. Give it another spin?' },
      { status: 500 }
    );
  }
}
