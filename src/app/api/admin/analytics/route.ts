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
  sender_name: string;
  created_at: string;
}

export async function GET() {
  try {
    // Create Supabase client with service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Calculate date 24 hours ago for funnel
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Query all required data in parallel
    const [
      mixtapeCountResult,
      viewEventsResult,
      ctaClickEventsResult,
      recentErrorsResult,
      tracksResult,
      recentTracksResult,
      // Funnel events (last 24 hours)
      createPageLoadedResult,
      searchStartedResult,
      trackAddedResult,
      sendTapeClickedResult,
      personalizeLoadedResult,
      shareAttemptedResult,
      searchErrorResult,
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
      // Recent mixtapes with tracks (last 20 mixtapes)
      supabase
        .from('mixtapes')
        .select('id, title, created_at, sender_name, recipient_name, recipient_email, tracks(track_name, artist_name)')
        .order('created_at', { ascending: false })
        .limit(20),
      // Funnel events (last 24 hours)
      supabase.from('events').select('*', { count: 'exact', head: true })
        .eq('event_type', 'create_page_loaded').gte('created_at', last24Hours),
      supabase.from('events').select('*', { count: 'exact', head: true })
        .eq('event_type', 'search_started').gte('created_at', last24Hours),
      supabase.from('events').select('*', { count: 'exact', head: true })
        .eq('event_type', 'track_added').gte('created_at', last24Hours),
      supabase.from('events').select('*', { count: 'exact', head: true })
        .eq('event_type', 'send_tape_clicked').gte('created_at', last24Hours),
      supabase.from('events').select('*', { count: 'exact', head: true })
        .eq('event_type', 'personalize_page_loaded').gte('created_at', last24Hours),
      supabase.from('events').select('*', { count: 'exact', head: true })
        .eq('event_type', 'share_attempted').gte('created_at', last24Hours),
      supabase.from('events').select('*', { count: 'exact', head: true })
        .eq('event_type', 'search_error').gte('created_at', last24Hours),
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

    // Process recent mixtapes into flat track list
    const recentTracks: RecentTrack[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (recentTracksResult.data || []).forEach((mixtape: any) => {
      const tracks = mixtape.tracks || [];
      tracks.forEach((track: { track_name: string; artist_name: string }, index: number) => {
        recentTracks.push({
          id: `${mixtape.id}-${index}`,
          track_name: track.track_name,
          artist_name: track.artist_name,
          mixtape_title: mixtape.title || 'Unknown',
          sender_name: mixtape.sender_name || 'Anonymous',
          created_at: mixtape.created_at || '',
        });
      });
    });

    // Build recent mixtapes summary (email as boolean for privacy)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recentMixtapes = (recentTracksResult.data || []).map((mixtape: any) => ({
      id: mixtape.id,
      title: mixtape.title || 'Untitled',
      sender_name: mixtape.sender_name || 'Anonymous',
      recipient_name: mixtape.recipient_name || null,
      has_email: !!mixtape.recipient_email,
      track_count: (mixtape.tracks || []).length,
      created_at: mixtape.created_at,
    }));

    // Build funnel data (last 24 hours)
    const funnel = {
      createPageLoaded: createPageLoadedResult.count || 0,
      searchStarted: searchStartedResult.count || 0,
      trackAdded: trackAddedResult.count || 0,
      sendTapeClicked: sendTapeClickedResult.count || 0,
      personalizeLoaded: personalizeLoadedResult.count || 0,
      shareAttempted: shareAttemptedResult.count || 0,
      searchErrors: searchErrorResult.count || 0,
    };

    return NextResponse.json({
      metrics,
      targets,
      recentErrors,
      recentTracks,
      recentMixtapes,
      funnel,
    });
  } catch (error) {
    console.error('Admin analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
