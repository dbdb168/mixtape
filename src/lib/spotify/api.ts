import { SpotifySearchResponse } from './types';

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

export async function searchTracks(
  accessToken: string,
  query: string,
  limit: number = 10
): Promise<SpotifySearchResponse> {
  const params = new URLSearchParams({
    q: query,
    type: 'track',
    limit: limit.toString(),
  });

  const response = await fetch(`${SPOTIFY_API_URL}/search?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Spotify search failed: ${response.status}`);
  }

  return response.json();
}

export async function createPlaylist(
  accessToken: string,
  userId: string,
  name: string,
  trackUris: string[]
): Promise<{ id: string; external_urls: { spotify: string } }> {
  // Create playlist
  const createResponse = await fetch(
    `${SPOTIFY_API_URL}/users/${userId}/playlists`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description: 'Created with Mixtape - mixtape.fm',
        public: false,
      }),
    }
  );

  if (!createResponse.ok) {
    throw new Error('Failed to create playlist');
  }

  const playlist = await createResponse.json();

  // Add tracks
  await fetch(`${SPOTIFY_API_URL}/playlists/${playlist.id}/tracks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uris: trackUris }),
  });

  return playlist;
}
