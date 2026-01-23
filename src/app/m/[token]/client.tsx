'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CassetteTape } from '@/components/CassetteTape';

interface MixtapeData {
  id: string;
  title: string;
  recipientName: string;
  message: string | null;
  createdAt: string;
}

interface TrackData {
  id: string;
  trackId: string; // Apple Music track ID
  name: string;
  artist: string;
  albumArt: string | null;
  durationMs: number | null;
  position: number;
}

interface MixtapeViewerProps {
  mixtape: MixtapeData;
  tracks: TrackData[];
}

function formatDuration(ms: number | null): string {
  if (!ms) return '--:--';
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function MixtapeViewer({ mixtape, tracks }: MixtapeViewerProps) {
  const [selectedTrackIndex, setSelectedTrackIndex] = useState<number | null>(null);

  const selectedTrack = selectedTrackIndex !== null ? tracks[selectedTrackIndex] : null;

  const handleTrackClick = (index: number) => {
    setSelectedTrackIndex(index);
  };

  return (
    <main className="min-h-screen py-8 px-4 bg-noir-bg">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="font-pixel text-2xl md:text-3xl text-noir-white">
            {mixtape.title}
          </h1>
          <p className="font-pixel text-sm text-noir-muted">
            FOR: {mixtape.recipientName}
          </p>
        </div>

        {/* Message Speech Bubble */}
        {mixtape.message && (
          <div className="relative mx-auto max-w-md">
            <div className="card-retro relative">
              <p className="text-noir-text text-center italic">
                &ldquo;{mixtape.message}&rdquo;
              </p>
              {/* Speech bubble tail */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-noir-border"></div>
            </div>
          </div>
        )}

        {/* Cassette Visualization */}
        <div className="flex justify-center">
          <CassetteTape trackCount={tracks.length} title={mixtape.title} />
        </div>

        {/* Track List */}
        <div className="card-retro">
          <h2 className="font-pixel text-sm text-noir-muted mb-4">
            TRACKLIST
          </h2>
          <div className="space-y-2">
            {tracks.map((track, index) => (
              <button
                key={track.id}
                onClick={() => handleTrackClick(index)}
                className={`w-full flex items-center gap-3 p-2 border transition-colors text-left ${
                  selectedTrackIndex === index
                    ? 'bg-noir-white text-noir-bg border-noir-white'
                    : 'bg-noir-bg border-noir-border hover:bg-noir-border'
                }`}
              >
                {/* Track Number */}
                <span className="font-pixel text-[10px] w-6 text-center">
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Album Art */}
                <div className="w-10 h-10 bg-noir-border flex-shrink-0">
                  {track.albumArt ? (
                    <img
                      src={track.albumArt}
                      alt={`${track.name} album art`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-lg">💿</span>
                    </div>
                  )}
                </div>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-pixel text-[10px] truncate ${
                      selectedTrackIndex === index
                        ? 'text-noir-bg'
                        : 'text-noir-light'
                    }`}
                  >
                    {track.name}
                  </p>
                  <p
                    className={`text-xs truncate ${
                      selectedTrackIndex === index
                        ? 'text-noir-bg/70'
                        : 'text-noir-text'
                    }`}
                  >
                    {track.artist}
                  </p>
                </div>

                {/* Duration */}
                <span
                  className={`font-pixel text-[10px] ${
                    selectedTrackIndex === index
                      ? 'text-noir-bg'
                      : 'text-noir-muted'
                  }`}
                >
                  {formatDuration(track.durationMs)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Apple Music Embed Player */}
        {selectedTrack && (
          <div className="space-y-2">
            <div className="card-retro p-4">
              <h3 className="font-pixel text-xs text-noir-muted mb-3">
                NOW PLAYING
              </h3>
              <iframe
                allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
                frameBorder="0"
                height="175"
                style={{
                  width: '100%',
                  overflow: 'hidden',
                  borderRadius: '10px',
                  backgroundColor: 'transparent',
                }}
                sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
                src={`https://embed.music.apple.com/us/song/${selectedTrack.trackId}?app=music`}
              />
            </div>
            <p className="text-center text-xs text-noir-muted">
              Apple Music subscribers get full tracks. Others hear 30-second previews.
            </p>
          </div>
        )}

        {/* No Track Selected Prompt */}
        {!selectedTrack && (
          <div className="text-center p-4">
            <p className="font-pixel text-xs text-noir-muted">
              TAP A TRACK TO PLAY
            </p>
          </div>
        )}

        {/* Track Navigation */}
        {selectedTrack && tracks.length > 1 && (
          <div className="flex items-center justify-between px-4">
            <button
              onClick={() => setSelectedTrackIndex((i) => i !== null ? Math.max(0, i - 1) : 0)}
              disabled={selectedTrackIndex === 0}
              className={`font-pixel text-xs px-4 py-2 border border-noir-border ${
                selectedTrackIndex === 0
                  ? 'opacity-50 cursor-not-allowed bg-noir-bg text-noir-muted'
                  : 'bg-noir-surface text-noir-light hover:bg-noir-border'
              }`}
            >
              ← PREV
            </button>

            <span className="font-pixel text-xs text-noir-muted">
              {selectedTrackIndex !== null ? selectedTrackIndex + 1 : 1} / {tracks.length}
            </span>

            <button
              onClick={() => setSelectedTrackIndex((i) => i !== null ? Math.min(tracks.length - 1, i + 1) : 0)}
              disabled={selectedTrackIndex === tracks.length - 1}
              className={`font-pixel text-xs px-4 py-2 border border-noir-border ${
                selectedTrackIndex === tracks.length - 1
                  ? 'opacity-50 cursor-not-allowed bg-noir-bg text-noir-muted'
                  : 'bg-noir-surface text-noir-light hover:bg-noir-border'
              }`}
            >
              NEXT →
            </button>
          </div>
        )}

        {/* CTA - Viral Loop */}
        <div className="text-center space-y-4 pt-8 border-t border-dashed border-noir-border">
          <p className="font-pixel text-sm text-noir-text">
            WANT TO MAKE YOUR OWN?
          </p>
          <Link href="/create" className="btn-retro inline-block">
            MAKE A MIXTAPE
          </Link>
          <p className="text-xs text-noir-muted">
            Share the love with your friends
          </p>
        </div>

        {/* Footer */}
        <footer className="text-center pt-4">
          <Link
            href="/"
            className="font-pixel text-xs text-noir-muted hover:text-noir-white transition-colors"
          >
            MIXTAPE
          </Link>
        </footer>
      </div>
    </main>
  );
}
