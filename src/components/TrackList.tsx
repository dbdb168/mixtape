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
}

interface TrackListProps {
  tracks: Track[];
  onRemoveTrack: (trackId: string) => void;
  onReorderTracks: (tracks: Track[]) => void;
  maxTracks?: number;
}

export function TrackList({ tracks, onRemoveTrack, onReorderTracks, maxTracks = 10 }: TrackListProps) {
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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold uppercase tracking-widest text-white">TRACK LIST</h3>
        <span className="text-sm font-bold text-primary">{tracks.length}/{maxTracks}</span>
      </div>

      {/* Liner Notes Paper */}
      <div className="flex-1 bg-[#f0ede4] shadow-[8px_8px_0px_rgba(0,0,0,0.5)] p-4 md:p-6 flex flex-col relative liner-notes overflow-hidden">
        {/* Paper texture overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-10 pointer-events-none" />

        {/* Track List */}
        <div className="space-y-3 relative z-10 flex-1 overflow-y-auto">
          {tracks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-8">
              <div className="size-12 rounded-full border-2 border-dashed border-black/20 flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-black/20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
              </div>
              <p className="font-pixel text-black/30 text-[10px] uppercase tracking-widest text-center">
                SEARCH AND ADD TRACKS<br />TO START RECORDING
              </p>
            </div>
          ) : (
            tracks.map((track, index) => (
              <div
                key={track.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex justify-between items-baseline border-b border-black/10 pb-1 cursor-move group transition-opacity ${
                  draggedIndex === index ? 'opacity-50 bg-primary/10' : ''
                }`}
              >
                <span className="font-handwritten text-black text-sm truncate flex-1">
                  {index + 1}. {track.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-pixel text-black/50">
                    {formatDuration(track.duration)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveTrack(track.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                  >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
