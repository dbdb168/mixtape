'use client';

import { Speaker } from './Speaker';
import { RadioDial } from './RadioDial';
import { CassetteDeck } from './CassetteDeck';
import { TransportControls } from './TransportControls';

interface BoomboxProps {
  leftDeckContent: React.ReactNode;
  rightDeckContent: React.ReactNode;
  isSearching?: boolean;
  isRecording?: boolean;
  trackCount?: number;
  onPrev?: () => void;
  onNext?: () => void;
  onPlay?: () => void;
  onStop?: () => void;
  onEject?: () => void;
  className?: string;
}

export function Boombox({
  leftDeckContent,
  rightDeckContent,
  isSearching = false,
  isRecording = false,
  trackCount = 0,
  onPrev,
  onNext,
  onPlay,
  onStop,
  onEject,
  className = '',
}: BoomboxProps) {
  return (
    <div className={`border-2 border-wire-white p-4 max-w-4xl mx-auto ${className}`}>
      {/* Top section: Speakers + Radio Dial */}
      <div className="flex items-start gap-4 mb-4">
        {/* Left speaker */}
        <div className="hidden md:block">
          <Speaker size="sm" />
        </div>

        {/* Radio dial - center */}
        <div className="flex-1">
          <RadioDial isSearching={isSearching} />
        </div>

        {/* Right speaker */}
        <div className="hidden md:block">
          <Speaker size="sm" />
        </div>
      </div>

      {/* Middle section: Dual Cassette Decks */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* Left deck - SEARCH */}
        <CassetteDeck
          label="SEARCH"
          isPlaying={isSearching}
        >
          {leftDeckContent}
        </CassetteDeck>

        {/* Right deck - YOUR MIXTAPE */}
        <CassetteDeck
          label={`YOUR MIXTAPE (${trackCount}/12)`}
          isRecording={isRecording}
        >
          {rightDeckContent}
        </CassetteDeck>
      </div>

      {/* Transport Controls */}
      <TransportControls
        onPrev={onPrev}
        onNext={onNext}
        onPlay={onPlay}
        onStop={onStop}
        onEject={onEject}
        isRecording={isRecording}
        canEject={trackCount > 0}
      />

      {/* Bottom speakers (mobile hidden, desktop visible) */}
      <div className="hidden md:flex justify-between mt-4 px-8">
        <Speaker size="lg" />
        <Speaker size="lg" />
      </div>
    </div>
  );
}

export { Speaker } from './Speaker';
export { RadioDial } from './RadioDial';
export { CassetteDeck } from './CassetteDeck';
export { TransportControls } from './TransportControls';
export { TapeReel } from './TapeReel';
