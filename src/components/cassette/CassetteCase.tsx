'use client';

import { TapeReel } from '../boombox/TapeReel';

interface Track {
  id: string;
  name: string;
  artist: string;
  durationMs: number | null;
}

interface CassetteCaseProps {
  title: string;
  recipientName: string;
  message?: string | null;
  tracks: Track[];
  selectedTrackIndex?: number | null;
  onTrackClick?: (index: number) => void;
  className?: string;
}

function formatDuration(ms: number | null): string {
  if (!ms) return '--:--';
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function CassetteCase({
  title,
  recipientName,
  message,
  tracks,
  selectedTrackIndex,
  onTrackClick,
  className = '',
}: CassetteCaseProps) {
  const sideA = tracks.slice(0, 6);
  const sideB = tracks.slice(6, 12);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Cassette Case - Top (Label) */}
      <div className="border border-wire-white p-4">
        <div className="border border-wire-white p-3 text-center">
          {/* Title */}
          <h1 className="font-pixel text-lg text-wire-white mb-2 tracking-wider">
            {title.toUpperCase()}
          </h1>

          {/* Mini cassette icon */}
          <div className="flex justify-center gap-4 my-3">
            <TapeReel size={24} />
            <TapeReel size={24} />
          </div>

          {/* For/From */}
          <p className="font-pixel text-[10px] text-wire-gray">
            FOR: {recipientName.toUpperCase()}
          </p>
        </div>
      </div>

      {/* Cassette - Track listing */}
      <div className="border border-wire-white p-4">
        {/* Tape reels at top */}
        <div className="flex justify-between items-center mb-4 px-4">
          <TapeReel size={40} spinning={selectedTrackIndex !== null} />
          <div className="flex-1 mx-4">
            <div className="border-t border-b border-wire-white h-2" />
          </div>
          <TapeReel size={40} spinning={selectedTrackIndex !== null} />
        </div>

        {/* Track list */}
        <div className="space-y-4">
          {/* Side A */}
          {sideA.length > 0 && (
            <div>
              <p className="font-pixel text-[10px] text-wire-gray mb-2 border-b border-wire-dim pb-1">
                SIDE A
              </p>
              <div className="space-y-1">
                {sideA.map((track, index) => (
                  <button
                    key={track.id}
                    onClick={() => onTrackClick?.(index)}
                    className={`w-full flex items-center gap-2 p-2 text-left transition-colors border ${
                      selectedTrackIndex === index
                        ? 'bg-wire-white text-wire-black border-wire-white'
                        : 'border-transparent hover:border-wire-white'
                    }`}
                  >
                    <span className="font-pixel text-[10px] w-4">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 font-pixel text-[10px] truncate">
                      {track.name}
                    </span>
                    <span className={`text-[9px] ${selectedTrackIndex === index ? 'text-wire-black/60' : 'text-wire-gray'}`}>
                      {track.artist}
                    </span>
                    <span className={`font-pixel text-[8px] ${selectedTrackIndex === index ? 'text-wire-black/60' : 'text-wire-gray'}`}>
                      {formatDuration(track.durationMs)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Side B */}
          {sideB.length > 0 && (
            <div>
              <p className="font-pixel text-[10px] text-wire-gray mb-2 border-b border-wire-dim pb-1">
                SIDE B
              </p>
              <div className="space-y-1">
                {sideB.map((track, index) => {
                  const actualIndex = index + 6;
                  return (
                    <button
                      key={track.id}
                      onClick={() => onTrackClick?.(actualIndex)}
                      className={`w-full flex items-center gap-2 p-2 text-left transition-colors border ${
                        selectedTrackIndex === actualIndex
                          ? 'bg-wire-white text-wire-black border-wire-white'
                          : 'border-transparent hover:border-wire-white'
                      }`}
                    >
                      <span className="font-pixel text-[10px] w-4">
                        {String(actualIndex + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1 font-pixel text-[10px] truncate">
                        {track.name}
                      </span>
                      <span className={`text-[9px] ${selectedTrackIndex === actualIndex ? 'text-wire-black/60' : 'text-wire-gray'}`}>
                        {track.artist}
                      </span>
                      <span className={`font-pixel text-[8px] ${selectedTrackIndex === actualIndex ? 'text-wire-black/60' : 'text-wire-gray'}`}>
                        {formatDuration(track.durationMs)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Message (if present) */}
      {message && (
        <div className="border border-wire-white p-4">
          <p className="text-wire-white text-sm italic text-center leading-relaxed">
            &ldquo;{message}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
