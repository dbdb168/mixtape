'use client';

import { TapeReel } from './TapeReel';

interface CassetteDeckProps {
  label: string;
  isRecording?: boolean;
  isPlaying?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function CassetteDeck({
  label,
  isRecording = false,
  isPlaying = false,
  children,
  className = '',
}: CassetteDeckProps) {
  const spinning = isRecording || isPlaying;

  return (
    <div className={`border border-wire-white p-3 ${className}`}>
      {/* Deck header with label */}
      <div className="flex items-center justify-between mb-3 border-b border-wire-white pb-2">
        <span className="font-pixel text-[10px] text-wire-white uppercase tracking-wider">
          {label}
        </span>
        {isRecording && (
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-wire-red animate-blink-rec" />
            <span className="font-pixel text-[10px] text-wire-red">REC</span>
          </span>
        )}
        {isPlaying && !isRecording && (
          <span className="font-pixel text-[10px] text-wire-white">PLAY</span>
        )}
      </div>

      {/* Tape window with reels */}
      <div className="border border-wire-white p-2 mb-3">
        <div className="flex justify-between items-center px-2">
          <TapeReel size={32} spinning={spinning} />
          <div className="flex-1 mx-2 h-1 border-t border-b border-wire-white" />
          <TapeReel size={32} spinning={spinning} />
        </div>
      </div>

      {/* Content area (search results or track list) */}
      <div className="min-h-[180px] max-h-[240px] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
