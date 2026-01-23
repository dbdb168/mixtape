'use client';

interface TransportControlsProps {
  onPrev?: () => void;
  onNext?: () => void;
  onPlay?: () => void;
  onStop?: () => void;
  onRecord?: () => void;
  onEject?: () => void;
  isRecording?: boolean;
  isPlaying?: boolean;
  canEject?: boolean;
  className?: string;
}

export function TransportControls({
  onPrev,
  onNext,
  onPlay,
  onStop,
  onRecord,
  onEject,
  isRecording = false,
  isPlaying = false,
  canEject = false,
  className = '',
}: TransportControlsProps) {
  return (
    <div className={`border border-wire-white p-3 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        {/* Left controls - Navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={onPrev}
            className="btn-transport"
            title="Previous"
          >
            ◄◄
          </button>
          <button
            onClick={onNext}
            className="btn-transport"
            title="Next"
          >
            ►►
          </button>
        </div>

        {/* Center divider */}
        <div className="flex-1 h-px bg-wire-white mx-2" />

        {/* Right controls - Playback */}
        <div className="flex items-center gap-1">
          <button
            onClick={onRecord}
            className={`btn-transport ${isRecording ? 'bg-wire-red text-wire-black border-wire-red' : ''}`}
            title="Record"
          >
            <span className={isRecording ? 'animate-blink-rec' : ''}>●</span>
          </button>
          <button
            onClick={onPlay}
            className={`btn-transport ${isPlaying ? 'bg-wire-white text-wire-black' : ''}`}
            title="Play"
          >
            ▶
          </button>
          <button
            onClick={onStop}
            className="btn-transport"
            title="Stop"
          >
            ■
          </button>
          <button
            onClick={onEject}
            disabled={!canEject}
            className={`btn-transport ${canEject ? 'hover:bg-wire-white hover:text-wire-black' : 'opacity-30 cursor-not-allowed'}`}
            title="Eject / Finish"
          >
            ⏏
          </button>
        </div>
      </div>
    </div>
  );
}
