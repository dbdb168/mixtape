import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

export const alt = 'A mixtape made for you';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

interface Props {
  params: Promise<{ token: string }>;
}

export default async function Image({ params }: Props) {
  const { token } = await params;

  // Fetch mixtape data
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: mixtape } = await supabase
    .from('mixtapes')
    .select('id, title, sender_name, recipient_name')
    .eq('share_token', token)
    .single();

  let trackCount = 0;
  if (mixtape?.id) {
    const { count } = await supabase
      .from('tracks')
      .select('*', { count: 'exact', head: true })
      .eq('mixtape_id', mixtape.id);
    trackCount = count || 0;
  }

  const senderName = mixtape?.sender_name || 'Someone';
  const title = mixtape?.title || 'A Mixtape';

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
          position: 'relative',
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

        {/* "You received" text */}
        <div
          style={{
            fontSize: 24,
            color: 'rgba(255, 255, 255, 0.5)',
            textTransform: 'uppercase',
            letterSpacing: 4,
            marginBottom: 20,
          }}
        >
          You received a mixtape
        </div>

        {/* Cassette visualization */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: 500,
            height: 300,
            background: '#1a1a1a',
            borderRadius: 12,
            border: '3px solid rgba(255, 255, 255, 0.3)',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Label area */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '45%',
              background: 'linear-gradient(180deg, #f5f5dc 0%, #e8e4d0 100%)',
              padding: 20,
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: 'rgba(0, 0, 0, 0.4)',
                textTransform: 'uppercase',
                letterSpacing: 2,
                marginBottom: 8,
              }}
            >
              From {senderName}
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: '#1a1a1a',
                textAlign: 'center',
              }}
            >
              {title}
            </div>
          </div>

          {/* Reels area */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              flex: 1,
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '0 40px',
            }}
          >
            {/* Left reel */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                border: '3px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: '#000',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                }}
              />
            </div>

            {/* Track count */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: '#a413ec',
                }}
              >
                {trackCount}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: 'rgba(255, 255, 255, 0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                }}
              >
                Tracks
              </div>
            </div>

            {/* Right reel */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                border: '3px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: '#000',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                }}
              />
            </div>
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: 30,
            fontSize: 20,
            color: 'rgba(255, 255, 255, 0.6)',
          }}
        >
          Tap to listen
        </div>

        {/* Branding */}
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              background: '#a413ec',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="16"
              height="16"
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
          <div
            style={{
              fontSize: 18,
              color: 'rgba(255, 255, 255, 0.5)',
              letterSpacing: 2,
            }}
          >
            MIXTAPE
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
