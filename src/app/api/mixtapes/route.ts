import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';
import { sendMixtapeEmail } from '@/lib/email';

interface TrackInput {
  id: string; // Apple Music track ID
  name: string;
  artist: string;
  album: string;
  albumArt: string | null;
  duration: number | null;
}

interface CreateMixtapeRequest {
  title: string;
  senderName: string;
  recipientName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  message?: string;
  tracks: TrackInput[];
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateMixtapeRequest = await request.json();

    // Validate request body
    const validationError = validateRequest(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const { title, senderName, recipientName, recipientEmail, recipientPhone, message, tracks } = body;

    // Generate share token (12 chars = ~71 bits of entropy)
    const shareToken = nanoid(12);

    // Create Supabase client with service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Insert mixtape (no user_id for anonymous creation)
    const { data: mixtape, error: mixtapeError } = await supabase
      .from('mixtapes')
      .insert({
        share_token: shareToken,
        title,
        sender_name: senderName,
        recipient_name: recipientName,
        recipient_email: recipientEmail || null,
        recipient_phone: recipientPhone || null,
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
      spotify_track_id: track.id, // Legacy field name, stores Apple Music ID
      position: index + 1,
      track_name: track.name,
      artist_name: track.artist,
      album_art_url: track.albumArt,
      duration_ms: track.duration,
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
      event_type: 'mixtape_created',
      metadata: { track_count: tracks.length },
    });

    // Send email to recipient (non-blocking - don't fail if email fails)
    if (recipientEmail) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mixtape-app-eight.vercel.app';
      const mixtapeUrl = `${baseUrl}/m/${shareToken}`;

      sendMixtapeEmail({
        recipientEmail,
        recipientName,
        senderName,
        mixtapeTitle: title,
        mixtapeUrl,
        message: message || undefined,
        trackCount: tracks.length,
      }).then((result) => {
        if (!result.success) {
          console.error('Failed to send mixtape email:', result.error);
        }
      });
    }

    return NextResponse.json({
      id: shareToken,
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

  // Sender name validation
  if (!body.senderName || typeof body.senderName !== 'string') {
    return 'Sender name is required';
  }
  if (body.senderName.length > 50) {
    return 'Sender name must be 50 characters or less';
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
    if (!track.id || typeof track.id !== 'string') {
      return 'Each track must have an id';
    }
    if (!track.name || typeof track.name !== 'string') {
      return 'Each track must have a name';
    }
    if (!track.artist || typeof track.artist !== 'string') {
      return 'Each track must have an artist';
    }
  }

  return null;
}
