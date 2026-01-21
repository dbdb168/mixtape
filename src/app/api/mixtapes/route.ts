import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';
import { getSession } from '@/lib/auth/session';
import { createPlaylist } from '@/lib/spotify/api';

interface TrackInput {
  spotifyTrackId: string;
  trackName: string;
  artistName: string;
  albumArtUrl: string | null;
  durationMs: number | null;
  uri: string;
}

interface CreateMixtapeRequest {
  title: string;
  recipientName: string;
  message?: string;
  tracks: TrackInput[];
  saveToSpotify?: boolean;
}

export async function POST(request: NextRequest) {
  // Check session
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body: CreateMixtapeRequest = await request.json();

    // Validate request body
    const validationError = validateRequest(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const { title, recipientName, message, tracks, saveToSpotify } = body;

    // Generate share token
    const shareToken = nanoid(12);

    // Create Supabase client with service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Insert mixtape
    const { data: mixtape, error: mixtapeError } = await supabase
      .from('mixtapes')
      .insert({
        user_id: session.userId,
        share_token: shareToken,
        title,
        recipient_name: recipientName,
        message: message || null,
      })
      .select()
      .single();

    if (mixtapeError) {
      console.error('Mixtape insert error:', mixtapeError);
      return NextResponse.json(
        { error: "Couldn't save your masterpiece. The tape deck is being stubborn." },
        { status: 500 }
      );
    }

    // Insert tracks
    const trackInserts = tracks.map((track, index) => ({
      mixtape_id: mixtape.id,
      spotify_track_id: track.spotifyTrackId,
      position: index + 1,
      track_name: track.trackName,
      artist_name: track.artistName,
      album_art_url: track.albumArtUrl,
      duration_ms: track.durationMs,
    }));

    const { error: tracksError } = await supabase
      .from('tracks')
      .insert(trackInserts);

    if (tracksError) {
      console.error('Tracks insert error:', tracksError);
      // Clean up the mixtape if tracks failed to insert
      await supabase.from('mixtapes').delete().eq('id', mixtape.id);
      return NextResponse.json(
        { error: "Couldn't save your masterpiece. The tape deck is being stubborn." },
        { status: 500 }
      );
    }

    // Insert analytics event
    await supabase.from('events').insert({
      mixtape_id: mixtape.id,
      user_id: session.userId,
      event_type: 'mixtape_created',
      metadata: { track_count: tracks.length },
    });

    // Save to Spotify if requested
    if (saveToSpotify) {
      try {
        const trackUris = tracks.map((track) => track.uri);
        await createPlaylist(
          session.accessToken,
          session.userId,
          title,
          trackUris
        );
      } catch (spotifyError) {
        console.error('Spotify playlist creation error:', spotifyError);
        // Continue - mixtape was created, just Spotify failed
      }
    }

    return NextResponse.json({
      id: mixtape.id,
      shareToken,
    });
  } catch (error) {
    console.error('Create mixtape error:', error);
    return NextResponse.json(
      { error: "Couldn't save your masterpiece. The tape deck is being stubborn." },
      { status: 500 }
    );
  }
}

function validateRequest(body: CreateMixtapeRequest): string | null {
  // Title validation
  if (!body.title || typeof body.title !== 'string') {
    return 'Title is required';
  }
  if (body.title.length > 50) {
    return 'Title must be 50 characters or less';
  }

  // Recipient name validation
  if (!body.recipientName || typeof body.recipientName !== 'string') {
    return 'Recipient name is required';
  }
  if (body.recipientName.length > 50) {
    return 'Recipient name must be 50 characters or less';
  }

  // Message validation (optional)
  if (body.message !== undefined && body.message !== null) {
    if (typeof body.message !== 'string') {
      return 'Message must be a string';
    }
    if (body.message.length > 200) {
      return 'Message must be 200 characters or less';
    }
  }

  // Tracks validation
  if (!body.tracks || !Array.isArray(body.tracks)) {
    return 'Tracks are required';
  }
  if (body.tracks.length < 1) {
    return 'At least 1 track is required';
  }
  if (body.tracks.length > 12) {
    return 'Maximum of 12 tracks allowed';
  }

  // Validate each track
  for (const track of body.tracks) {
    if (!track.spotifyTrackId || typeof track.spotifyTrackId !== 'string') {
      return 'Each track must have a spotifyTrackId';
    }
    if (!track.trackName || typeof track.trackName !== 'string') {
      return 'Each track must have a trackName';
    }
    if (!track.artistName || typeof track.artistName !== 'string') {
      return 'Each track must have an artistName';
    }
    if (!track.uri || typeof track.uri !== 'string') {
      return 'Each track must have a uri';
    }
  }

  return null;
}
