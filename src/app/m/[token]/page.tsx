import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { MixtapeViewer } from './client';
import type { Mixtape, Track, User } from '@/lib/supabase/types';

interface PageProps {
  params: Promise<{ token: string }>;
}

interface MixtapeWithDetails extends Mixtape {
  user: Pick<User, 'display_name' | 'id'> | null;
  tracks: Track[];
}

async function getMixtape(token: string): Promise<MixtapeWithDetails | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch mixtape with user and tracks
  const { data: mixtape, error } = await supabase
    .from('mixtapes')
    .select(`
      *,
      user:users!user_id (id, display_name),
      tracks (*)
    `)
    .eq('share_token', token)
    .single();

  if (error || !mixtape) {
    return null;
  }

  // Sort tracks by position
  if (mixtape.tracks) {
    mixtape.tracks.sort((a: Track, b: Track) => a.position - b.position);
  }

  return mixtape as MixtapeWithDetails;
}

async function trackView(mixtapeId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  await supabase.from('events').insert({
    mixtape_id: mixtapeId,
    event_type: 'mixtape_viewed',
    metadata: {},
  });
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { token } = await params;
  const mixtape = await getMixtape(token);

  if (!mixtape) {
    return {
      title: 'Mixtape Not Found',
    };
  }

  const senderName = mixtape.user?.display_name || 'Someone';
  const trackCount = mixtape.tracks?.length || 0;

  return {
    title: `${mixtape.title} - A Mixtape for ${mixtape.recipient_name}`,
    description: `${senderName} made a mixtape with ${trackCount} tracks for ${mixtape.recipient_name}. Listen now!`,
    openGraph: {
      title: `${mixtape.title}`,
      description: `A mixtape for ${mixtape.recipient_name} from ${senderName}`,
      type: 'website',
      images: mixtape.photo_url ? [{ url: mixtape.photo_url }] : undefined,
    },
    twitter: {
      card: 'summary',
      title: `${mixtape.title}`,
      description: `A mixtape for ${mixtape.recipient_name} from ${senderName}`,
    },
  };
}

export default async function MixtapePage({ params }: PageProps) {
  const { token } = await params;
  const mixtape = await getMixtape(token);

  if (!mixtape) {
    notFound();
  }

  // Track the view event
  await trackView(mixtape.id);

  return (
    <MixtapeViewer
      mixtape={{
        id: mixtape.id,
        title: mixtape.title,
        recipientName: mixtape.recipient_name,
        message: mixtape.message,
        photoUrl: mixtape.photo_url,
        senderName: mixtape.user?.display_name || null,
        createdAt: mixtape.created_at,
      }}
      tracks={mixtape.tracks.map((track) => ({
        id: track.id,
        spotifyTrackId: track.spotify_track_id,
        name: track.track_name,
        artist: track.artist_name,
        albumArt: track.album_art_url,
        durationMs: track.duration_ms,
        position: track.position,
      }))}
    />
  );
}
