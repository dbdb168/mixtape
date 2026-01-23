interface CassetteTapeProps {
  trackCount?: number;
  maxTracks?: number;
  title?: string;
}

export function CassetteTape({ trackCount = 0, maxTracks = 12, title }: CassetteTapeProps) {
  const fillPercentage = Math.min((trackCount / maxTracks) * 100, 100);

  return (
    <div className="cassette relative w-64 h-40 bg-noir-surface border border-noir-border rounded-lg p-4">
      {/* Label area */}
      <div className="absolute top-2 left-4 right-4 h-16 bg-noir-bg border border-noir-border rounded">
        <div className="p-2 text-center">
          {title ? (
            <p className="font-pixel text-[8px] text-noir-white truncate">{title}</p>
          ) : (
            <p className="font-pixel text-[8px] text-noir-muted">YOUR MIXTAPE</p>
          )}
        </div>
        {/* Tape lines */}
        <div className="absolute bottom-2 left-2 right-2 space-y-1">
          <div className="h-0.5 bg-noir-border"></div>
          <div className="h-0.5 bg-noir-border"></div>
          <div className="h-0.5 bg-noir-border"></div>
        </div>
      </div>

      {/* Tape reels */}
      <div className="absolute bottom-4 left-6 right-6 flex justify-between">
        <div className="w-10 h-10 rounded-full border-2 border-noir-border bg-noir-bg flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-noir-muted"></div>
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-noir-border bg-noir-bg flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-noir-muted"></div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-2 bg-noir-border rounded-full overflow-hidden">
        <div
          className="h-full bg-noir-light transition-all duration-300"
          style={{ width: `${fillPercentage}%` }}
        ></div>
      </div>

      {/* Track count */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
        <p className="font-pixel text-[8px] text-noir-muted">
          {trackCount}/{maxTracks} TRACKS
        </p>
      </div>
    </div>
  );
}
