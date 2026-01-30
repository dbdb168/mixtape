import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'A mixtape made for you';
export const size = { width: 1200, height: 630 };
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
        {/* Purple icon box */}
        <div
          style={{
            width: 100,
            height: 100,
            background: '#a413ec',
            borderRadius: 16,
            marginBottom: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
            color: 'white',
          }}
        >
          ♫
        </div>

        {/* Main text */}
        <div style={{ fontSize: 48, color: 'white', fontWeight: 700, marginBottom: 16 }}>
          You received a mixtape!
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.6)', marginBottom: 40 }}>
          Someone made this just for you
        </div>

        {/* CTA button style */}
        <div
          style={{
            padding: '16px 32px',
            background: 'rgba(164, 19, 236, 0.3)',
            borderRadius: 8,
            border: '1px solid rgba(164, 19, 236, 0.5)',
            fontSize: 20,
            color: '#a413ec',
            fontWeight: 600,
          }}
        >
          Tap to listen
        </div>

        {/* Branding at bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            fontSize: 16,
            color: 'rgba(255, 255, 255, 0.4)',
            letterSpacing: 2,
          }}
        >
          MIXTAPE
        </div>
      </div>
    ),
    { ...size }
  );
}
