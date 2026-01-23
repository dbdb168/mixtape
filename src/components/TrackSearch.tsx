'use client';

import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import toast from 'react-hot-toast';

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
}

export function TrackSearch({ onAddTrack, disabledTrackIds }: TrackSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [playingPreview, setPlayingPreview] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    const search = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
        const data = await response.json();

        if (response.ok) {
          setResults(data.tracks);
        } else {
          toast.error(data.error || 'Search failed');
        }
      } catch {
        toast.error('The jukebox is jammed. Give it another spin?');
      } finally {
        setIsLoading(false);
      }
    };

    search();
  }, [debouncedQuery]);

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
    <div className="space-y-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for songs..."
        className="input-retro"
      />

      {isLoading && (
        <p className="font-pixel text-xs text-noir-muted text-center">
          SEARCHING...
        </p>
      )}

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {results.map((track) => {
          const isDisabled = disabledTrackIds.includes(track.id);

          return (
            <div
              key={track.id}
              className={`flex items-center gap-3 p-3 border border-noir-border ${
                isDisabled ? 'opacity-50' : 'hover:bg-noir-border cursor-pointer'
              }`}
              onClick={() => !isDisabled && onAddTrack(track)}
            >
              {/* Album art */}
              {track.albumArt && (
                <img
                  src={track.albumArt}
                  alt={track.album}
                  className="w-12 h-12 border border-noir-border"
                />
              )}

              {/* Track info */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-noir-light truncate">{track.name}</p>
                <p className="text-xs text-noir-muted truncate">{track.artist}</p>
              </div>

              {/* Duration */}
              <span className="font-pixel text-[10px] text-noir-muted">
                {formatDuration(track.duration)}
              </span>

              {/* Preview button */}
              {track.previewUrl && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playPreview(track.previewUrl!, track.id);
                  }}
                  className="p-2 hover:bg-noir-border text-noir-text hover:text-noir-white rounded"
                  title="Preview"
                >
                  {playingPreview === track.id ? '⏸' : '▶'}
                </button>
              )}

              {/* Add indicator */}
              {isDisabled ? (
                <span className="font-pixel text-[10px] text-noir-muted">ADDED</span>
              ) : (
                <span className="font-pixel text-[10px] text-noir-white">+ ADD</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
