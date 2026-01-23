export interface User {
  id: string;
  apple_music_id: string; // Legacy: was spotify_id in database
  email: string | null;
  display_name: string | null;
  newsletter_opt_in: boolean;
  created_at: string;
}

export interface Mixtape {
  id: string;
  user_id: string;
  share_token: string;
  title: string;
  recipient_name: string;
  message: string | null;
  photo_url: string | null;
  reply_to_mixtape_id: string | null;
  created_at: string;
}

export interface Track {
  id: string;
  mixtape_id: string;
  spotify_track_id: string; // Legacy field name - stores Apple Music track ID
  position: number;
  track_name: string;
  artist_name: string;
  album_art_url: string | null;
  duration_ms: number | null;
}

export interface AnalyticsEvent {
  id: string;
  mixtape_id: string | null;
  user_id: string | null;
  event_type: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export type EventType =
  | 'page_view'
  | 'apple_music_connected'
  | 'track_added'
  | 'track_removed'
  | 'mixtape_created'
  | 'share_clicked'
  | 'mixtape_viewed'
  | 'track_played'
  | 'cta_clicked'
  | 'error_occurred'
  | 'newsletter_signup';
