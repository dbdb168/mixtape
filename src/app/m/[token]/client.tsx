'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DancingAvatar } from '@/components/DancingAvatar';
import { CassetteTape } from '@/components/CassetteTape';

interface MixtapeData {
  id: string;
  title: string;
  recipientName: string;
  message: string | null;
  photoUrl: string | null;
  senderName: string | null;
  createdAt: string;
}

interface TrackData {
  id: string;
  spotifyTrackId: string;
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
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const selectedTrack = tracks.find((t) => t.spotifyTrackId === selectedTrackId);

  const handleTrackClick = (spotifyTrackId: string) => {
    if (selectedTrackId === spotifyTrackId) {
      // Toggle play state if same track
      setIsPlaying(!isPlaying);
    } else {
      setSelectedTrackId(spotifyTrackId);
      setIsPlaying(true);
    }
  };

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="font-pixel text-2xl md:text-3xl text-retro-black">
            {mixtape.title}
          </h1>
          <p className="font-pixel text-sm text-retro-brown">
            FOR: {mixtape.recipientName}
          </p>
        </div>

        {/* Sender Avatar */}
        <div className="flex justify-center">
          <DancingAvatar
            photoUrl={mixtape.photoUrl}
            senderName={mixtape.senderName}
            isPlaying={isPlaying}
          />
        </div>

        {/* Message Speech Bubble */}
        {mixtape.message && (
          <div className="relative mx-auto max-w-md">
            <div className="card-retro relative">
              <p className="text-retro-navy text-center italic">
                &ldquo;{mixtape.message}&rdquo;
              </p>
              {/* Speech bubble tail */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-retro-black"></div>
            </div>
          </div>
        )}

        {/* Cassette Visualization */}
        <div className="flex justify-center">
          <CassetteTape trackCount={tracks.length} title={mixtape.title} />
        </div>

        {/* Track List */}
        <div className="card-retro">
          <h2 className="font-pixel text-sm text-retro-brown mb-4">
            TRACKLIST
          </h2>
          <div className="space-y-2">
            {tracks.map((track, index) => (
              <button
                key={track.id}
                onClick={() => handleTrackClick(track.spotifyTrackId)}
                className={`w-full flex items-center gap-3 p-2 border-2 transition-colors text-left ${
                  selectedTrackId === track.spotifyTrackId
                    ? 'bg-retro-orange text-white border-retro-brown'
                    : 'bg-retro-cream border-retro-brown hover:bg-retro-orange/20'
                }`}
              >
                {/* Track Number */}
                <span className="font-pixel text-[10px] w-6 text-center">
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Album Art */}
                <div className="w-10 h-10 bg-retro-navy flex-shrink-0">
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
                      selectedTrackId === track.spotifyTrackId
                        ? 'text-white'
                        : 'text-retro-black'
                    }`}
                  >
                    {track.name}
                  </p>
                  <p
                    className={`text-xs truncate ${
                      selectedTrackId === track.spotifyTrackId
                        ? 'text-white/80'
                        : 'text-retro-navy'
                    }`}
                  >
                    {track.artist}
                  </p>
                </div>

                {/* Duration */}
                <span
                  className={`font-pixel text-[10px] ${
                    selectedTrackId === track.spotifyTrackId
                      ? 'text-white'
                      : 'text-retro-brown'
                  }`}
                >
                  {formatDuration(track.durationMs)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Spotify Embed Player */}
        {selectedTrack && (
          <div className="space-y-2">
            <div className="card-retro p-4">
              <h3 className="font-pixel text-xs text-retro-brown mb-3">
                NOW PLAYING
              </h3>
              <iframe
                src={`https://open.spotify.com/embed/track/${selectedTrack.spotifyTrackId}?utm_source=generator&theme=0`}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-lg"
              />
            </div>
            <p className="text-center text-xs text-retro-brown">
              Spotify Premium plays full tracks. Free users get 30-second previews.
            </p>
          </div>
        )}

        {/* No Track Selected Prompt */}
        {!selectedTrack && (
          <div className="text-center p-4">
            <p className="font-pixel text-xs text-retro-brown">
              TAP A TRACK TO PLAY
            </p>
          </div>
        )}

        {/* CTA - Viral Loop */}
        <div className="text-center space-y-4 pt-8 border-t-4 border-dashed border-retro-brown">
          <p className="font-pixel text-sm text-retro-navy">
            WANT TO MAKE YOUR OWN?
          </p>
          <Link href="/api/auth/spotify" className="btn-retro inline-block">
            MAKE A MIXTAPE
          </Link>
          <p className="text-xs text-retro-brown">
            Share the love with your friends
          </p>
        </div>

        {/* Footer */}
        <footer className="text-center pt-4">
          <Link
            href="/"
            className="font-pixel text-xs text-retro-brown hover:text-retro-orange transition-colors"
          >
            MIXTAPE
          </Link>
        </footer>
      </div>
    </main>
  );
}
