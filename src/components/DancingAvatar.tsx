interface DancingAvatarProps {
  photoUrl?: string | null;
  senderName?: string | null;
  isPlaying?: boolean;
}

export function DancingAvatar({
  photoUrl,
  senderName,
  isPlaying = false,
}: DancingAvatarProps) {
  return (
    <div
      className={`inline-block ${isPlaying ? 'animate-wiggle' : ''}`}
    >
      {/* Polaroid frame */}
      <div className="bg-white p-2 shadow-[4px_4px_0_0_#1A1A2E] border-4 border-retro-black">
        {/* Photo container */}
        <div className="w-24 h-24 bg-retro-cream flex items-center justify-center overflow-hidden">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={senderName ? `Photo of ${senderName}` : 'Sender photo'}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-4xl">🎵</span>
          )}
        </div>

        {/* Label */}
        <div className="mt-2 text-center">
          <p className="font-pixel text-[8px] text-retro-black">
            FROM: {senderName || 'A FRIEND'}
          </p>
        </div>
      </div>
    </div>
  );
}
