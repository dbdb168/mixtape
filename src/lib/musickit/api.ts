import { musicKitFetch } from './auth';
import { MusicKitSearchResponse, MusicKitTrack, Track, transformMusicKitTrack } from './types';

// Search Apple Music catalog
// Storefront is the region code (e.g., 'us', 'gb', 'au')
export async function searchTracks(
  query: string,
  storefront: string = 'us',
  limit: number = 20
): Promise<Track[]> {
  const params = new URLSearchParams({
    term: query,
    types: 'songs',
    limit: limit.toString(),
  });

  const response = await musicKitFetch(
    `/catalog/${storefront}/search?${params.toString()}`
  );

  if (!response.ok) {
    const error = await response.text();
    console.error('Apple Music search error:', response.status, error);
    throw new Error('Failed to search Apple Music');
  }

  const data: MusicKitSearchResponse = await response.json();
  const songs = data.results.songs?.data || [];

  return songs.map(transformMusicKitTrack);
}

// Get a specific track by ID
export async function getTrack(
  trackId: string,
  storefront: string = 'us'
): Promise<Track | null> {
  const response = await musicKitFetch(
    `/catalog/${storefront}/songs/${trackId}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error('Failed to get track from Apple Music');
  }

  const data = await response.json();
  const track: MusicKitTrack = data.data[0];

  if (!track) {
    return null;
  }

  return transformMusicKitTrack(track);
}

// Get multiple tracks by IDs
export async function getTracks(
  trackIds: string[],
  storefront: string = 'us'
): Promise<Track[]> {
  if (trackIds.length === 0) {
    return [];
  }

  const params = new URLSearchParams({
    ids: trackIds.join(','),
  });

  const response = await musicKitFetch(
    `/catalog/${storefront}/songs?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error('Failed to get tracks from Apple Music');
  }

  const data = await response.json();
  const tracks: MusicKitTrack[] = data.data || [];

  return tracks.map(transformMusicKitTrack);
}

// Detect user's storefront based on locale or default to 'us'
export function getStorefront(): string {
  // In a real app, you might detect this from:
  // - User's Apple Music account (requires user token)
  // - Browser locale
  // - IP geolocation
  // For now, default to 'us'
  return 'us';
}
