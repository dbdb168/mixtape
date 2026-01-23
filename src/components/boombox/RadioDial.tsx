'use client';

interface RadioDialProps {
  isSearching?: boolean;
  className?: string;
}

export function RadioDial({ isSearching = false, className = '' }: RadioDialProps) {
  return (
    <div className={`border border-wire-white p-2 ${className}`}>
      {/* Dial display */}
      <div className="border border-wire-white px-3 py-1">
        <div className="flex items-center justify-between">
          {/* FM scale */}
          <div className="flex items-center gap-2 text-[8px] font-pixel text-wire-white">
            <span className="text-wire-gray">FM</span>
            <span>88</span>
            <span>92</span>
            <span>96</span>
            <span>100</span>
            <span>104</span>
            <span>108</span>
          </div>
        </div>

        {/* Tuning indicator line */}
        <div className="relative h-3 mt-1 border-t border-wire-white">
          <div
            className={`absolute top-0 w-0.5 h-3 bg-wire-white transition-all duration-300 ${
              isSearching ? 'animate-pulse' : ''
            }`}
            style={{ left: isSearching ? '60%' : '50%' }}
          />
        </div>

        {/* AM scale */}
        <div className="flex items-center gap-2 text-[8px] font-pixel text-wire-gray mt-1">
          <span>AM</span>
          <span>530</span>
          <span>700</span>
          <span>900</span>
          <span>1100</span>
          <span>1400</span>
          <span>1700</span>
        </div>
      </div>

      {/* MIXTAPE label */}
      <div className="text-center mt-2">
        <span className="font-pixel text-sm text-wire-white tracking-[0.3em]">
          MIXTAPE
        </span>
      </div>
    </div>
  );
}
