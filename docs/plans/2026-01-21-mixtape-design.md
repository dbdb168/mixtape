# Mixtape - Technical Design Document

| | |
|---|---|
| **Version** | 1.0 |
| **Date** | 21 January 2026 |
| **Status** | Approved |
| **PRD Reference** | Mixtape-PRD.md |

---

## Overview

Mixtape is a web application that revives the nostalgic experience of creating and sharing personalised music compilations. Users connect their Spotify account, curate 6-12 songs, add a title, personal message, and optional dancing avatar, then share via email, SMS, or WhatsApp.

**Visual Style:** Early Nintendo / 8-bit inspired aesthetic with pixel art, chunky typography, and warm retro colors.

---

## Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Mixtape persistence | Indefinite | Mixtapes are gifts - people want to revisit them years later |
| Spotify playlist saving | Optional, off by default | Keeps flow simple, power users can opt in |
| Reply feature | Schema-ready, build later | Low cost now, easier migration later |
| Photo cropping | Manual with circular guide | Simple, no third-party dependencies |
| Email sharing | Mailto links for MVP | Zero backend complexity, feels more personal |
| Analytics dashboard | Track everything, simple display | Capture data from day one, polish UI later |
| Mixtape naming | Required title field | "Summer 2024", "Songs That Remind Me of Us" |

---

## Data Model

### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spotify_id TEXT UNIQUE NOT NULL,
  email TEXT,
  display_name TEXT,
  newsletter_opt_in BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Mixtapes
```sql
CREATE TABLE mixtapes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  share_token TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL CHECK (char_length(title) <= 50),
  recipient_name TEXT NOT NULL CHECK (char_length(recipient_name) <= 50),
  message TEXT CHECK (char_length(message) <= 200),
  photo_url TEXT,
  reply_to_mixtape_id UUID REFERENCES mixtapes(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tracks
```sql
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
```

### Events (Analytics)
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mixtape_id UUID REFERENCES mixtapes(id),
  event_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_created ON events(created_at);
```

---

## Application Architecture

### Stack
- **Frontend:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **File Storage:** Supabase Storage
- **Hosting:** Vercel
- **Analytics:** PostHog (cookieless mode) or Plausible

### Route Structure
```
/                       → Landing page with "Make a Mixtape" CTA
/create                 → Mixtape creation flow (requires Spotify auth)
/m/[share_token]        → Public mixtape viewing page (SSR)
/why-no-music           → Explainer page for unavailable tracks
/admin                  → Simple metrics dashboard (password protected)

/api/auth/spotify       → Initiates Spotify OAuth
/api/auth/callback      → Handles OAuth callback
/api/search             → Proxies Spotify search
/api/mixtapes           → POST to create mixtape
/api/upload             → POST photo, returns URL
/api/events             → POST to track analytics events
```

### Key Architectural Decisions
1. **Single-page creation flow** - `/create` handles all steps within one page
2. **Server-side mixtape rendering** - SSR for Open Graph tags and link previews
3. **Client-side Spotify search** - Debounced, cached for responsiveness
4. **Supabase Row Level Security** - Users can only modify their own data

---

## Mixtape Creation Flow

### Step 1: Landing & Auth
- Hero with cassette tape visual and value proposition
- "Make a Mixtape" → Spotify OAuth
- Email captured from Spotify profile
- Newsletter checkbox (unchecked by default, GDPR compliant)

### Step 2: Add Tracks
- Left: Search bar + results list (album art, title, artist, duration)
- Right: Cassette tape visual that "fills up" as tracks are added
- 1-12 tracks allowed, drag-and-drop reordering
- 30-second preview on hover/click

### Step 3: Personalize
- Title (required, 50 chars max)
- Recipient name (required, 50 chars max)
- Message (optional, 200 chars max)
- Photo upload with circular crop tool
- Checkbox: "Save as Spotify playlist" (unchecked by default)
- Preview button

### Step 4: Share
- Confirmation with share buttons
- Email (mailto:), SMS (sms:), WhatsApp (wa.me), Copy Link
- "Make another mixtape" CTA

### State Management
- React useState/useReducer (no Redux needed)
- Draft persisted to localStorage to survive refresh

---

## Recipient Experience

### Page Structure (`/m/[share_token]`)
- SSR with Open Graph meta tags for link previews
- Title: "[Sender] made you a mixtape"

### Visual Layout
- Mixtape title in retro pixel typography
- Sender photo in animated polaroid frame (bouncing/swaying CSS animation)
- Personal message in speech bubble or handwritten style
- Track list with album art thumbnails
- Spotify embed player for playback

### Playback
- Spotify embed handles auth state automatically
- Premium users: full tracks
- Free/logged out: 30-second previews
- No custom "upgrade" messaging - Spotify handles this

### Viral Loop
- Bottom CTA: "Make a mixtape for someone you care about"
- Event tracked: `cta_clicked`

---

## Error Handling (Retro Humor)

All errors tracked via `error_occurred` event with metadata.

### 404 - Mixtape Not Found
> **"GAME OVER - Mixtape Not Found"**
> This mixtape has vanished into the void. Maybe the link got garbled, or it never existed in the first place.
> [Make Your Own Mixtape]

### Tracks Unavailable
> **"OH NO! Your tape got eaten"**
> *[Visual: cassette with tape unspooling]*
> Don't worry - [Sender]'s message is still here. The tape deck gremlins struck again.
> [Why can't I hear these tracks?]

### Single Track Unavailable (inline)
> "This track took a wrong turn" (greyed out row)

### "Why can't I hear these tracks?" Explainer (`/why-no-music`)
- "Music licensing is complicated. Here's what might have happened:"
  - "This track isn't available in your country (thanks, regional licensing)" [8-bit globe icon]
  - "The artist or label removed it from Spotify" [8-bit sad face icon]
  - "Spotify is having a moment - try again later" [8-bit loading icon]
- Friendly tone, retro pixel art icons
- CTA to make their own mixtape

### Other Errors
- Search fails: "The jukebox is jammed. Give it another spin?" [Retry]
- Upload fails: "Your photo got lost in the mail. Try again?" [Retry]
- Save fails: "Couldn't save your masterpiece. The tape deck is being stubborn." [Retry]

---

## Analytics

### Events Tracked

| Event | Trigger | Metadata |
|-------|---------|----------|
| `page_view` | Any page load | `{ page, referrer }` |
| `spotify_connected` | OAuth completes | `{ user_id }` |
| `track_added` | Track added | `{ spotify_track_id }` |
| `track_removed` | Track removed | `{ spotify_track_id }` |
| `mixtape_created` | Mixtape saved | `{ mixtape_id, track_count }` |
| `share_clicked` | Share button clicked | `{ mixtape_id, method }` |
| `mixtape_viewed` | Recipient opens mixtape | `{ mixtape_id, referrer }` |
| `track_played` | Play clicked | `{ mixtape_id, track_id }` |
| `cta_clicked` | "Make your own" clicked | `{ mixtape_id }` |
| `error_occurred` | Any error | `{ type, context, mixtape_id }` |
| `newsletter_signup` | Checkbox opted in | `{ user_id }` |

### Admin Dashboard (`/admin`)
- Password protected (env var)
- Key metrics with progress bars vs targets:
  - Mixtapes created (target: 500, stretch: 2000)
  - Emails captured (target: 200, stretch: 1000)
  - Viral coefficient (target: 0.3, stretch: 0.5)
  - Average tracks per mixtape (target: 6-8)
- Recent errors log

### Viral Coefficient
```
viral_coefficient = mixtapes_created_from_cta / total_mixtapes_viewed
```

---

## Security & Privacy

### Authentication
- Spotify access tokens in HTTP-only cookies
- Refresh tokens encrypted in database
- 7-day session expiry on inactivity

### Mixtape URLs
- 12-character URL-safe random tokens (e.g., `a8Kp2xNq9mLz`)
- Non-sequential, non-guessable
- No public listing

### Photo Storage
- Random UUID filenames in Supabase Storage
- No directory listing
- Accessible only via direct URL

### Data Privacy
- Minimal collection: Spotify ID, email, display name
- Newsletter opt-in explicit (unchecked default)
- No tracking cookies (Plausible/PostHog cookieless)
- Manual deletion requests via email for MVP

### Input Validation
- Title: max 50 chars, sanitized
- Recipient name: max 50 chars, sanitized
- Message: max 200 chars, sanitized
- All output escaped to prevent XSS

### Rate Limiting
- API routes: 60 requests/minute per IP
- Mixtape creation: 10 per hour per user

---

## Testing Strategy

### Unit Tests
- Data validation (title length, sanitization)
- Share token generation
- Viral coefficient calculation
- Analytics event formatting

### Integration Tests
- Spotify OAuth flow (mocked)
- Mixtape CRUD operations
- Photo upload pipeline
- Event tracking

### E2E Tests (Playwright)
- Full creation flow
- Recipient viewing flow
- Error states (404, unavailable tracks)
- Mobile viewport

### Browser Testing Matrix

| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome | Yes | Yes (Android) |
| Safari | Yes | Yes (iOS) |
| Firefox | Yes | No |
| Edge | Yes | No |

Focus areas: CSS animations, audio playback, Spotify embed behavior

### Manual Testing
- Spotify Free vs Premium playback
- Actual share links (Email, SMS, WhatsApp)
- Photo crop with various images
- Cross-browser styling

---

## Infrastructure & Cost Analysis

### Target Goals (3 months)
- 500 mixtapes created
- ~500 users
- ~2,500 mixtape views
- 200 newsletter signups

### Supabase Free Tier

| Resource | Limit | Estimated Usage | Status |
|----------|-------|-----------------|--------|
| Database | 500MB | ~5MB | OK |
| Storage | 1GB | ~250MB | OK |
| Auth | 50,000 MAU | ~500 | OK |
| Bandwidth | 2GB/month | ~2-3GB | **At Risk** |

### Vercel Free Tier

| Resource | Limit | Estimated Usage | Status |
|----------|-------|-----------------|--------|
| Bandwidth | 100GB/month | ~5GB | OK |
| Execution | 100GB-hrs | ~2GB-hrs | OK |

### Recommendation

**Start on free tiers. Monitor Supabase bandwidth.**

**Upgrade triggers:**
- Supabase Pro ($25/month): bandwidth > 2GB or need backups
- Vercel Pro ($20/month): unlikely needed at this scale

**Cost-saving measures:**
- Compress photos client-side (target 200KB)
- Edge caching for mixtape pages
- Lazy-load album art

**Budget:** $25/month contingency for Supabase Pro if growth exceeds expectations.

---

## Open Items (Post-MVP)

- V2 Dancing Avatar: Face-on-body compositing (D-ID or similar)
- Multi-platform: Songlink/Odesli for Apple Music, Deezer
- Mixtape templates: Birthday, Road Trip, Missing You themes
- Reply feature: Recipient can send a thank-you mixtape
- Sender analytics: See if/when mixtape was played

---

*Document generated from brainstorming session on 21 January 2026*
