import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { MixtapeViewer } from './client';
import type { Mixtape, Track } from '@/lib/supabase/types';

interface PageProps {
  params: Promise<{ token: string }>;
}

interface MixtapeWithDetails extends Mixtape {
  tracks: Track[];
}

async function getMixtape(token: string): Promise<MixtapeWithDetails | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch mixtape with tracks (no user join for anonymous mixtapes)
  const { data: mixtape, error } = await supabase
    .from('mixtapes')
    .select(`
      *,
      tracks (*)
    `)
    .eq('share_token', token)
    .single();

  if (error || !mixtape) {
    console.error('Mixtape fetch error:', error);
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

  const trackCount = mixtape.tracks?.length || 0;

  const senderName = mixtape.sender_name || 'Someone';

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mixtape.thisisluminary.co';

  return {
    title: `🎵 ${senderName} sent you a mixtape!`,
    description: `${trackCount} handpicked tracks, made just for you. Tap to listen.`,
    openGraph: {
      title: `🎵 ${senderName} sent you a mixtape!`,
      description: `${trackCount} handpicked tracks, made just for you. Tap to listen.`,
      url: `${baseUrl}/m/${token}`,
      type: 'website',
      siteName: 'Mixtape',
    },
    twitter: {
      card: 'summary_large_image',
      title: `🎵 ${senderName} sent you a mixtape!`,
      description: `${trackCount} handpicked tracks, made just for you. Tap to listen.`,
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
        senderName: mixtape.sender_name || 'Someone',
        recipientName: mixtape.recipient_name,
        message: mixtape.message,
        createdAt: mixtape.created_at,
      }}
      tracks={mixtape.tracks.map((track) => ({
        id: track.id,
        trackId: track.spotify_track_id, // Legacy field name, stores Apple Music ID
        name: track.track_name,
        artist: track.artist_name,
        albumArt: track.album_art_url,
        durationMs: track.duration_ms,
        position: track.position,
      }))}
    />
  );
}
