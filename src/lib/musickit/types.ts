// MusicKit Types

export interface MusicKitTrack {
  id: string;
  type: 'songs';
  attributes: {
    name: string;
    artistName: string;
    albumName: string;
    durationInMillis: number;
    artwork: {
      url: string;
      width: number;
      height: number;
    };
    previews: Array<{
      url: string;
    }>;
    isrc?: string;
  };
}

export interface MusicKitSearchResponse {
  results: {
    songs?: {
      data: MusicKitTrack[];
    };
  };
}

// Transformed track format for our app
export interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  duration: number;
  previewUrl: string | null;
}

// Transform MusicKit track to our app format
export function transformMusicKitTrack(track: MusicKitTrack): Track {
  // MusicKit artwork URL has {w}x{h} placeholders that need replacing
  const artworkUrl = track.attributes.artwork.url
    .replace('{w}', '300')
    .replace('{h}', '300');

  return {
    id: track.id,
    name: track.attributes.name,
    artist: track.attributes.artistName,
    album: track.attributes.albumName,
    albumArt: artworkUrl,
    duration: track.attributes.durationInMillis,
    previewUrl: track.attributes.previews?.[0]?.url || null,
  };
}

// MusicKit configuration
export interface MusicKitConfig {
  developerToken: string;
  appName: string;
  appBuild: string;
}
