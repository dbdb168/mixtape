import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { searchTracks } from '@/lib/spotify/api';

export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json({ error: 'Query too short' }, { status: 400 });
  }

  try {
    const results = await searchTracks(session.accessToken, query);

    // Transform to simplified format
    const tracks = results.tracks.items.map((track) => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map((a) => a.name).join(', '),
      album: track.album.name,
      albumArt: track.album.images[1]?.url || track.album.images[0]?.url,
      duration: track.duration_ms,
      previewUrl: track.preview_url,
      uri: track.uri,
    }));

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'The jukebox is jammed. Give it another spin?' },
      { status: 500 }
    );
  }
}
