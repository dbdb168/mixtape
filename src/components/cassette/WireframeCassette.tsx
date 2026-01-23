'use client';

interface WireframeCassetteProps {
  title?: string;
  sideLabel?: string;
  className?: string;
}

export function WireframeCassette({
  title = 'MIXTAPE',
  sideLabel = 'SIDE A',
  className = ''
}: WireframeCassetteProps) {
  return (
    <svg
      viewBox="0 0 320 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main cassette body */}
      <rect x="10" y="10" width="300" height="180" stroke="white" strokeWidth="2" fill="none" />

      {/* Inner border */}
      <rect x="20" y="20" width="280" height="160" stroke="white" strokeWidth="1" fill="none" />

      {/* Top label area */}
      <rect x="30" y="30" width="260" height="40" stroke="white" strokeWidth="1" fill="none" />

      {/* Title text */}
      <text x="160" y="55" textAnchor="middle" fill="white" fontFamily="monospace" fontSize="14" fontWeight="bold">
        {title}
      </text>

      {/* Side label */}
      <text x="50" y="50" fill="white" fontFamily="monospace" fontSize="10">
        {sideLabel}
      </text>

      {/* Tape window */}
      <rect x="60" y="80" width="200" height="60" stroke="white" strokeWidth="1" fill="none" />

      {/* Left tape reel */}
      <circle cx="110" cy="110" r="25" stroke="white" strokeWidth="1" fill="none" />
      <circle cx="110" cy="110" r="18" stroke="white" strokeWidth="1" fill="none" />
      <circle cx="110" cy="110" r="10" stroke="white" strokeWidth="1" fill="none" />
      <circle cx="110" cy="110" r="4" stroke="white" strokeWidth="1" fill="none" />

      {/* Left reel spokes */}
      <line x1="110" y1="85" x2="110" y2="92" stroke="white" strokeWidth="1" />
      <line x1="110" y1="128" x2="110" y2="135" stroke="white" strokeWidth="1" />
      <line x1="85" y1="110" x2="92" y2="110" stroke="white" strokeWidth="1" />
      <line x1="128" y1="110" x2="135" y2="110" stroke="white" strokeWidth="1" />

      {/* Right tape reel */}
      <circle cx="210" cy="110" r="25" stroke="white" strokeWidth="1" fill="none" />
      <circle cx="210" cy="110" r="18" stroke="white" strokeWidth="1" fill="none" />
      <circle cx="210" cy="110" r="10" stroke="white" strokeWidth="1" fill="none" />
      <circle cx="210" cy="110" r="4" stroke="white" strokeWidth="1" fill="none" />

      {/* Right reel spokes */}
      <line x1="210" y1="85" x2="210" y2="92" stroke="white" strokeWidth="1" />
      <line x1="210" y1="128" x2="210" y2="135" stroke="white" strokeWidth="1" />
      <line x1="185" y1="110" x2="192" y2="110" stroke="white" strokeWidth="1" />
      <line x1="228" y1="110" x2="235" y2="110" stroke="white" strokeWidth="1" />

      {/* Tape between reels */}
      <line x1="135" y1="100" x2="185" y2="100" stroke="white" strokeWidth="1" />
      <line x1="135" y1="120" x2="185" y2="120" stroke="white" strokeWidth="1" />

      {/* Crosshatch pattern in tape window background */}
      <defs>
        <pattern id="cassette-crosshatch" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M0 0L8 8M8 0L0 8" stroke="white" strokeWidth="0.3" opacity="0.2" />
        </pattern>
      </defs>
      <rect x="135" y="95" width="50" height="30" fill="url(#cassette-crosshatch)" />

      {/* Bottom guides/holes */}
      <rect x="140" y="150" width="40" height="20" stroke="white" strokeWidth="1" fill="none" />

      {/* Corner screws */}
      <circle cx="30" cy="30" r="3" stroke="white" strokeWidth="1" fill="none" />
      <circle cx="290" cy="30" r="3" stroke="white" strokeWidth="1" fill="none" />
      <circle cx="30" cy="170" r="3" stroke="white" strokeWidth="1" fill="none" />
      <circle cx="290" cy="170" r="3" stroke="white" strokeWidth="1" fill="none" />

      {/* Write protect tabs */}
      <rect x="270" y="155" width="15" height="15" stroke="white" strokeWidth="1" fill="none" />
      <rect x="35" y="155" width="15" height="15" stroke="white" strokeWidth="1" fill="none" />
    </svg>
  );
}
