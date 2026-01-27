'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface MixtapeData {
  id: string;
  title: string;
  senderName: string;
  recipientName: string;
  message: string | null;
  createdAt: string;
}

interface TrackData {
  id: string;
  trackId: string;
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

// Tape Reel component
function TapeReel({ spinning = false }: { spinning?: boolean }) {
  return (
    <div className="size-16 md:size-20 rounded-full bg-black border-4 border-white/20 relative flex items-center justify-center overflow-hidden">
      <div className={`absolute inset-0 flex items-center justify-center ${spinning ? 'tape-spinning' : ''} opacity-40`}>
        <div className="w-full h-1 bg-white/30" />
        <div className="w-1 h-full bg-white/30 absolute" />
        <div className="w-full h-1 rotate-45 bg-white/30 absolute" />
        <div className="w-full h-1 -rotate-45 bg-white/30 absolute" />
      </div>
      <div className="size-6 md:size-8 rounded-full bg-zinc-900 border-2 border-white/30 z-10" />
    </div>
  );
}

// Animated Cassette for sidebar
function AnimatedCassette({ title, isPlaying }: { title: string; isPlaying: boolean }) {
  return (
    <div className="w-full max-w-[280px] aspect-[1.6/1] bg-[#1a1a1a] rounded-lg border-4 border-white/30 shadow-2xl overflow-hidden">
      <div className="h-full flex flex-col p-3">
        {/* Label */}
        <div className="h-1/3 bg-primary/80 rounded-sm border-b-2 border-black/30 p-2 flex flex-col justify-end">
          <div className="bg-white/95 h-7 px-2 flex items-center shadow-inner">
            <span className="font-handwritten text-black text-xs truncate">
              {title}
            </span>
          </div>
        </div>

        {/* Reels */}
        <div className="flex-1 flex items-center justify-around px-4 bg-black/20">
          <TapeReel spinning={isPlaying} />

          {/* Counter */}
          <div className="w-12 h-6 bg-black border border-white/20 rounded flex items-center justify-center">
            <span className="text-[8px] text-primary font-pixel">
              {isPlaying ? '►' : '■'}
            </span>
          </div>

          <TapeReel spinning={isPlaying} />
        </div>
      </div>
    </div>
  );
}

export function MixtapeViewer({ mixtape, tracks }: MixtapeViewerProps) {
  const [selectedTrackIndex, setSelectedTrackIndex] = useState<number | null>(null);
  const [autoPlay, setAutoPlay] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const selectedTrack = selectedTrackIndex !== null ? tracks[selectedTrackIndex] : null;

  // Auto-advance to next track when current track ends
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Only set timer if auto-play is on and we have a track with duration
    if (autoPlay && selectedTrack?.durationMs && selectedTrackIndex !== null) {
      // Add 2 seconds buffer for loading
      const duration = selectedTrack.durationMs + 2000;

      timerRef.current = setTimeout(() => {
        // Move to next track if not at end
        if (selectedTrackIndex < tracks.length - 1) {
          setSelectedTrackIndex(selectedTrackIndex + 1);
        }
      }, duration);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [selectedTrackIndex, selectedTrack?.durationMs, autoPlay, tracks.length]);

  const handleTrackClick = (index: number) => {
    setSelectedTrackIndex(index);
  };

  const formatDuration = (ms: number | null) => {
    if (!ms) return '0:00';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_50%_50%,_rgba(40,20,50,1)_0%,_rgba(10,5,15,1)_100%)]">
      {/* Background glow */}
      <div className="fixed -bottom-40 left-1/2 -translate-x-1/2 w-[120%] h-[300px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-center h-16 md:h-20 px-4 md:px-12 bg-black/20 backdrop-blur-md border-b border-white/5">
        <Link href="/" className="flex items-center gap-3">
          <div className="size-10 bg-primary rounded flex items-center justify-center shadow-glow-primary">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <circle cx="8" cy="12" r="2" />
              <circle cx="16" cy="12" r="2" />
              <line x1="10" y1="12" x2="14" y2="12" />
            </svg>
          </div>
          <span className="text-2xl font-pixel tracking-widest uppercase">Mixtape</span>
        </Link>
      </header>

      <main className="relative z-10 min-h-screen flex flex-col items-center pt-24 pb-12 px-4 md:px-8">
        <div className="w-full max-w-5xl">
          {/* Hero Section */}
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
              {mixtape.senderName} sent you a mixtape
            </h1>
            {mixtape.message && (
              <p className="text-xl text-white/60 font-handwritten italic">
                &ldquo;{mixtape.message}&rdquo;
              </p>
            )}
          </div>

          {/* Main Content - Cassette on left, Tracklist on right */}
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-12 items-start">
            {/* Left - Animated Cassette */}
            <div className="hidden lg:flex flex-col items-center sticky top-24">
              <AnimatedCassette title={mixtape.title} isPlaying={selectedTrackIndex !== null} />
              <p className="text-[10px] text-white/30 mt-4 text-center">
                {selectedTrackIndex !== null ? 'Now playing...' : 'Select a track'}
              </p>
            </div>

            {/* Right - Tracklist & Player */}
            <div className="space-y-6">

            {/* Tracklist */}
            <div className="bg-[#1a1a1f] border border-white/10 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <h3 className="text-xs font-pixel uppercase tracking-widest text-white/40">
                  Tracklist
                </h3>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {tracks.map((track, index) => (
                  <button
                    key={track.id}
                    onClick={() => handleTrackClick(index)}
                    className={`w-full flex items-center gap-4 p-4 border-b border-white/5 last:border-0 transition-colors text-left ${
                      selectedTrackIndex === index
                        ? 'bg-primary/20 border-primary/30'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <span className={`text-sm font-pixel w-6 ${
                      selectedTrackIndex === index ? 'text-primary' : 'text-white/30'
                    }`}>
                      {index + 1}
                    </span>
                    {track.albumArt && (
                      <img
                        src={track.albumArt}
                        alt=""
                        className="size-10 rounded object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        selectedTrackIndex === index ? 'text-primary' : 'text-white'
                      }`}>
                        {track.name}
                      </p>
                      <p className="text-xs text-white/40 truncate">{track.artist}</p>
                    </div>
                    <span className="text-xs text-white/30 font-pixel">
                      {formatDuration(track.durationMs)}
                    </span>
                    {selectedTrackIndex === index && (
                      <svg className="w-4 h-4 text-primary animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="8" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Apple Music Player */}
            {selectedTrack ? (
              <div className="bg-[#1a1a1f] border border-white/10 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-pixel uppercase tracking-widest text-white/40">
                    Now Playing
                  </h3>
                  <span className="text-xs font-pixel text-primary">
                    {selectedTrackIndex !== null ? selectedTrackIndex + 1 : 1} / {tracks.length}
                  </span>
                </div>

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

                {/* Track navigation */}
                {tracks.length > 1 && (
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <button
                      onClick={() => setSelectedTrackIndex((i) => i !== null ? Math.max(0, i - 1) : 0)}
                      disabled={selectedTrackIndex === 0}
                      className={`btn-ghost py-2 ${
                        selectedTrackIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''
                      }`}
                    >
                      ← Previous
                    </button>

                    <button
                      onClick={() => setSelectedTrackIndex((i) => i !== null ? Math.min(tracks.length - 1, i + 1) : 0)}
                      disabled={selectedTrackIndex === tracks.length - 1}
                      className={`btn-ghost py-2 ${
                        selectedTrackIndex === tracks.length - 1 ? 'opacity-30 cursor-not-allowed' : ''
                      }`}
                    >
                      Next →
                    </button>
                  </div>
                )}

                {/* Auto-play toggle */}
                <div className="flex items-center justify-center gap-2 pt-2 border-t border-white/10">
                  <button
                    onClick={() => setAutoPlay(!autoPlay)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-colors ${
                      autoPlay ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white/40'
                    }`}
                  >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
                    </svg>
                    Auto-play {autoPlay ? 'ON' : 'OFF'}
                  </button>
                </div>

                <p className="text-center text-[10px] text-white/30">
                  Apple Music subscribers hear full tracks. Others hear 30-second previews.
                </p>
              </div>
            ) : (
              <div className="bg-[#1a1a1f] border border-white/10 rounded-xl p-8 text-center">
                <svg className="w-12 h-12 mx-auto text-white/20 mb-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
                <p className="text-sm text-white/40">
                  Select a track to start playing
                </p>
              </div>
            )}

            {/* CTA and Substack tiles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Send one back CTA */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-3">
                <p className="text-lg font-bold">Send one back?</p>
                <Link href="/create" className="btn-primary inline-flex items-center gap-3 text-sm">
                  Send one to somebody else
                </Link>
              </div>

              {/* AI Cookbook promo */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <img src="/ai-cookbook-logo.jpeg" alt="AI Cookbook" className="size-8 rounded" />
                  <h4 className="text-sm font-bold">The AI Cookbook</h4>
                </div>
                <p className="text-sm text-white/60 leading-relaxed">
                  If you enjoyed this, you might enjoy some things I&apos;m writing about on Substack.{' '}
                  <a
                    href="https://theaicookbook.substack.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-bold"
                  >
                    Subscribe here.
                  </a>
                </p>
              </div>
            </div>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 p-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest">
          <Link href="/privacy" className="text-white/30 hover:text-primary transition-colors">Privacy</Link>
          <Link href="/terms" className="text-white/30 hover:text-primary transition-colors">Terms</Link>
          <span className="text-white/20">Powered by Apple Music</span>
        </div>
        <div className="text-[10px] text-white/30">
          © Luminary 2026
        </div>
      </footer>
    </div>
  );
}
