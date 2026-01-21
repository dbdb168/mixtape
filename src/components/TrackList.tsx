'use client';

import { useState } from 'react';

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  duration: number;
  previewUrl: string | null;
  uri: string;
}

interface TrackListProps {
  tracks: Track[];
  onRemoveTrack: (trackId: string) => void;
  onReorderTracks: (tracks: Track[]) => void;
}

export function TrackList({ tracks, onRemoveTrack, onReorderTracks }: TrackListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newTracks = [...tracks];
    const draggedTrack = newTracks[draggedIndex];
    newTracks.splice(draggedIndex, 1);
    newTracks.splice(index, 0, draggedTrack);

    setDraggedIndex(index);
    onReorderTracks(newTracks);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  if (tracks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="font-pixel text-xs text-retro-brown">
          NO TRACKS YET
        </p>
        <p className="text-sm text-retro-navy mt-2">
          Search and add songs to your mixtape
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tracks.map((track, index) => (
        <div
          key={track.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          className={`flex items-center gap-3 p-3 border-2 border-retro-black bg-white cursor-move ${
            draggedIndex === index ? 'opacity-50' : ''
          }`}
        >
          {/* Position number */}
          <span className="font-pixel text-xs text-retro-brown w-6">
            {(index + 1).toString().padStart(2, '0')}
          </span>

          {/* Album art */}
          {track.albumArt && (
            <img
              src={track.albumArt}
              alt={track.album}
              className="w-10 h-10 border-2 border-retro-black"
            />
          )}

          {/* Track info */}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">{track.name}</p>
            <p className="text-xs text-retro-brown truncate">{track.artist}</p>
          </div>

          {/* Duration */}
          <span className="font-pixel text-[10px] text-retro-brown">
            {formatDuration(track.duration)}
          </span>

          {/* Remove button */}
          <button
            onClick={() => onRemoveTrack(track.id)}
            className="p-2 hover:bg-retro-red hover:text-white rounded font-pixel text-xs"
            title="Remove"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
