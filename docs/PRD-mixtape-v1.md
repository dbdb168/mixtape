# Mixtape v1.0 - Product Requirements Document

## Overview

**Product Name:** Mixtape
**Version:** 1.0
**Live URL:** https://mixtape.thisisluminary.co
**Launch Date:** January 2026

### Vision
Bring back the emotional art of making mixtapes for the streaming era. Let anyone curate songs for someone they care about and share them with a personal message—no account required.

### Target Users
- Anyone who wants to share music meaningfully with friends, family, or romantic partners
- People who remember making physical mixtapes and want that nostalgic experience
- Users who find Spotify/Apple Music playlist sharing too impersonal

---

## Core Features

### 1. Mixtape Creation (Create Page)

**User Flow:**
1. User lands on boombox-style interface with three panels
2. Left panel: Search Apple Music catalog
3. Center panel: Cassette visualization with editable title
4. Right panel: Track list with drag-and-drop reordering
5. User clicks "Send Tape" when ready

**Requirements:**
- Search Apple Music catalog in real-time
- Add up to 10 tracks per mixtape
- Drag-and-drop track reordering
- Editable mixtape title on cassette label
- Visual feedback: cassette reels spin when adding tracks
- Track preview playback (30-second clips)

### 2. Personalization & Sharing (Personalize Step)

**User Flow:**
1. User enters their name (sender)
2. User enters recipient name
3. User writes optional liner notes message (200 char max)
4. User chooses sharing method:
   - **Email:** Enter recipient email, we send notification
   - **Link:** Copy/share via any messaging app

**Requirements:**
- Personalization is captured before mixtape is created
- Email sending via SendGrid with styled HTML template
- Native share sheet integration on mobile
- Fallback to clipboard copy on desktop

### 3. Mixtape Listening (Listen Page)

**User Flow:**
1. Recipient opens shared link
2. Sees "jewel case" visualization with cassette
3. Sees sender name, message, and track list
4. Clicks track to play

**Requirements:**
- Display sender name and personal message
- Show track list with album art
- Play full tracks for Apple Music subscribers
- Play 30-second previews for non-subscribers
- "Create your own mixtape" CTA for viral loop

### 4. Social Sharing Previews

**Requirements:**
- Dynamic OG images for each mixtape URL
- Shows "You received a mixtape!" with branded design
- Unique cache-busting URLs for iOS compatibility
- Twitter card support

### 5. Admin Dashboard

**Access:** Password-protected at /admin

**Metrics Displayed:**
- Total mixtapes created
- Viral coefficient (CTA clicks / unique views)
- Average tracks per mixtape
- Create funnel (last 24h): Page Loaded → Searched → Added Track → Clicked Send → Personalize → Share Attempted

**Data Displayed:**
- Recent mixtapes (title, sender, recipient, track count, has email)
- Recent tracks added
- Recent errors

**Features:**
- Auto-refresh every 30 seconds
- Last updated timestamp

---

## Technical Architecture

### Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Framework | Next.js 14 (App Router) | React with SSR/SSG |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS | Utility-first CSS |
| Database | Supabase (PostgreSQL) | Data persistence |
| Music API | Apple MusicKit JS | Song search & playback |
| Email | SendGrid | Transactional emails |
| Hosting | Vercel | Edge deployment |
| Analytics | Vercel Analytics + Custom | Usage tracking |

### Database Schema

```sql
-- Mixtapes
CREATE TABLE mixtapes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_token VARCHAR(12) UNIQUE NOT NULL,
  title VARCHAR(100),
  sender_name VARCHAR(100),
  recipient_name VARCHAR(100),
  recipient_email VARCHAR(255),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tracks
CREATE TABLE tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mixtape_id UUID REFERENCES mixtapes(id),
  spotify_track_id VARCHAR(50), -- stores Apple Music ID (legacy name)
  position INTEGER NOT NULL,
  track_name VARCHAR(255) NOT NULL,
  artist_name VARCHAR(255) NOT NULL,
  album_art_url TEXT,
  duration_ms INTEGER
);

-- Analytics Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mixtape_id UUID REFERENCES mixtapes(id),
  event_type VARCHAR(50) NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/search` | GET | Search Apple Music catalog |
| `/api/mixtapes` | POST | Create new mixtape |
| `/api/mixtapes/send-email` | POST | Send email notification |
| `/api/events` | POST | Track analytics events |
| `/api/admin/analytics` | GET | Admin dashboard data |

### Event Types Tracked

**Funnel Events (Create Flow):**
- `create_page_loaded` - User lands on /create
- `search_started` - User first searches for music
- `track_added` - User adds track (flags first track)
- `send_tape_clicked` - User clicks Send Tape button
- `personalize_page_loaded` - User sees personalize form
- `share_attempted` - User clicks share (email or link)
- `search_error` - Search API fails

**Engagement Events:**
- `mixtape_viewed` - Recipient opens mixtape
- `track_played` - Recipient plays a track
- `cta_clicked` - Recipient clicks "Create your own"
- `error_occurred` - Any error

---

## Environment Variables Required

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Apple Music
APPLE_TEAM_ID=
APPLE_KEY_ID=
APPLE_PRIVATE_KEY=

# SendGrid
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=

# App
NEXT_PUBLIC_APP_URL=https://mixtape.thisisluminary.co
ADMIN_PASSWORD=

# Vercel (auto-set)
VERCEL_URL=
```

---

## Security Measures

1. **Authentication:** Admin routes protected by middleware password check
2. **Input Validation:** All user input sanitized, email format validated
3. **Event Allowlist:** Only predefined event types accepted
4. **Share Tokens:** 12-character random tokens (not guessable)
5. **No User Accounts:** Minimizes data exposure risk
6. **Email Privacy:** Recipient emails used only for sending, stored but not displayed

---

## Performance Optimizations

1. **Font Optimization:** Google Fonts with display: swap, preload, reduced weights
2. **Image Optimization:** Next.js Image with AVIF/WebP, remote patterns for Apple CDN
3. **Caching:** Static assets cached for 1 year, OG images have unique URLs
4. **Analytics:** Vercel Analytics + Speed Insights
5. **Edge Runtime:** OG image generation on edge for fast response

---

## Success Metrics

| Metric | Target | Stretch |
|--------|--------|---------|
| Mixtapes Created | 500 | 2,000 |
| Viral Coefficient | 0.30 | 0.50 |
| Avg Tracks/Mixtape | 7 | 9 |

---

## Known Limitations

1. **Apple Music Only:** No Spotify integration yet
2. **No Replies:** Can't reply with a mixtape (future feature)
3. **No Collaboration:** Single creator per mixtape
4. **No Mobile App:** Web-only experience
5. **Preview Limits:** Non-Apple Music users limited to 30-second previews

---

## Future Roadmap

- Spotify integration
- Reply mixtapes (respond with your own)
- Collaborative mixtapes
- Mobile app (PWA)
- Custom artwork upload
