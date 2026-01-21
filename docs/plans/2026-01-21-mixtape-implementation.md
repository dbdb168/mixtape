# Mixtape Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a web app that lets users create personalised mixtapes via Spotify and share them with friends.

**Architecture:** Next.js 14 App Router with Supabase for database/auth/storage. Single-page creation flow, SSR recipient pages for link previews. Event-driven analytics with simple admin dashboard.

**Tech Stack:** Next.js 14, React 18, Tailwind CSS, Supabase (PostgreSQL + Storage), Spotify Web API, Playwright for E2E tests.

**Visual Style:** Early Nintendo / 8-bit aesthetic with pixel typography and retro colors.

**Reference:** `docs/plans/2026-01-21-mixtape-design.md`

---

## Phase 1: Project Setup & Database

### Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`
- Create: `next.config.js`
- Create: `tailwind.config.js`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`

**Step 1: Create Next.js project with TypeScript and Tailwind**

Run:
```bash
cd /Users/davidbeath/Documents/2026/Projects/Mixtape
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Select defaults when prompted. This creates the project structure.

**Step 2: Verify project runs**

Run:
```bash
npm run dev
```

Expected: Server starts at http://localhost:3000, shows Next.js welcome page.

**Step 3: Commit**

```bash
git add .
git commit -m "chore: initialize Next.js 14 project with TypeScript and Tailwind"
```

---

### Task 2: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install Supabase client**

Run:
```bash
npm install @supabase/supabase-js @supabase/ssr
```

**Step 2: Install additional dependencies**

Run:
```bash
npm install nanoid react-hot-toast
npm install -D @types/node playwright @playwright/test
```

- `nanoid`: Generate URL-safe share tokens
- `react-hot-toast`: Toast notifications for errors/success
- `playwright`: E2E testing

**Step 3: Initialize Playwright**

Run:
```bash
npx playwright install chromium webkit firefox
```

**Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add Supabase, nanoid, toast, and Playwright dependencies"
```

---

### Task 3: Configure Environment Variables

**Files:**
- Create: `.env.local.example`
- Create: `.env.local` (do not commit)
- Modify: `.gitignore`

**Step 1: Create environment template**

Create `.env.local.example`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Spotify
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Admin
ADMIN_PASSWORD=your_admin_password

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Step 2: Copy to actual env file**

Run:
```bash
cp .env.local.example .env.local
```

Then fill in actual values from Supabase dashboard and Spotify Developer Portal.

**Step 3: Verify .gitignore includes .env.local**

Check `.gitignore` contains:
```
.env*.local
```

**Step 4: Commit**

```bash
git add .env.local.example .gitignore
git commit -m "chore: add environment variable template"
```

---

### Task 4: Set Up Supabase Database Schema

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`

**Step 1: Create migration file**

Create `supabase/migrations/001_initial_schema.sql`:
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spotify_id TEXT UNIQUE NOT NULL,
  email TEXT,
  display_name TEXT,
  newsletter_opt_in BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mixtapes table
CREATE TABLE mixtapes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  share_token TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL CHECK (char_length(title) <= 50),
  recipient_name TEXT NOT NULL CHECK (char_length(recipient_name) <= 50),
  message TEXT CHECK (char_length(message) <= 200),
  photo_url TEXT,
  reply_to_mixtape_id UUID REFERENCES mixtapes(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tracks table
CREATE TABLE tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mixtape_id UUID REFERENCES mixtapes(id) ON DELETE CASCADE,
  spotify_track_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  track_name TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  album_art_url TEXT,
  duration_ms INTEGER,
  UNIQUE(mixtape_id, position)
);

-- Events table (analytics)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mixtape_id UUID REFERENCES mixtapes(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_mixtapes_user_id ON mixtapes(user_id);
CREATE INDEX idx_mixtapes_share_token ON mixtapes(share_token);
CREATE INDEX idx_tracks_mixtape_id ON tracks(mixtape_id);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_created ON events(created_at);
CREATE INDEX idx_events_mixtape_id ON events(mixtape_id);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE mixtapes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Users: can read/update own row
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid()::text = spotify_id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid()::text = spotify_id);

-- Mixtapes: owner can CRUD, anyone can read via share_token
CREATE POLICY "Owner can manage mixtapes" ON mixtapes FOR ALL USING (user_id IN (SELECT id FROM users WHERE spotify_id = auth.uid()::text));
CREATE POLICY "Anyone can view mixtapes by share_token" ON mixtapes FOR SELECT USING (true);

-- Tracks: follow mixtape permissions
CREATE POLICY "Tracks follow mixtape access" ON tracks FOR SELECT USING (true);
CREATE POLICY "Owner can manage tracks" ON tracks FOR ALL USING (mixtape_id IN (SELECT id FROM mixtapes WHERE user_id IN (SELECT id FROM users WHERE spotify_id = auth.uid()::text)));

-- Events: anyone can insert (for analytics), only service role can read
CREATE POLICY "Anyone can insert events" ON events FOR INSERT WITH CHECK (true);
```

**Step 2: Apply migration via Supabase dashboard**

Go to Supabase Dashboard → SQL Editor → Paste and run the migration.

Alternatively, if using Supabase CLI:
```bash
supabase db push
```

**Step 3: Verify tables exist**

In Supabase Dashboard → Table Editor, confirm you see: users, mixtapes, tracks, events.

**Step 4: Commit**

```bash
git add supabase/
git commit -m "feat: add initial database schema with RLS policies"
```

---

### Task 5: Create Supabase Client Utilities

**Files:**
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/types.ts`

**Step 1: Create TypeScript types for database**

Create `src/lib/supabase/types.ts`:
```typescript
export interface User {
  id: string;
  spotify_id: string;
  email: string | null;
  display_name: string | null;
  newsletter_opt_in: boolean;
  created_at: string;
}

export interface Mixtape {
  id: string;
  user_id: string;
  share_token: string;
  title: string;
  recipient_name: string;
  message: string | null;
  photo_url: string | null;
  reply_to_mixtape_id: string | null;
  created_at: string;
}

export interface Track {
  id: string;
  mixtape_id: string;
  spotify_track_id: string;
  position: number;
  track_name: string;
  artist_name: string;
  album_art_url: string | null;
  duration_ms: number | null;
}

export interface AnalyticsEvent {
  id: string;
  mixtape_id: string | null;
  user_id: string | null;
  event_type: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export type EventType =
  | 'page_view'
  | 'spotify_connected'
  | 'track_added'
  | 'track_removed'
  | 'mixtape_created'
  | 'share_clicked'
  | 'mixtape_viewed'
  | 'track_played'
  | 'cta_clicked'
  | 'error_occurred'
  | 'newsletter_signup';
```

**Step 2: Create browser client**

Create `src/lib/supabase/client.ts`:
```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**Step 3: Create server client**

Create `src/lib/supabase/server.ts`:
```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignore - called from Server Component
          }
        },
      },
    }
  );
}
```

**Step 4: Commit**

```bash
git add src/lib/supabase/
git commit -m "feat: add Supabase client utilities and TypeScript types"
```

---

## Phase 2: Spotify Authentication

### Task 6: Create Spotify Auth Utilities

**Files:**
- Create: `src/lib/spotify/auth.ts`
- Create: `src/lib/spotify/types.ts`

**Step 1: Create Spotify types**

Create `src/lib/spotify/types.ts`:
```typescript
export interface SpotifyTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface SpotifyUser {
  id: string;
  email: string;
  display_name: string;
  images: { url: string }[];
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string; width: number; height: number }[];
  };
  duration_ms: number;
  preview_url: string | null;
  uri: string;
}

export interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
    total: number;
  };
}
```

**Step 2: Create auth utilities**

Create `src/lib/spotify/auth.ts`:
```typescript
import { SpotifyTokens, SpotifyUser } from './types';

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

const SCOPES = [
  'user-read-email',
  'playlist-modify-public',
  'playlist-modify-private',
].join(' ');

export function getSpotifyAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    response_type: 'code',
    redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!,
    scope: SCOPES,
    state,
  });

  return `${SPOTIFY_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForTokens(code: string): Promise<SpotifyTokens> {
  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange code for tokens');
  }

  return response.json();
}

export async function refreshAccessToken(refreshToken: string): Promise<SpotifyTokens> {
  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh access token');
  }

  return response.json();
}

export async function getSpotifyUser(accessToken: string): Promise<SpotifyUser> {
  const response = await fetch(`${SPOTIFY_API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Spotify user');
  }

  return response.json();
}
```

**Step 3: Commit**

```bash
git add src/lib/spotify/
git commit -m "feat: add Spotify auth utilities and types"
```

---

### Task 7: Create Spotify OAuth API Routes

**Files:**
- Create: `src/app/api/auth/spotify/route.ts`
- Create: `src/app/api/auth/callback/route.ts`

**Step 1: Create OAuth initiation route**

Create `src/app/api/auth/spotify/route.ts`:
```typescript
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { nanoid } from 'nanoid';
import { getSpotifyAuthUrl } from '@/lib/spotify/auth';

export async function GET() {
  const state = nanoid();
  const cookieStore = await cookies();

  // Store state for CSRF protection
  cookieStore.set('spotify_auth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
  });

  const authUrl = getSpotifyAuthUrl(state);
  return NextResponse.redirect(authUrl);
}
```

**Step 2: Create OAuth callback route**

Create `src/app/api/auth/callback/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { exchangeCodeForTokens, getSpotifyUser } from '@/lib/spotify/auth';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const cookieStore = await cookies();
  const storedState = cookieStore.get('spotify_auth_state')?.value;

  // Clear the state cookie
  cookieStore.delete('spotify_auth_state');

  // Handle errors
  if (error) {
    return NextResponse.redirect(new URL('/?error=spotify_denied', request.url));
  }

  if (!code || !state || state !== storedState) {
    return NextResponse.redirect(new URL('/?error=invalid_state', request.url));
  }

  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);

    // Get Spotify user profile
    const spotifyUser = await getSpotifyUser(tokens.access_token);

    // Create Supabase admin client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Upsert user in database
    const { data: user, error: dbError } = await supabase
      .from('users')
      .upsert({
        spotify_id: spotifyUser.id,
        email: spotifyUser.email,
        display_name: spotifyUser.display_name,
      }, {
        onConflict: 'spotify_id',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.redirect(new URL('/?error=db_error', request.url));
    }

    // Store tokens in cookies
    const tokenExpiry = Date.now() + tokens.expires_in * 1000;

    cookieStore.set('spotify_access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in,
    });

    cookieStore.set('spotify_refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    cookieStore.set('spotify_token_expiry', tokenExpiry.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    });

    cookieStore.set('user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    });

    // Track event
    await supabase.from('events').insert({
      user_id: user.id,
      event_type: 'spotify_connected',
      metadata: {},
    });

    return NextResponse.redirect(new URL('/create', request.url));
  } catch (err) {
    console.error('OAuth error:', err);
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  }
}
```

**Step 3: Verify routes exist**

Run:
```bash
npm run dev
```

Visit http://localhost:3000/api/auth/spotify - should redirect to Spotify (will fail without valid credentials, but route exists).

**Step 4: Commit**

```bash
git add src/app/api/auth/
git commit -m "feat: add Spotify OAuth routes for login and callback"
```

---

### Task 8: Create Auth Session Utilities

**Files:**
- Create: `src/lib/auth/session.ts`

**Step 1: Create session utilities**

Create `src/lib/auth/session.ts`:
```typescript
import { cookies } from 'next/headers';
import { refreshAccessToken } from '@/lib/spotify/auth';

export interface Session {
  userId: string;
  accessToken: string;
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();

  const userId = cookieStore.get('user_id')?.value;
  const accessToken = cookieStore.get('spotify_access_token')?.value;
  const refreshToken = cookieStore.get('spotify_refresh_token')?.value;
  const tokenExpiry = cookieStore.get('spotify_token_expiry')?.value;

  if (!userId || !refreshToken) {
    return null;
  }

  // Check if token is expired or will expire in next 5 minutes
  const expiryTime = tokenExpiry ? parseInt(tokenExpiry) : 0;
  const isExpired = Date.now() > expiryTime - 5 * 60 * 1000;

  if (isExpired || !accessToken) {
    try {
      const newTokens = await refreshAccessToken(refreshToken);
      const newExpiry = Date.now() + newTokens.expires_in * 1000;

      cookieStore.set('spotify_access_token', newTokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: newTokens.expires_in,
      });

      cookieStore.set('spotify_token_expiry', newExpiry.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
      });

      if (newTokens.refresh_token) {
        cookieStore.set('spotify_refresh_token', newTokens.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30,
        });
      }

      return { userId, accessToken: newTokens.access_token };
    } catch {
      return null;
    }
  }

  return { userId, accessToken };
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('user_id');
  cookieStore.delete('spotify_access_token');
  cookieStore.delete('spotify_refresh_token');
  cookieStore.delete('spotify_token_expiry');
}
```

**Step 2: Commit**

```bash
git add src/lib/auth/
git commit -m "feat: add session management with token refresh"
```

---

## Phase 3: Core UI Components

### Task 9: Set Up Retro Design System

**Files:**
- Create: `src/styles/fonts.ts`
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`
- Create: `src/app/layout.tsx` (modify existing)

**Step 1: Configure retro fonts**

Create `src/styles/fonts.ts`:
```typescript
import { Press_Start_2P, Inter } from 'next/font/google';

export const pixelFont = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
});

export const bodyFont = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});
```

**Step 2: Update Tailwind config**

Modify `tailwind.config.ts`:
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['var(--font-pixel)', 'monospace'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      colors: {
        retro: {
          cream: '#F5E6D3',
          brown: '#8B4513',
          orange: '#D2691E',
          red: '#CD5C5C',
          teal: '#5F9EA0',
          navy: '#2C3E50',
          black: '#1A1A2E',
        },
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

**Step 3: Update global styles**

Modify `src/app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-retro-cream text-retro-black font-body;
  }

  h1, h2, h3 {
    @apply font-pixel;
  }
}

@layer components {
  .btn-retro {
    @apply font-pixel text-xs px-6 py-3 bg-retro-orange text-white
           border-4 border-retro-brown shadow-[4px_4px_0_0_#8B4513]
           hover:shadow-[2px_2px_0_0_#8B4513] hover:translate-x-[2px] hover:translate-y-[2px]
           active:shadow-none active:translate-x-[4px] active:translate-y-[4px]
           transition-all duration-100;
  }

  .card-retro {
    @apply bg-white border-4 border-retro-black shadow-[8px_8px_0_0_#1A1A2E] p-6;
  }

  .input-retro {
    @apply w-full px-4 py-3 border-4 border-retro-black font-body
           focus:outline-none focus:border-retro-teal;
  }
}

/* Pixel art cassette tape styles */
.cassette {
  image-rendering: pixelated;
}
```

**Step 4: Update layout**

Modify `src/app/layout.tsx`:
```typescript
import type { Metadata } from 'next';
import { pixelFont, bodyFont } from '@/styles/fonts';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mixtape - Make a mixtape for someone you care about',
  description: 'Create personalised music compilations and share them with friends. Connect Spotify, pick songs, add a message, and send the love.',
  openGraph: {
    title: 'Mixtape',
    description: 'Make a mixtape for someone you care about',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pixelFont.variable} ${bodyFont.variable}`}>
      <body>
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            className: 'font-pixel text-xs',
            style: {
              background: '#1A1A2E',
              color: '#F5E6D3',
              border: '4px solid #8B4513',
            },
          }}
        />
      </body>
    </html>
  );
}
```

**Step 5: Verify styles work**

Run:
```bash
npm run dev
```

Visit http://localhost:3000 - should see retro cream background.

**Step 6: Commit**

```bash
git add src/styles/ tailwind.config.ts src/app/globals.css src/app/layout.tsx
git commit -m "feat: set up retro 8-bit design system with pixel fonts and colors"
```

---

### Task 10: Create Landing Page

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/components/CassetteTape.tsx`

**Step 1: Create cassette tape component**

Create `src/components/CassetteTape.tsx`:
```typescript
interface CassetteTapeProps {
  trackCount?: number;
  maxTracks?: number;
  title?: string;
}

export function CassetteTape({ trackCount = 0, maxTracks = 12, title }: CassetteTapeProps) {
  const fillPercentage = Math.min((trackCount / maxTracks) * 100, 100);

  return (
    <div className="cassette relative w-64 h-40 bg-retro-black border-4 border-retro-brown rounded-lg p-4">
      {/* Label area */}
      <div className="absolute top-2 left-4 right-4 h-16 bg-retro-cream border-2 border-retro-brown rounded">
        <div className="p-2 text-center">
          {title ? (
            <p className="font-pixel text-[8px] text-retro-black truncate">{title}</p>
          ) : (
            <p className="font-pixel text-[8px] text-retro-brown">YOUR MIXTAPE</p>
          )}
        </div>
        {/* Tape lines */}
        <div className="absolute bottom-2 left-2 right-2 space-y-1">
          <div className="h-0.5 bg-retro-brown opacity-50"></div>
          <div className="h-0.5 bg-retro-brown opacity-50"></div>
          <div className="h-0.5 bg-retro-brown opacity-50"></div>
        </div>
      </div>

      {/* Tape reels */}
      <div className="absolute bottom-4 left-6 right-6 flex justify-between">
        <div className="w-10 h-10 rounded-full border-4 border-retro-brown bg-retro-navy flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-retro-cream"></div>
        </div>
        <div className="w-10 h-10 rounded-full border-4 border-retro-brown bg-retro-navy flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-retro-cream"></div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-2 bg-retro-brown rounded-full overflow-hidden">
        <div
          className="h-full bg-retro-orange transition-all duration-300"
          style={{ width: `${fillPercentage}%` }}
        ></div>
      </div>

      {/* Track count */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
        <p className="font-pixel text-[8px] text-retro-brown">
          {trackCount}/{maxTracks} TRACKS
        </p>
      </div>
    </div>
  );
}
```

**Step 2: Create landing page**

Modify `src/app/page.tsx`:
```typescript
import Link from 'next/link';
import { CassetteTape } from '@/components/CassetteTape';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Title */}
        <h1 className="font-pixel text-4xl md:text-5xl text-retro-black leading-relaxed">
          MIXTAPE
        </h1>

        {/* Tagline */}
        <p className="font-pixel text-sm text-retro-brown leading-relaxed">
          Make a mixtape for someone you care about
        </p>

        {/* Cassette visual */}
        <div className="flex justify-center py-8">
          <CassetteTape />
        </div>

        {/* Description */}
        <p className="text-lg text-retro-navy max-w-md mx-auto leading-relaxed">
          Pick your songs, add a personal message, and share the love.
          Just like the old days, but without the tangled tape.
        </p>

        {/* CTA */}
        <div className="pt-4">
          <Link href="/api/auth/spotify" className="btn-retro inline-block">
            MAKE A MIXTAPE
          </Link>
        </div>

        {/* Spotify note */}
        <p className="text-xs text-retro-brown">
          Connects with your Spotify account
        </p>
      </div>
    </main>
  );
}
```

**Step 3: Verify page renders**

Run:
```bash
npm run dev
```

Visit http://localhost:3000 - should see landing page with cassette and CTA.

**Step 4: Commit**

```bash
git add src/app/page.tsx src/components/
git commit -m "feat: add landing page with cassette tape visual"
```

---

## Phase 4: Spotify Search & Track Management

### Task 11: Create Spotify Search API Route

**Files:**
- Create: `src/app/api/search/route.ts`
- Create: `src/lib/spotify/api.ts`

**Step 1: Create Spotify API utilities**

Create `src/lib/spotify/api.ts`:
```typescript
import { SpotifySearchResponse } from './types';

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

export async function searchTracks(
  accessToken: string,
  query: string,
  limit: number = 10
): Promise<SpotifySearchResponse> {
  const params = new URLSearchParams({
    q: query,
    type: 'track',
    limit: limit.toString(),
  });

  const response = await fetch(`${SPOTIFY_API_URL}/search?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Spotify search failed: ${response.status}`);
  }

  return response.json();
}

export async function createPlaylist(
  accessToken: string,
  userId: string,
  name: string,
  trackUris: string[]
): Promise<{ id: string; external_urls: { spotify: string } }> {
  // Create playlist
  const createResponse = await fetch(
    `${SPOTIFY_API_URL}/users/${userId}/playlists`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description: 'Created with Mixtape - mixtape.fm',
        public: false,
      }),
    }
  );

  if (!createResponse.ok) {
    throw new Error('Failed to create playlist');
  }

  const playlist = await createResponse.json();

  // Add tracks
  await fetch(`${SPOTIFY_API_URL}/playlists/${playlist.id}/tracks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uris: trackUris }),
  });

  return playlist;
}
```

**Step 2: Create search API route**

Create `src/app/api/search/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { searchTracks } from '@/lib/spotify/api';

export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json({ error: 'Query too short' }, { status: 400 });
  }

  try {
    const results = await searchTracks(session.accessToken, query);

    // Transform to simplified format
    const tracks = results.tracks.items.map((track) => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map((a) => a.name).join(', '),
      album: track.album.name,
      albumArt: track.album.images[1]?.url || track.album.images[0]?.url,
      duration: track.duration_ms,
      previewUrl: track.preview_url,
      uri: track.uri,
    }));

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'The jukebox is jammed. Give it another spin?' },
      { status: 500 }
    );
  }
}
```

**Step 3: Commit**

```bash
git add src/lib/spotify/api.ts src/app/api/search/
git commit -m "feat: add Spotify search API route"
```

---

### Task 12: Create Track Search Component

**Files:**
- Create: `src/components/TrackSearch.tsx`
- Create: `src/hooks/useDebounce.ts`

**Step 1: Create debounce hook**

Create `src/hooks/useDebounce.ts`:
```typescript
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

**Step 2: Create track search component**

Create `src/components/TrackSearch.tsx`:
```typescript
'use client';

import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import toast from 'react-hot-toast';

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  duration: number;
  previewUrl: string | null;
  uri: string;
}

interface TrackSearchProps {
  onAddTrack: (track: Track) => void;
  disabledTrackIds: string[];
}

export function TrackSearch({ onAddTrack, disabledTrackIds }: TrackSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [playingPreview, setPlayingPreview] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    const search = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
        const data = await response.json();

        if (response.ok) {
          setResults(data.tracks);
        } else {
          toast.error(data.error || 'Search failed');
        }
      } catch {
        toast.error('The jukebox is jammed. Give it another spin?');
      } finally {
        setIsLoading(false);
      }
    };

    search();
  }, [debouncedQuery]);

  const playPreview = (previewUrl: string, trackId: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    if (playingPreview === trackId) {
      setPlayingPreview(null);
      return;
    }

    audioRef.current = new Audio(previewUrl);
    audioRef.current.volume = 0.5;
    audioRef.current.play();
    audioRef.current.onended = () => setPlayingPreview(null);
    setPlayingPreview(trackId);
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for songs..."
        className="input-retro"
      />

      {isLoading && (
        <p className="font-pixel text-xs text-retro-brown text-center">
          SEARCHING...
        </p>
      )}

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {results.map((track) => {
          const isDisabled = disabledTrackIds.includes(track.id);

          return (
            <div
              key={track.id}
              className={`flex items-center gap-3 p-3 border-2 border-retro-black ${
                isDisabled ? 'opacity-50' : 'hover:bg-retro-cream cursor-pointer'
              }`}
              onClick={() => !isDisabled && onAddTrack(track)}
            >
              {/* Album art */}
              {track.albumArt && (
                <img
                  src={track.albumArt}
                  alt={track.album}
                  className="w-12 h-12 border-2 border-retro-black"
                />
              )}

              {/* Track info */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{track.name}</p>
                <p className="text-xs text-retro-brown truncate">{track.artist}</p>
              </div>

              {/* Duration */}
              <span className="font-pixel text-[10px] text-retro-brown">
                {formatDuration(track.duration)}
              </span>

              {/* Preview button */}
              {track.previewUrl && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playPreview(track.previewUrl!, track.id);
                  }}
                  className="p-2 hover:bg-retro-orange hover:text-white rounded"
                  title="Preview"
                >
                  {playingPreview === track.id ? '⏸' : '▶'}
                </button>
              )}

              {/* Add indicator */}
              {isDisabled ? (
                <span className="font-pixel text-[10px] text-retro-teal">ADDED</span>
              ) : (
                <span className="font-pixel text-[10px] text-retro-orange">+ ADD</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add src/components/TrackSearch.tsx src/hooks/
git commit -m "feat: add track search component with preview playback"
```

---

### Task 13: Create Track List Component

**Files:**
- Create: `src/components/TrackList.tsx`

**Step 1: Create track list component with drag-and-drop**

Create `src/components/TrackList.tsx`:
```typescript
'use client';

import { useState } from 'react';

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  duration: number;
  previewUrl: string | null;
  uri: string;
}

interface TrackListProps {
  tracks: Track[];
  onRemoveTrack: (trackId: string) => void;
  onReorderTracks: (tracks: Track[]) => void;
}

export function TrackList({ tracks, onRemoveTrack, onReorderTracks }: TrackListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newTracks = [...tracks];
    const draggedTrack = newTracks[draggedIndex];
    newTracks.splice(draggedIndex, 1);
    newTracks.splice(index, 0, draggedTrack);

    setDraggedIndex(index);
    onReorderTracks(newTracks);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  if (tracks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="font-pixel text-xs text-retro-brown">
          NO TRACKS YET
        </p>
        <p className="text-sm text-retro-navy mt-2">
          Search and add songs to your mixtape
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tracks.map((track, index) => (
        <div
          key={track.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          className={`flex items-center gap-3 p-3 border-2 border-retro-black bg-white cursor-move ${
            draggedIndex === index ? 'opacity-50' : ''
          }`}
        >
          {/* Position number */}
          <span className="font-pixel text-xs text-retro-brown w-6">
            {(index + 1).toString().padStart(2, '0')}
          </span>

          {/* Album art */}
          {track.albumArt && (
            <img
              src={track.albumArt}
              alt={track.album}
              className="w-10 h-10 border-2 border-retro-black"
            />
          )}

          {/* Track info */}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">{track.name}</p>
            <p className="text-xs text-retro-brown truncate">{track.artist}</p>
          </div>

          {/* Duration */}
          <span className="font-pixel text-[10px] text-retro-brown">
            {formatDuration(track.duration)}
          </span>

          {/* Remove button */}
          <button
            onClick={() => onRemoveTrack(track.id)}
            className="p-2 hover:bg-retro-red hover:text-white rounded font-pixel text-xs"
            title="Remove"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/TrackList.tsx
git commit -m "feat: add track list component with drag-and-drop reordering"
```

---

## Phase 5: Mixtape Creation Flow

### Task 14: Create Mixtape Creation Page

**Files:**
- Create: `src/app/create/page.tsx`
- Create: `src/components/MixtapeForm.tsx`

**Step 1: Create mixtape form component**

Create `src/components/MixtapeForm.tsx`:
```typescript
'use client';

import { useState } from 'react';

interface MixtapeFormData {
  title: string;
  recipientName: string;
  message: string;
  saveToSpotify: boolean;
}

interface MixtapeFormProps {
  onSubmit: (data: MixtapeFormData) => void;
  isSubmitting: boolean;
}

export function MixtapeForm({ onSubmit, isSubmitting }: MixtapeFormProps) {
  const [title, setTitle] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [saveToSpotify, setSaveToSpotify] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, recipientName, message, saveToSpotify });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block font-pixel text-xs text-retro-brown mb-2">
          MIXTAPE TITLE *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value.slice(0, 50))}
          placeholder="Summer 2024"
          className="input-retro"
          required
          maxLength={50}
        />
        <p className="text-xs text-retro-brown mt-1 text-right">
          {title.length}/50
        </p>
      </div>

      <div>
        <label className="block font-pixel text-xs text-retro-brown mb-2">
          FOR *
        </label>
        <input
          type="text"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value.slice(0, 50))}
          placeholder="Sarah"
          className="input-retro"
          required
          maxLength={50}
        />
      </div>

      <div>
        <label className="block font-pixel text-xs text-retro-brown mb-2">
          YOUR MESSAGE
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, 200))}
          placeholder="Remember that summer in Ibiza? Here are the songs..."
          className="input-retro resize-none h-24"
          maxLength={200}
        />
        <p className="text-xs text-retro-brown mt-1 text-right">
          {message.length}/200
        </p>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="saveToSpotify"
          checked={saveToSpotify}
          onChange={(e) => setSaveToSpotify(e.target.checked)}
          className="w-5 h-5 accent-retro-orange"
        />
        <label htmlFor="saveToSpotify" className="text-sm">
          Also save as a Spotify playlist
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !title || !recipientName}
        className="btn-retro w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'CREATING...' : 'CREATE MIXTAPE'}
      </button>
    </form>
  );
}
```

**Step 2: Create create page**

Create `src/app/create/page.tsx`:
```typescript
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { CreateMixtapeClient } from './client';

export default async function CreatePage() {
  const session = await getSession();

  if (!session) {
    redirect('/api/auth/spotify');
  }

  return <CreateMixtapeClient />;
}
```

**Step 3: Create client component for create page**

Create `src/app/create/client.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CassetteTape } from '@/components/CassetteTape';
import { TrackSearch } from '@/components/TrackSearch';
import { TrackList } from '@/components/TrackList';
import { MixtapeForm } from '@/components/MixtapeForm';
import toast from 'react-hot-toast';

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  duration: number;
  previewUrl: string | null;
  uri: string;
}

type Step = 'tracks' | 'personalize' | 'share';

export function CreateMixtapeClient() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('tracks');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [mixtapeTitle, setMixtapeTitle] = useState('');

  const addTrack = (track: Track) => {
    if (tracks.length >= 12) {
      toast.error('Maximum 12 tracks allowed');
      return;
    }
    if (tracks.some((t) => t.id === track.id)) {
      toast.error('Track already added');
      return;
    }
    setTracks([...tracks, track]);
    toast.success('Track added!');
  };

  const removeTrack = (trackId: string) => {
    setTracks(tracks.filter((t) => t.id !== trackId));
  };

  const reorderTracks = (newTracks: Track[]) => {
    setTracks(newTracks);
  };

  const handleFormSubmit = async (formData: {
    title: string;
    recipientName: string;
    message: string;
    saveToSpotify: boolean;
  }) => {
    setIsSubmitting(true);
    setMixtapeTitle(formData.title);

    try {
      const response = await fetch('/api/mixtapes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tracks: tracks.map((t, i) => ({
            spotifyTrackId: t.id,
            position: i,
            trackName: t.name,
            artistName: t.artist,
            albumArtUrl: t.albumArt,
            durationMs: t.duration,
            uri: t.uri,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create mixtape');
      }

      setShareToken(data.shareToken);
      setStep('share');
      toast.success('Mixtape created!');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Couldn't save your masterpiece. The tape deck is being stubborn."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const shareUrl = shareToken
    ? `${process.env.NEXT_PUBLIC_APP_URL}/m/${shareToken}`
    : '';

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`I made you a mixtape: ${mixtapeTitle}`);
    const body = encodeURIComponent(
      `Hey! I made a mixtape for you. Check it out:\n\n${shareUrl}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareViaSms = () => {
    const text = encodeURIComponent(
      `I made you a mixtape! ${shareUrl}`
    );
    window.open(`sms:?body=${text}`);
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(
      `I made you a mixtape! 🎵 ${shareUrl}`
    );
    window.open(`https://wa.me/?text=${text}`);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied!');
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-pixel text-2xl text-retro-black">
            {step === 'tracks' && 'ADD YOUR TRACKS'}
            {step === 'personalize' && 'PERSONALIZE'}
            {step === 'share' && 'SHARE YOUR MIXTAPE'}
          </h1>
        </div>

        {/* Progress */}
        <div className="flex justify-center gap-2 mb-8">
          {['tracks', 'personalize', 'share'].map((s, i) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full border-2 border-retro-black ${
                step === s
                  ? 'bg-retro-orange'
                  : i < ['tracks', 'personalize', 'share'].indexOf(step)
                  ? 'bg-retro-teal'
                  : 'bg-white'
              }`}
            />
          ))}
        </div>

        {step === 'tracks' && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Search */}
            <div className="card-retro">
              <h2 className="font-pixel text-sm mb-4">SEARCH</h2>
              <TrackSearch
                onAddTrack={addTrack}
                disabledTrackIds={tracks.map((t) => t.id)}
              />
            </div>

            {/* Right: Mixtape */}
            <div className="space-y-6">
              <div className="flex justify-center">
                <CassetteTape trackCount={tracks.length} />
              </div>
              <div className="card-retro">
                <h2 className="font-pixel text-sm mb-4">YOUR MIXTAPE</h2>
                <TrackList
                  tracks={tracks}
                  onRemoveTrack={removeTrack}
                  onReorderTracks={reorderTracks}
                />
              </div>
              {tracks.length >= 1 && (
                <button
                  onClick={() => setStep('personalize')}
                  className="btn-retro w-full"
                >
                  NEXT: PERSONALIZE
                </button>
              )}
            </div>
          </div>
        )}

        {step === 'personalize' && (
          <div className="max-w-md mx-auto">
            <div className="card-retro">
              <MixtapeForm
                onSubmit={handleFormSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
            <button
              onClick={() => setStep('tracks')}
              className="mt-4 text-retro-brown hover:text-retro-orange text-sm"
            >
              ← Back to tracks
            </button>
          </div>
        )}

        {step === 'share' && (
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="flex justify-center">
              <CassetteTape trackCount={tracks.length} title={mixtapeTitle} />
            </div>

            <p className="font-pixel text-xs text-retro-teal">
              YOUR MIXTAPE IS READY!
            </p>

            <div className="card-retro space-y-4">
              <p className="text-sm break-all">{shareUrl}</p>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={shareViaEmail} className="btn-retro text-[10px]">
                  EMAIL
                </button>
                <button onClick={shareViaSms} className="btn-retro text-[10px]">
                  SMS
                </button>
                <button onClick={shareViaWhatsApp} className="btn-retro text-[10px]">
                  WHATSAPP
                </button>
                <button onClick={copyLink} className="btn-retro text-[10px]">
                  COPY LINK
                </button>
              </div>
            </div>

            <button
              onClick={() => router.push('/create')}
              className="text-retro-brown hover:text-retro-orange text-sm"
            >
              Make another mixtape
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
```

**Step 4: Commit**

```bash
git add src/app/create/ src/components/MixtapeForm.tsx
git commit -m "feat: add mixtape creation page with multi-step flow"
```

---

### Task 15: Create Mixtape API Route

**Files:**
- Create: `src/app/api/mixtapes/route.ts`

**Step 1: Create mixtape creation endpoint**

Create `src/app/api/mixtapes/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { getSession } from '@/lib/auth/session';
import { createClient } from '@supabase/supabase-js';
import { createPlaylist, getSpotifyUser } from '@/lib/spotify/api';

interface TrackInput {
  spotifyTrackId: string;
  position: number;
  trackName: string;
  artistName: string;
  albumArtUrl: string;
  durationMs: number;
  uri: string;
}

interface CreateMixtapeBody {
  title: string;
  recipientName: string;
  message?: string;
  saveToSpotify?: boolean;
  tracks: TrackInput[];
}

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body: CreateMixtapeBody = await request.json();

  // Validation
  if (!body.title || body.title.length > 50) {
    return NextResponse.json({ error: 'Invalid title' }, { status: 400 });
  }
  if (!body.recipientName || body.recipientName.length > 50) {
    return NextResponse.json({ error: 'Invalid recipient name' }, { status: 400 });
  }
  if (body.message && body.message.length > 200) {
    return NextResponse.json({ error: 'Message too long' }, { status: 400 });
  }
  if (!body.tracks || body.tracks.length < 1 || body.tracks.length > 12) {
    return NextResponse.json({ error: 'Invalid track count (1-12)' }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const shareToken = nanoid(12);

  try {
    // Create mixtape
    const { data: mixtape, error: mixtapeError } = await supabase
      .from('mixtapes')
      .insert({
        user_id: session.userId,
        share_token: shareToken,
        title: body.title,
        recipient_name: body.recipientName,
        message: body.message || null,
      })
      .select()
      .single();

    if (mixtapeError) {
      console.error('Mixtape error:', mixtapeError);
      throw new Error('Failed to create mixtape');
    }

    // Insert tracks
    const tracksToInsert = body.tracks.map((track) => ({
      mixtape_id: mixtape.id,
      spotify_track_id: track.spotifyTrackId,
      position: track.position,
      track_name: track.trackName,
      artist_name: track.artistName,
      album_art_url: track.albumArtUrl,
      duration_ms: track.durationMs,
    }));

    const { error: tracksError } = await supabase
      .from('tracks')
      .insert(tracksToInsert);

    if (tracksError) {
      console.error('Tracks error:', tracksError);
      throw new Error('Failed to save tracks');
    }

    // Track event
    await supabase.from('events').insert({
      mixtape_id: mixtape.id,
      user_id: session.userId,
      event_type: 'mixtape_created',
      metadata: { track_count: body.tracks.length },
    });

    // Optionally save to Spotify
    if (body.saveToSpotify) {
      try {
        const spotifyUser = await getSpotifyUser(session.accessToken);
        const trackUris = body.tracks.map((t) => t.uri);
        await createPlaylist(
          session.accessToken,
          spotifyUser.id,
          body.title,
          trackUris
        );
      } catch (spotifyError) {
        console.error('Spotify playlist error:', spotifyError);
        // Don't fail the whole request if Spotify playlist fails
      }
    }

    return NextResponse.json({
      id: mixtape.id,
      shareToken,
    });
  } catch (error) {
    console.error('Create mixtape error:', error);
    return NextResponse.json(
      { error: "Couldn't save your masterpiece. The tape deck is being stubborn." },
      { status: 500 }
    );
  }
}
```

**Step 2: Commit**

```bash
git add src/app/api/mixtapes/
git commit -m "feat: add mixtape creation API with Spotify playlist option"
```

---

## Phase 6: Recipient Experience

### Task 16: Create Mixtape Viewing Page

**Files:**
- Create: `src/app/m/[token]/page.tsx`
- Create: `src/components/DancingAvatar.tsx`

**Step 1: Create dancing avatar component**

Create `src/components/DancingAvatar.tsx`:
```typescript
interface DancingAvatarProps {
  photoUrl?: string | null;
  senderName?: string;
  isPlaying?: boolean;
}

export function DancingAvatar({ photoUrl, senderName, isPlaying = false }: DancingAvatarProps) {
  return (
    <div className={`relative ${isPlaying ? 'animate-wiggle' : ''}`}>
      {/* Polaroid frame */}
      <div className="bg-white p-2 pb-8 shadow-[4px_4px_0_0_#1A1A2E] border-2 border-retro-black">
        {/* Photo or placeholder */}
        <div className="w-24 h-24 bg-retro-cream border-2 border-retro-black overflow-hidden">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={senderName || 'Sender'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-pixel text-2xl">🎵</span>
            </div>
          )}
        </div>

        {/* Name label */}
        {senderName && (
          <p className="absolute bottom-2 left-0 right-0 text-center font-pixel text-[8px] text-retro-black">
            FROM: {senderName.toUpperCase()}
          </p>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Create mixtape viewing page**

Create `src/app/m/[token]/page.tsx`:
```typescript
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { MixtapeViewer } from './client';

interface PageProps {
  params: Promise<{ token: string }>;
}

async function getMixtape(token: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: mixtape, error } = await supabase
    .from('mixtapes')
    .select(`
      *,
      users (display_name),
      tracks (*)
    `)
    .eq('share_token', token)
    .single();

  if (error || !mixtape) {
    return null;
  }

  // Track view event
  await supabase.from('events').insert({
    mixtape_id: mixtape.id,
    event_type: 'mixtape_viewed',
    metadata: {},
  });

  return mixtape;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params;
  const mixtape = await getMixtape(token);

  if (!mixtape) {
    return {
      title: 'Mixtape Not Found',
    };
  }

  const senderName = mixtape.users?.display_name || 'Someone';

  return {
    title: `${mixtape.title} - A Mixtape from ${senderName}`,
    description: mixtape.message || `${senderName} made you a mixtape with ${mixtape.tracks.length} tracks.`,
    openGraph: {
      title: `${senderName} made you a mixtape!`,
      description: mixtape.title,
      type: 'music.playlist',
    },
  };
}

export default async function MixtapePage({ params }: PageProps) {
  const { token } = await params;
  const mixtape = await getMixtape(token);

  if (!mixtape) {
    notFound();
  }

  const senderName = mixtape.users?.display_name || 'Someone';
  const tracks = mixtape.tracks.sort((a: { position: number }, b: { position: number }) => a.position - b.position);

  return (
    <MixtapeViewer
      mixtape={{
        id: mixtape.id,
        title: mixtape.title,
        recipientName: mixtape.recipient_name,
        message: mixtape.message,
        photoUrl: mixtape.photo_url,
        senderName,
        tracks: tracks.map((t: {
          id: string;
          spotify_track_id: string;
          track_name: string;
          artist_name: string;
          album_art_url: string;
          duration_ms: number;
        }) => ({
          id: t.id,
          spotifyId: t.spotify_track_id,
          name: t.track_name,
          artist: t.artist_name,
          albumArt: t.album_art_url,
          duration: t.duration_ms,
        })),
      }}
    />
  );
}
```

**Step 3: Create client component for mixtape viewer**

Create `src/app/m/[token]/client.tsx`:
```typescript
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CassetteTape } from '@/components/CassetteTape';
import { DancingAvatar } from '@/components/DancingAvatar';

interface Track {
  id: string;
  spotifyId: string;
  name: string;
  artist: string;
  albumArt: string;
  duration: number;
}

interface MixtapeData {
  id: string;
  title: string;
  recipientName: string;
  message: string | null;
  photoUrl: string | null;
  senderName: string;
  tracks: Track[];
}

interface MixtapeViewerProps {
  mixtape: MixtapeData;
}

export function MixtapeViewer({ mixtape }: MixtapeViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const totalDuration = mixtape.tracks.reduce((acc, t) => acc + t.duration, 0);

  // Create Spotify embed URL for the playlist
  const spotifyTrackIds = mixtape.tracks.map((t) => t.spotifyId).join(',');
  const spotifyEmbedUrl = `https://open.spotify.com/embed/track/${mixtape.tracks[0]?.spotifyId}?utm_source=generator&theme=0`;

  return (
    <main className="min-h-screen p-8 bg-retro-cream">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <p className="font-pixel text-xs text-retro-brown mb-2">
            A MIXTAPE FOR {mixtape.recipientName.toUpperCase()}
          </p>
          <h1 className="font-pixel text-2xl md:text-3xl text-retro-black leading-relaxed">
            {mixtape.title.toUpperCase()}
          </h1>
        </div>

        {/* Sender section */}
        <div className="flex flex-col items-center gap-4">
          <DancingAvatar
            photoUrl={mixtape.photoUrl}
            senderName={mixtape.senderName}
            isPlaying={isPlaying}
          />

          {mixtape.message && (
            <div className="card-retro max-w-sm">
              <p className="text-center italic">"{mixtape.message}"</p>
            </div>
          )}
        </div>

        {/* Cassette visual */}
        <div className="flex justify-center">
          <CassetteTape
            trackCount={mixtape.tracks.length}
            title={mixtape.title}
          />
        </div>

        {/* Track list */}
        <div className="card-retro">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-pixel text-sm">TRACKLIST</h2>
            <span className="font-pixel text-[10px] text-retro-brown">
              {formatDuration(totalDuration)} TOTAL
            </span>
          </div>

          <div className="space-y-2">
            {mixtape.tracks.map((track, index) => (
              <div
                key={track.id}
                className="flex items-center gap-3 p-2 hover:bg-retro-cream rounded"
              >
                <span className="font-pixel text-xs text-retro-brown w-6">
                  {(index + 1).toString().padStart(2, '0')}
                </span>
                {track.albumArt && (
                  <img
                    src={track.albumArt}
                    alt={track.name}
                    className="w-10 h-10 border-2 border-retro-black"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{track.name}</p>
                  <p className="text-xs text-retro-brown truncate">{track.artist}</p>
                </div>
                <span className="font-pixel text-[10px] text-retro-brown">
                  {formatDuration(track.duration)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Spotify embed */}
        <div className="card-retro">
          <h2 className="font-pixel text-sm mb-4">PLAY</h2>
          <iframe
            src={spotifyEmbedUrl}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            onLoad={() => setIsPlaying(false)}
            className="rounded"
          />
          <p className="text-xs text-retro-brown mt-2 text-center">
            Spotify Premium plays full tracks. Free accounts get 30-second previews.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center pt-8 border-t-2 border-retro-brown">
          <p className="font-pixel text-xs text-retro-brown mb-4">
            FEELING INSPIRED?
          </p>
          <Link href="/" className="btn-retro inline-block">
            MAKE A MIXTAPE
          </Link>
        </div>
      </div>
    </main>
  );
}
```

**Step 4: Create 404 page for mixtapes**

Create `src/app/m/[token]/not-found.tsx`:
```typescript
import Link from 'next/link';

export default function MixtapeNotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-retro-cream">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="font-pixel text-2xl text-retro-red">
          GAME OVER
        </h1>
        <h2 className="font-pixel text-lg text-retro-black">
          MIXTAPE NOT FOUND
        </h2>

        {/* Tangled tape visual */}
        <div className="py-8">
          <div className="text-6xl">📼</div>
          <p className="font-pixel text-xs text-retro-brown mt-2">
            ~ your tape got eaten ~
          </p>
        </div>

        <p className="text-retro-navy">
          This mixtape has vanished into the void. Maybe the link got garbled,
          or it never existed in the first place.
        </p>

        <div className="pt-4">
          <Link href="/" className="btn-retro inline-block">
            MAKE YOUR OWN MIXTAPE
          </Link>
        </div>
      </div>
    </main>
  );
}
```

**Step 5: Commit**

```bash
git add src/app/m/ src/components/DancingAvatar.tsx
git commit -m "feat: add mixtape viewing page with SSR and retro 404"
```

---

## Phase 7: Photo Upload

### Task 17: Create Photo Upload API and Component

**Files:**
- Create: `src/app/api/upload/route.ts`
- Create: `src/components/PhotoUpload.tsx`

**Step 1: Create upload API route**

Create `src/app/api/upload/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { getSession } from '@/lib/auth/session';
import { createClient } from '@supabase/supabase-js';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: 'File too large. Maximum size is 5MB.' },
      { status: 400 }
    );
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'Invalid file type. Use JPG, PNG, or WebP.' },
      { status: 400 }
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const fileExt = file.name.split('.').pop();
  const fileName = `${nanoid()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from('mixtape-photos')
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    return NextResponse.json(
      { error: 'Your photo got lost in the mail. Try again?' },
      { status: 500 }
    );
  }

  const { data: urlData } = supabase.storage
    .from('mixtape-photos')
    .getPublicUrl(filePath);

  return NextResponse.json({ url: urlData.publicUrl });
}
```

**Step 2: Create photo upload component**

Create `src/components/PhotoUpload.tsx`:
```typescript
'use client';

import { useState, useRef } from 'react';
import toast from 'react-hot-toast';

interface PhotoUploadProps {
  onUploadComplete: (url: string) => void;
  currentPhotoUrl?: string | null;
}

export function PhotoUpload({ onUploadComplete, currentPhotoUrl }: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 5MB.');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Invalid file type. Use JPG, PNG, or WebP.');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      onUploadComplete(data.url);
      toast.success('Photo uploaded!');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Your photo got lost in the mail. Try again?'
      );
      setPreviewUrl(currentPhotoUrl || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onUploadComplete('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <label className="block font-pixel text-xs text-retro-brown">
        YOUR PHOTO (OPTIONAL)
      </label>

      {previewUrl ? (
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-retro-black">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="text-retro-red hover:text-retro-brown text-sm"
          >
            Remove
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-4 border-dashed border-retro-brown p-8 text-center cursor-pointer hover:border-retro-orange transition-colors"
        >
          {isUploading ? (
            <p className="font-pixel text-xs text-retro-brown">UPLOADING...</p>
          ) : (
            <>
              <p className="text-retro-navy mb-2">Drop a photo or click to upload</p>
              <p className="text-xs text-retro-brown">JPG, PNG, or WebP • Max 5MB</p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
```

**Step 3: Update MixtapeForm to include photo upload**

Modify `src/components/MixtapeForm.tsx` to add PhotoUpload component (add import and state for photoUrl, pass to parent).

**Step 4: Create Supabase storage bucket**

In Supabase Dashboard → Storage → Create bucket named `mixtape-photos` with public access.

**Step 5: Commit**

```bash
git add src/app/api/upload/ src/components/PhotoUpload.tsx
git commit -m "feat: add photo upload with preview and validation"
```

---

## Phase 8: Analytics & Admin

### Task 18: Create Events Tracking API

**Files:**
- Create: `src/app/api/events/route.ts`
- Create: `src/lib/analytics/track.ts`

**Step 1: Create tracking utility**

Create `src/lib/analytics/track.ts`:
```typescript
import { EventType } from '@/lib/supabase/types';

export async function trackEvent(
  eventType: EventType,
  metadata: Record<string, unknown> = {},
  mixtapeId?: string
) {
  try {
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType,
        metadata,
        mixtapeId,
      }),
    });
  } catch (error) {
    console.error('Failed to track event:', error);
  }
}
```

**Step 2: Create events API route**

Create `src/app/api/events/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { eventType, metadata = {}, mixtapeId } = body;

  if (!eventType) {
    return NextResponse.json({ error: 'Event type required' }, { status: 400 });
  }

  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')?.value;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase.from('events').insert({
    event_type: eventType,
    metadata,
    mixtape_id: mixtapeId || null,
    user_id: userId || null,
  });

  if (error) {
    console.error('Event tracking error:', error);
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
```

**Step 3: Commit**

```bash
git add src/app/api/events/ src/lib/analytics/
git commit -m "feat: add event tracking API and client utility"
```

---

### Task 19: Create Admin Dashboard

**Files:**
- Create: `src/app/admin/page.tsx`
- Create: `src/app/api/admin/analytics/route.ts`
- Create: `src/middleware.ts`

**Step 1: Create admin middleware for password protection**

Create `src/middleware.ts`:
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin"',
        },
      });
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if (username !== 'admin' || password !== process.env.ADMIN_PASSWORD) {
      return new NextResponse('Invalid credentials', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin"',
        },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
```

**Step 2: Create analytics API route**

Create `src/app/api/admin/analytics/route.ts`:
```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Get counts
  const [
    { count: mixtapeCount },
    { count: userCount },
    { data: newsletterData },
    { data: viewEvents },
    { data: ctaEvents },
    { data: recentErrors },
    { data: avgTracksData },
  ] = await Promise.all([
    supabase.from('mixtapes').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('id').eq('newsletter_opt_in', true),
    supabase.from('events').select('mixtape_id').eq('event_type', 'mixtape_viewed'),
    supabase.from('events').select('mixtape_id').eq('event_type', 'cta_clicked'),
    supabase
      .from('events')
      .select('*')
      .eq('event_type', 'error_occurred')
      .order('created_at', { ascending: false })
      .limit(10),
    supabase.from('tracks').select('mixtape_id'),
  ]);

  // Calculate viral coefficient
  const uniqueViewedMixtapes = new Set(viewEvents?.map((e) => e.mixtape_id)).size;
  const mixtapesFromCta = ctaEvents?.length || 0;
  const viralCoefficient = uniqueViewedMixtapes > 0
    ? (mixtapesFromCta / uniqueViewedMixtapes).toFixed(2)
    : '0.00';

  // Calculate average tracks per mixtape
  const tracksByMixtape = avgTracksData?.reduce((acc, t) => {
    acc[t.mixtape_id] = (acc[t.mixtape_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const avgTracks = tracksByMixtape
    ? (Object.values(tracksByMixtape).reduce((a, b) => a + b, 0) / Object.keys(tracksByMixtape).length).toFixed(1)
    : '0';

  return NextResponse.json({
    metrics: {
      mixtapesCreated: mixtapeCount || 0,
      emailsCaptured: newsletterData?.length || 0,
      viralCoefficient: parseFloat(viralCoefficient),
      avgTracksPerMixtape: parseFloat(avgTracks),
      totalUsers: userCount || 0,
    },
    targets: {
      mixtapesCreated: { target: 500, stretch: 2000 },
      emailsCaptured: { target: 200, stretch: 1000 },
      viralCoefficient: { target: 0.3, stretch: 0.5 },
      avgTracksPerMixtape: { target: 7, stretch: 9 },
    },
    recentErrors: recentErrors || [],
  });
}
```

**Step 3: Create admin dashboard page**

Create `src/app/admin/page.tsx`:
```typescript
import { AdminDashboard } from './client';

export default function AdminPage() {
  return <AdminDashboard />;
}
```

Create `src/app/admin/client.tsx`:
```typescript
'use client';

import { useState, useEffect } from 'react';

interface Metrics {
  mixtapesCreated: number;
  emailsCaptured: number;
  viralCoefficient: number;
  avgTracksPerMixtape: number;
  totalUsers: number;
}

interface Targets {
  [key: string]: { target: number; stretch: number };
}

interface ErrorEvent {
  id: string;
  metadata: { type: string; context: string };
  created_at: string;
}

export function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [targets, setTargets] = useState<Targets | null>(null);
  const [errors, setErrors] = useState<ErrorEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((res) => res.json())
      .then((data) => {
        setMetrics(data.metrics);
        setTargets(data.targets);
        setErrors(data.recentErrors);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen p-8 bg-retro-black text-retro-cream">
        <p className="font-pixel text-center">LOADING...</p>
      </main>
    );
  }

  const MetricCard = ({
    label,
    value,
    target,
    stretch,
  }: {
    label: string;
    value: number;
    target: number;
    stretch: number;
  }) => {
    const percentage = Math.min((value / target) * 100, 100);
    const stretchPercentage = Math.min((value / stretch) * 100, 100);

    return (
      <div className="bg-retro-navy p-4 border-2 border-retro-teal">
        <p className="font-pixel text-xs text-retro-cream mb-2">{label}</p>
        <p className="font-pixel text-2xl text-retro-orange">{value}</p>
        <div className="mt-2 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs w-16">Target:</span>
            <div className="flex-1 h-2 bg-retro-black rounded overflow-hidden">
              <div
                className="h-full bg-retro-teal"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-xs">{target}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs w-16">Stretch:</span>
            <div className="flex-1 h-2 bg-retro-black rounded overflow-hidden">
              <div
                className="h-full bg-retro-orange"
                style={{ width: `${stretchPercentage}%` }}
              />
            </div>
            <span className="text-xs">{stretch}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen p-8 bg-retro-black text-retro-cream">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="font-pixel text-2xl text-center">MIXTAPE ADMIN</h1>

        {metrics && targets && (
          <div className="grid md:grid-cols-2 gap-4">
            <MetricCard
              label="MIXTAPES CREATED"
              value={metrics.mixtapesCreated}
              target={targets.mixtapesCreated.target}
              stretch={targets.mixtapesCreated.stretch}
            />
            <MetricCard
              label="EMAILS CAPTURED"
              value={metrics.emailsCaptured}
              target={targets.emailsCaptured.target}
              stretch={targets.emailsCaptured.stretch}
            />
            <MetricCard
              label="VIRAL COEFFICIENT"
              value={metrics.viralCoefficient}
              target={targets.viralCoefficient.target}
              stretch={targets.viralCoefficient.stretch}
            />
            <MetricCard
              label="AVG TRACKS/MIXTAPE"
              value={metrics.avgTracksPerMixtape}
              target={targets.avgTracksPerMixtape.target}
              stretch={targets.avgTracksPerMixtape.stretch}
            />
          </div>
        )}

        {/* Extra stats */}
        <div className="bg-retro-navy p-4 border-2 border-retro-teal">
          <p className="font-pixel text-xs mb-2">TOTAL USERS</p>
          <p className="font-pixel text-xl text-retro-orange">
            {metrics?.totalUsers || 0}
          </p>
        </div>

        {/* Recent errors */}
        <div className="bg-retro-navy p-4 border-2 border-retro-red">
          <p className="font-pixel text-xs text-retro-red mb-4">RECENT ERRORS</p>
          {errors.length === 0 ? (
            <p className="text-sm text-retro-cream">No recent errors</p>
          ) : (
            <div className="space-y-2">
              {errors.map((error) => (
                <div key={error.id} className="text-sm border-b border-retro-black pb-2">
                  <span className="text-retro-red">{error.metadata.type}</span>
                  <span className="text-retro-cream ml-2">{error.metadata.context}</span>
                  <span className="text-retro-brown ml-2 text-xs">
                    {new Date(error.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
```

**Step 4: Commit**

```bash
git add src/app/admin/ src/app/api/admin/ src/middleware.ts
git commit -m "feat: add admin dashboard with metrics and error log"
```

---

## Phase 9: Error Pages & Polish

### Task 20: Create Why No Music Explainer Page

**Files:**
- Create: `src/app/why-no-music/page.tsx`

**Step 1: Create explainer page**

Create `src/app/why-no-music/page.tsx`:
```typescript
import Link from 'next/link';

export default function WhyNoMusicPage() {
  return (
    <main className="min-h-screen p-8 bg-retro-cream">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="font-pixel text-2xl text-retro-black">
            WHY CAN'T I HEAR THESE TRACKS?
          </h1>
        </div>

        <p className="text-center text-retro-navy">
          Music licensing is complicated. Here's what might have happened:
        </p>

        <div className="space-y-4">
          {/* Reason 1 */}
          <div className="card-retro flex gap-4 items-start">
            <span className="text-3xl">🌍</span>
            <div>
              <h2 className="font-pixel text-sm text-retro-black mb-2">
                REGIONAL LICENSING
              </h2>
              <p className="text-retro-navy">
                This track isn't available in your country. Music rights are
                negotiated country-by-country, so what's available in one place
                might be blocked in another. Thanks, regional licensing.
              </p>
            </div>
          </div>

          {/* Reason 2 */}
          <div className="card-retro flex gap-4 items-start">
            <span className="text-3xl">😢</span>
            <div>
              <h2 className="font-pixel text-sm text-retro-black mb-2">
                TRACK REMOVED
              </h2>
              <p className="text-retro-navy">
                The artist or their label removed this track from Spotify.
                It happens sometimes when contracts change or albums get
                remastered. The music world is complicated.
              </p>
            </div>
          </div>

          {/* Reason 3 */}
          <div className="card-retro flex gap-4 items-start">
            <span className="text-3xl">⏳</span>
            <div>
              <h2 className="font-pixel text-sm text-retro-black mb-2">
                TEMPORARY GLITCH
              </h2>
              <p className="text-retro-navy">
                Spotify might be having a moment. Try refreshing the page or
                coming back later. These things usually sort themselves out.
              </p>
            </div>
          </div>

          {/* Reason 4 */}
          <div className="card-retro flex gap-4 items-start">
            <span className="text-3xl">🎧</span>
            <div>
              <h2 className="font-pixel text-sm text-retro-black mb-2">
                SPOTIFY FREE VS PREMIUM
              </h2>
              <p className="text-retro-navy">
                If you're using Spotify Free, you'll hear 30-second previews
                instead of full tracks. To hear the full mixtape, log into
                Spotify Premium in your browser.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center pt-8">
          <p className="font-pixel text-xs text-retro-brown mb-4">
            DON'T LET THIS STOP YOU
          </p>
          <Link href="/" className="btn-retro inline-block">
            MAKE YOUR OWN MIXTAPE
          </Link>
        </div>
      </div>
    </main>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/why-no-music/
git commit -m "feat: add why-no-music explainer page with retro styling"
```

---

### Task 21: Add Newsletter Opt-in to Creation Flow

**Files:**
- Modify: `src/app/api/auth/callback/route.ts`
- Create: `src/components/NewsletterOptIn.tsx`

**Step 1: Create newsletter opt-in component**

Create `src/components/NewsletterOptIn.tsx`:
```typescript
'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface NewsletterOptInProps {
  onComplete: () => void;
}

export function NewsletterOptIn({ onComplete }: NewsletterOptInProps) {
  const [optIn, setOptIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optIn }),
      });

      if (optIn) {
        toast.success('Thanks for subscribing!');
      }
    } catch {
      // Don't block the flow if this fails
    }
    setIsSubmitting(false);
    onComplete();
  };

  return (
    <div className="card-retro max-w-md mx-auto text-center space-y-4">
      <h2 className="font-pixel text-sm">ONE MORE THING</h2>

      <p className="text-retro-navy">
        Want occasional updates about Mixtape and other projects?
      </p>

      <label className="flex items-center justify-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={optIn}
          onChange={(e) => setOptIn(e.target.checked)}
          className="w-5 h-5 accent-retro-orange"
        />
        <span className="text-sm">
          Yes, send me updates (no spam, promise)
        </span>
      </label>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="btn-retro"
      >
        {isSubmitting ? 'SAVING...' : 'CONTINUE'}
      </button>

      <button
        onClick={onComplete}
        className="block mx-auto text-xs text-retro-brown hover:text-retro-orange"
      >
        Skip
      </button>
    </div>
  );
}
```

**Step 2: Create newsletter API route**

Create `src/app/api/newsletter/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')?.value;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { optIn } = await request.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  await supabase
    .from('users')
    .update({ newsletter_opt_in: optIn })
    .eq('id', userId);

  if (optIn) {
    await supabase.from('events').insert({
      user_id: userId,
      event_type: 'newsletter_signup',
      metadata: {},
    });
  }

  return NextResponse.json({ success: true });
}
```

**Step 3: Commit**

```bash
git add src/components/NewsletterOptIn.tsx src/app/api/newsletter/
git commit -m "feat: add newsletter opt-in with GDPR-friendly default"
```

---

## Phase 10: Testing

### Task 22: Set Up E2E Tests

**Files:**
- Create: `playwright.config.ts`
- Create: `e2e/home.spec.ts`
- Create: `e2e/mixtape-view.spec.ts`

**Step 1: Create Playwright config**

Create `playwright.config.ts`:
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Step 2: Create home page test**

Create `e2e/home.spec.ts`:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display the landing page', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toContainText('MIXTAPE');
    await expect(page.locator('text=Make a mixtape for someone you care about')).toBeVisible();
  });

  test('should have a working CTA button', async ({ page }) => {
    await page.goto('/');

    const ctaButton = page.locator('text=MAKE A MIXTAPE');
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toHaveAttribute('href', '/api/auth/spotify');
  });

  test('should display cassette tape visual', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.cassette')).toBeVisible();
  });
});
```

**Step 3: Create mixtape 404 test**

Create `e2e/mixtape-view.spec.ts`:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Mixtape Viewing', () => {
  test('should show 404 for invalid mixtape token', async ({ page }) => {
    await page.goto('/m/invalid-token-12345');

    await expect(page.locator('text=GAME OVER')).toBeVisible();
    await expect(page.locator('text=MIXTAPE NOT FOUND')).toBeVisible();
    await expect(page.locator('text=your tape got eaten')).toBeVisible();
  });

  test('should have CTA to make own mixtape on 404', async ({ page }) => {
    await page.goto('/m/invalid-token-12345');

    const ctaButton = page.locator('text=MAKE YOUR OWN MIXTAPE');
    await expect(ctaButton).toBeVisible();
  });
});
```

**Step 4: Add test script to package.json**

Add to `package.json` scripts:
```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

**Step 5: Run tests**

```bash
npm run test:e2e
```

Expected: Tests pass for home page and 404 behavior.

**Step 6: Commit**

```bash
git add playwright.config.ts e2e/ package.json
git commit -m "test: add E2E tests for home page and mixtape 404"
```

---

## Phase 11: Final Polish

### Task 23: Add Legal Pages

**Files:**
- Create: `src/app/privacy/page.tsx`
- Create: `src/app/terms/page.tsx`
- Modify: `src/app/layout.tsx` (add footer)

**Step 1: Create privacy policy page**

Create `src/app/privacy/page.tsx`:
```typescript
export default function PrivacyPage() {
  return (
    <main className="min-h-screen p-8 bg-retro-cream">
      <div className="max-w-2xl mx-auto prose">
        <h1 className="font-pixel text-2xl text-retro-black">PRIVACY POLICY</h1>

        <h2>What we collect</h2>
        <ul>
          <li>Your Spotify display name and email (from Spotify OAuth)</li>
          <li>Photos you upload for your mixtape avatar</li>
          <li>Basic analytics (page views, mixtapes created)</li>
        </ul>

        <h2>How we use it</h2>
        <ul>
          <li>To create and display your mixtapes</li>
          <li>To send newsletter updates if you opt in</li>
          <li>To understand how people use Mixtape</li>
        </ul>

        <h2>Third-party services</h2>
        <ul>
          <li>Spotify API (for music search and playback)</li>
          <li>Supabase (database and file storage)</li>
          <li>Vercel (hosting)</li>
        </ul>

        <h2>Your rights</h2>
        <p>
          You can request to see, correct, or delete your data at any time.
          Email us at privacy@mixtape.fm.
        </p>

        <h2>Data retention</h2>
        <p>
          Mixtapes are stored indefinitely. You can request deletion at any time.
        </p>

        <p className="text-sm text-retro-brown">Last updated: January 2026</p>
      </div>
    </main>
  );
}
```

**Step 2: Create terms of service page**

Create `src/app/terms/page.tsx`:
```typescript
export default function TermsPage() {
  return (
    <main className="min-h-screen p-8 bg-retro-cream">
      <div className="max-w-2xl mx-auto prose">
        <h1 className="font-pixel text-2xl text-retro-black">TERMS OF SERVICE</h1>

        <h2>The basics</h2>
        <p>
          Mixtape is a free service for creating and sharing music compilations.
          By using it, you agree to these terms.
        </p>

        <h2>Your content</h2>
        <p>
          You own your mixtapes and photos. By uploading them, you give us
          permission to store and display them as part of the service.
        </p>

        <h2>Acceptable use</h2>
        <p>Don't use Mixtape to:</p>
        <ul>
          <li>Harass or abuse others</li>
          <li>Upload illegal content</li>
          <li>Spam or misuse the service</li>
        </ul>

        <h2>Spotify</h2>
        <p>
          Mixtape uses the Spotify API but is not affiliated with Spotify.
          Music playback is subject to Spotify's terms and your account status.
        </p>

        <h2>No warranty</h2>
        <p>
          Mixtape is provided "as is". We do our best but can't guarantee
          uptime or that every feature will work perfectly.
        </p>

        <h2>Changes</h2>
        <p>
          We may update these terms. Continued use means you accept the changes.
        </p>

        <p className="text-sm text-retro-brown">Last updated: January 2026</p>
      </div>
    </main>
  );
}
```

**Step 3: Add footer to layout**

Create `src/components/Footer.tsx`:
```typescript
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="py-8 px-4 border-t-2 border-retro-brown">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-retro-brown">
        <p>
          Made with 🎵 by{' '}
          <a href="https://theaicookbook.com" className="underline hover:text-retro-orange">
            The AI Cookbook
          </a>
        </p>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-retro-orange">Privacy</Link>
          <Link href="/terms" className="hover:text-retro-orange">Terms</Link>
        </div>
        <p className="text-xs">
          Not affiliated with Spotify
        </p>
      </div>
    </footer>
  );
}
```

Update `src/app/layout.tsx` to include the footer.

**Step 4: Commit**

```bash
git add src/app/privacy/ src/app/terms/ src/components/Footer.tsx src/app/layout.tsx
git commit -m "feat: add privacy policy, terms of service, and footer"
```

---

### Task 24: Final Review and Launch Prep

**Step 1: Run all tests**

```bash
npm run build
npm run test:e2e
```

**Step 2: Verify environment variables are set**

- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] SPOTIFY_CLIENT_ID
- [ ] SPOTIFY_CLIENT_SECRET
- [ ] NEXT_PUBLIC_SPOTIFY_REDIRECT_URI
- [ ] ADMIN_PASSWORD
- [ ] NEXT_PUBLIC_APP_URL

**Step 3: Create Supabase storage bucket**

- [ ] Create `mixtape-photos` bucket with public access

**Step 4: Set up Spotify App**

- [ ] Create app in Spotify Developer Dashboard
- [ ] Add redirect URI for production domain
- [ ] Request extended quota if needed

**Step 5: Deploy to Vercel**

```bash
vercel
```

**Step 6: Final commit**

```bash
git add .
git commit -m "chore: final review and launch prep"
```

---

## Summary

This implementation plan covers:

1. **Phase 1-2**: Project setup, database schema, Spotify OAuth
2. **Phase 3-4**: Retro design system, track search and management
3. **Phase 5**: Full mixtape creation flow with multi-step UI
4. **Phase 6**: Recipient viewing experience with SSR
5. **Phase 7**: Photo upload with validation
6. **Phase 8**: Analytics tracking and admin dashboard
7. **Phase 9**: Error pages with retro humor
8. **Phase 10**: E2E testing with Playwright
9. **Phase 11**: Legal pages and launch prep

Total: 24 tasks, approximately 150+ discrete steps following TDD principles.
