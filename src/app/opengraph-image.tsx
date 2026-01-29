import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Mixtape - More Feels than a Playlist';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1a0a28 0%, #050210 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Glow effect */}
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            width: 800,
            height: 400,
            background: 'radial-gradient(ellipse, rgba(164, 19, 236, 0.3) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Cassette icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 120,
            height: 120,
            background: '#a413ec',
            borderRadius: 16,
            marginBottom: 40,
            boxShadow: '0 0 60px rgba(164, 19, 236, 0.5)',
          }}
        >
          <svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
          >
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <circle cx="8" cy="12" r="2" />
            <circle cx="16" cy="12" r="2" />
            <line x1="10" y1="12" x2="14" y2="12" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: 'white',
            letterSpacing: '-2px',
            marginBottom: 20,
          }}
        >
          MIXTAPE
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            color: 'rgba(255, 255, 255, 0.7)',
            textAlign: 'center',
            maxWidth: 800,
          }}
        >
          More Feels than a Playlist
        </div>

        {/* CTA hint */}
        <div
          style={{
            marginTop: 40,
            padding: '16px 32px',
            background: 'rgba(164, 19, 236, 0.3)',
            borderRadius: 8,
            border: '1px solid rgba(164, 19, 236, 0.5)',
            fontSize: 20,
            color: '#a413ec',
            fontWeight: 600,
          }}
        >
          Send a Mixtape to Someone
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
