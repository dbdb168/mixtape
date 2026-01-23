'use client';

interface TapeReelProps {
  size?: number;
  spinning?: boolean;
  className?: string;
}

export function TapeReel({ size = 40, spinning = false, className = '' }: TapeReelProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${spinning ? 'animate-spin-slow' : ''} ${className}`}
    >
      {/* Outer circle */}
      <circle cx="20" cy="20" r="18" stroke="white" strokeWidth="1" fill="none" />

      {/* Middle circle */}
      <circle cx="20" cy="20" r="12" stroke="white" strokeWidth="1" fill="none" />

      {/* Inner hub */}
      <circle cx="20" cy="20" r="6" stroke="white" strokeWidth="1" fill="none" />

      {/* Center hole */}
      <circle cx="20" cy="20" r="2" stroke="white" strokeWidth="1" fill="none" />

      {/* Spokes */}
      <line x1="20" y1="8" x2="20" y2="14" stroke="white" strokeWidth="1" />
      <line x1="20" y1="26" x2="20" y2="32" stroke="white" strokeWidth="1" />
      <line x1="8" y1="20" x2="14" y2="20" stroke="white" strokeWidth="1" />
      <line x1="26" y1="20" x2="32" y2="20" stroke="white" strokeWidth="1" />

      {/* Diagonal spokes */}
      <line x1="11.5" y1="11.5" x2="15.8" y2="15.8" stroke="white" strokeWidth="1" />
      <line x1="24.2" y1="24.2" x2="28.5" y2="28.5" stroke="white" strokeWidth="1" />
      <line x1="28.5" y1="11.5" x2="24.2" y2="15.8" stroke="white" strokeWidth="1" />
      <line x1="15.8" y1="24.2" x2="11.5" y2="28.5" stroke="white" strokeWidth="1" />
    </svg>
  );
}
