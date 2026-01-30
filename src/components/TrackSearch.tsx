'use client';

import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import toast from 'react-hot-toast';
import { trackEvent } from '@/lib/analytics/track';

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  duration: number;
  previewUrl: string | null;
}

interface TrackSearchProps {
  onAddTrack: (track: Track) => void;
  disabledTrackIds: string[];
  onSearchingChange?: (isSearching: boolean) => void;
  maxResults?: number;
}

export function TrackSearch({ onAddTrack, disabledTrackIds, onSearchingChange, maxResults = 25 }: TrackSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [playingPreview, setPlayingPreview] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasTrackedFirstSearch = useRef(false);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      onSearchingChange?.(false);
      return;
    }

    const search = async () => {
      setIsLoading(true);
      onSearchingChange?.(true);

      // Track first search (key engagement signal)
      if (!hasTrackedFirstSearch.current) {
        hasTrackedFirstSearch.current = true;
        trackEvent('search_started', { query: debouncedQuery.substring(0, 20) });
      }

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
        const data = await response.json();

        if (response.ok) {
          setResults(data.tracks);
        } else {
          trackEvent('search_error', { error: data.error, query: debouncedQuery.substring(0, 20) });
          toast.error(data.error || 'Search failed');
        }
      } catch {
        trackEvent('search_error', { error: 'network_error', query: debouncedQuery.substring(0, 20) });
        toast.error('Signal lost. Try tuning in again.');
      } finally {
        setIsLoading(false);
        onSearchingChange?.(false);
      }
    };

    search();
  }, [debouncedQuery, onSearchingChange]);

  const playPreview = (previewUrl: string, trackId: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    if (playingPreview === trackId) {
      setPlayingPreview(null);
      return;
    }

    audioRef.current = new Audio(previewUrl);
    audioRef.current.volume = 0.5;
    audioRef.current.play();
    audioRef.current.onended = () => setPlayingPreview(null);
    setPlayingPreview(trackId);
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header */}
      <div>
        <h3 className="text-base font-bold uppercase tracking-widest text-white">SEARCH</h3>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SEARCH APPLE MUSIC..."
          className="w-full bg-black border-2 border-white/20 py-3 pl-4 pr-4 text-sm font-pixel text-primary placeholder:text-white/20 focus:border-primary focus:ring-0 focus:outline-none uppercase"
        />
      </div>

      {/* Results */}
      <div className="flex-1 bg-black/40 border-2 border-white/5 overflow-y-auto p-2 space-y-2">
        {isLoading && (
          <p className="font-pixel text-[10px] text-white/40 text-center py-4 animate-pulse">
            TUNING IN...
          </p>
        )}

        {!isLoading && results.length === 0 && query.length >= 2 && (
          <p className="font-pixel text-[10px] text-white/40 text-center py-4">
            NO SIGNAL FOUND
          </p>
        )}

        {!isLoading && results.length === 0 && query.length < 2 && (
          <p className="font-pixel text-[10px] text-white/40 text-center py-4">
            TYPE TO SEARCH...
          </p>
        )}

        {results.slice(0, maxResults).map((track) => {
          const isDisabled = disabledTrackIds.includes(track.id);

          return (
            <button
              key={track.id}
              onClick={() => !isDisabled && onAddTrack(track)}
              disabled={isDisabled}
              className={`w-full p-2 border border-white/10 hover:border-primary/50 bg-white/5 flex items-center gap-3 group transition-colors text-left ${
                isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-grab'
              }`}
            >
              {/* Album Art Placeholder */}
              <div className="size-10 bg-white/10 flex-shrink-0 rounded overflow-hidden">
                {track.albumArt && (
                  <img src={track.albumArt} alt="" className="w-full h-full object-cover" />
                )}
              </div>

              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold truncate text-white">{track.name}</p>
                <p className="text-[8px] text-white/40 truncate">{track.artist}</p>
              </div>

              {/* Duration & Preview */}
              <div className="flex items-center gap-2">
                <span className="text-[8px] text-white/30">{formatDuration(track.duration)}</span>
                {track.previewUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playPreview(track.previewUrl!, track.id);
                    }}
                    className="text-white/40 hover:text-primary"
                  >
                    {playingPreview === track.id ? (
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" />
                        <rect x="14" y="4" width="4" height="16" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>
                )}
                {!isDisabled && (
                  <svg className="w-3 h-3 text-white/20 group-hover:text-primary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                  </svg>
                )}
                {isDisabled && (
                  <svg className="w-3 h-3 text-primary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
