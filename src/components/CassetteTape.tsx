interface CassetteTapeProps {
  trackCount?: number;
  maxTracks?: number;
  title?: string;
}

export function CassetteTape({ trackCount = 0, maxTracks = 12, title }: CassetteTapeProps) {
  const fillPercentage = Math.min((trackCount / maxTracks) * 100, 100);

  return (
    <div className="cassette relative w-64 h-40 bg-retro-black border-4 border-retro-brown rounded-lg p-4">
      {/* Label area */}
      <div className="absolute top-2 left-4 right-4 h-16 bg-retro-cream border-2 border-retro-brown rounded">
        <div className="p-2 text-center">
          {title ? (
            <p className="font-pixel text-[8px] text-retro-black truncate">{title}</p>
          ) : (
            <p className="font-pixel text-[8px] text-retro-brown">YOUR MIXTAPE</p>
          )}
        </div>
        {/* Tape lines */}
        <div className="absolute bottom-2 left-2 right-2 space-y-1">
          <div className="h-0.5 bg-retro-brown opacity-50"></div>
          <div className="h-0.5 bg-retro-brown opacity-50"></div>
          <div className="h-0.5 bg-retro-brown opacity-50"></div>
        </div>
      </div>

      {/* Tape reels */}
      <div className="absolute bottom-4 left-6 right-6 flex justify-between">
        <div className="w-10 h-10 rounded-full border-4 border-retro-brown bg-retro-navy flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-retro-cream"></div>
        </div>
        <div className="w-10 h-10 rounded-full border-4 border-retro-brown bg-retro-navy flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-retro-cream"></div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-2 bg-retro-brown rounded-full overflow-hidden">
        <div
          className="h-full bg-retro-orange transition-all duration-300"
          style={{ width: `${fillPercentage}%` }}
        ></div>
      </div>

      {/* Track count */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
        <p className="font-pixel text-[8px] text-retro-brown">
          {trackCount}/{maxTracks} TRACKS
        </p>
      </div>
    </div>
  );
}
