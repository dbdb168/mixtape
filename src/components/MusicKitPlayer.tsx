'use client';

import { useState } from 'react';

interface MusicKitPlayerProps {
  trackIds: string[];
}

// MusicKit JS player for Apple Music
// Renders an embedded Apple Music player for the given tracks
export function MusicKitPlayer({ trackIds }: MusicKitPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  if (trackIds.length === 0) {
    return (
      <div className="p-4 bg-noir-surface border border-noir-border text-center">
        <p className="font-pixel text-xs text-noir-muted">NO TRACKS TO PLAY</p>
      </div>
    );
  }

  // Apple Music embed URL for a single track
  // Format: https://embed.music.apple.com/us/album/TRACK_ID
  // For songs, we use the song ID directly
  const currentTrackId = trackIds[currentTrackIndex];
  const embedUrl = `https://embed.music.apple.com/us/song/${currentTrackId}?app=music`;

  return (
    <div className="space-y-4">
      {/* Player */}
      <div className="bg-noir-bg p-2 border border-noir-border">
        <iframe
          allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
          frameBorder="0"
          height="175"
          style={{
            width: '100%',
            maxWidth: '660px',
            overflow: 'hidden',
            borderRadius: '10px',
          }}
          sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
          src={embedUrl}
        />
      </div>

      {/* Track navigation (if multiple tracks) */}
      {trackIds.length > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentTrackIndex((i) => Math.max(0, i - 1))}
            disabled={currentTrackIndex === 0}
            className={`font-pixel text-xs px-4 py-2 border border-noir-border ${
              currentTrackIndex === 0
                ? 'opacity-50 cursor-not-allowed bg-noir-bg text-noir-muted'
                : 'bg-noir-surface text-noir-light hover:bg-noir-border'
            }`}
          >
            ← PREV
          </button>

          <span className="font-pixel text-xs text-noir-muted">
            TRACK {currentTrackIndex + 1} / {trackIds.length}
          </span>

          <button
            onClick={() => setCurrentTrackIndex((i) => Math.min(trackIds.length - 1, i + 1))}
            disabled={currentTrackIndex === trackIds.length - 1}
            className={`font-pixel text-xs px-4 py-2 border border-noir-border ${
              currentTrackIndex === trackIds.length - 1
                ? 'opacity-50 cursor-not-allowed bg-noir-bg text-noir-muted'
                : 'bg-noir-surface text-noir-light hover:bg-noir-border'
            }`}
          >
            NEXT →
          </button>
        </div>
      )}

      {/* Playback info */}
      <p className="text-xs text-noir-muted text-center">
        Apple Music subscribers get full tracks. Others hear 30-second previews.
      </p>
    </div>
  );
}
