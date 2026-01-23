'use client';

interface SpeakerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Speaker({ size = 'md', className = '' }: SpeakerProps) {
  const dimensions = {
    sm: { width: 60, height: 80 },
    md: { width: 80, height: 120 },
    lg: { width: 100, height: 160 },
  };

  const { width, height } = dimensions[size];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer frame */}
      <rect
        x="1"
        y="1"
        width={width - 2}
        height={height - 2}
        stroke="white"
        strokeWidth="1"
        fill="none"
      />

      {/* Inner frame */}
      <rect
        x="4"
        y="4"
        width={width - 8}
        height={height - 8}
        stroke="white"
        strokeWidth="1"
        fill="none"
      />

      {/* Crosshatch pattern */}
      <defs>
        <pattern id={`crosshatch-${size}`} width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M0 0L6 6M6 0L0 6" stroke="white" strokeWidth="0.5" opacity="0.6" />
        </pattern>
      </defs>

      <rect
        x="8"
        y="8"
        width={width - 16}
        height={height - 16}
        fill={`url(#crosshatch-${size})`}
      />

      {/* Center cone outline */}
      <circle
        cx={width / 2}
        cy={height / 2}
        r={Math.min(width, height) / 4}
        stroke="white"
        strokeWidth="1"
        fill="none"
      />

      {/* Inner cone */}
      <circle
        cx={width / 2}
        cy={height / 2}
        r={Math.min(width, height) / 8}
        stroke="white"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}
