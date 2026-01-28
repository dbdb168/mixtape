import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface Metrics {
  mixtapesCreated: number;
  viralCoefficient: number;
  avgTracksPerMixtape: number;
}

interface Targets {
  mixtapesCreated: { target: number; stretch: number };
  viralCoefficient: { target: number; stretch: number };
  avgTracksPerMixtape: { target: number; stretch: number };
}

interface RecentError {
  id: string;
  event_type: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

interface RecentTrack {
  id: string;
  track_name: string;
  artist_name: string;
  mixtape_title: string;
  created_at: string;
}

export async function GET() {
  try {
    // Create Supabase client with service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Query all required data in parallel
    const [
      mixtapeCountResult,
      viewEventsResult,
      ctaClickEventsResult,
      recentErrorsResult,
      tracksResult,
      recentTracksResult,
    ] = await Promise.all([
      // Mixtape count
      supabase.from('mixtapes').select('*', { count: 'exact', head: true }),
      // View events (mixtape_viewed) for viral coefficient
      supabase
        .from('events')
        .select('mixtape_id')
        .eq('event_type', 'mixtape_viewed'),
      // CTA click events for viral coefficient
      supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'cta_clicked'),
      // Recent errors (last 10)
      supabase
        .from('events')
        .select('id, event_type, metadata, created_at')
        .eq('event_type', 'error_occurred')
        .order('created_at', { ascending: false })
        .limit(10),
      // Tracks for avg tracks per mixtape
      supabase.from('tracks').select('mixtape_id'),
      // Recent tracks with mixtape info (last 50)
      supabase
        .from('tracks')
        .select('id, track_name, artist_name, mixtape_id, mixtapes(title, created_at)')
        .order('id', { ascending: false })
        .limit(50),
    ]);

    const mixtapesCreated = mixtapeCountResult.count || 0;

    // Calculate viral coefficient: cta_clicks / unique_mixtapes_viewed
    const ctaClicks = ctaClickEventsResult.count || 0;
    const uniqueMixtapesViewed = new Set(
      (viewEventsResult.data || []).map((e) => e.mixtape_id)
    ).size;
    const viralCoefficient =
      uniqueMixtapesViewed > 0 ? ctaClicks / uniqueMixtapesViewed : 0;

    // Calculate avg tracks per mixtape
    const tracks = tracksResult.data || [];
    const tracksByMixtape = tracks.reduce(
      (acc, track) => {
        acc[track.mixtape_id] = (acc[track.mixtape_id] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    const mixtapesWithTracks = Object.keys(tracksByMixtape).length;
    const avgTracksPerMixtape =
      mixtapesWithTracks > 0 ? tracks.length / mixtapesWithTracks : 0;

    const metrics: Metrics = {
      mixtapesCreated,
      viralCoefficient: Math.round(viralCoefficient * 100) / 100,
      avgTracksPerMixtape: Math.round(avgTracksPerMixtape * 10) / 10,
    };

    const targets: Targets = {
      mixtapesCreated: { target: 500, stretch: 2000 },
      viralCoefficient: { target: 0.3, stretch: 0.5 },
      avgTracksPerMixtape: { target: 7, stretch: 9 },
    };

    const recentErrors: RecentError[] = (recentErrorsResult.data ||
      []) as RecentError[];

    // Process recent tracks with mixtape info
    const recentTracks: RecentTrack[] = (recentTracksResult.data || []).map((track: {
      id: string;
      track_name: string;
      artist_name: string;
      mixtapes: { title: string; created_at: string } | null;
    }) => ({
      id: track.id,
      track_name: track.track_name,
      artist_name: track.artist_name,
      mixtape_title: track.mixtapes?.title || 'Unknown',
      created_at: track.mixtapes?.created_at || '',
    }));

    return NextResponse.json({
      metrics,
      targets,
      recentErrors,
      recentTracks,
    });
  } catch (error) {
    console.error('Admin analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
