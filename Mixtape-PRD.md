# MIXTAPE
## Product Requirements Document

| | |
|---|---|
| **Version** | 1.0 |
| **Date** | January 2025 |
| **Author** | David Beath |
| **Status** | Draft |

---

## Executive Summary

Mixtape is a web application that revives the nostalgic experience of creating and sharing personalised music compilations. In the 1980s and 90s, giving someone a mixtape was an intimate gesture of affection, friendship, or connection. Today, that experience has been fragmented across streaming services and playlist features that lack the personal touch.

Mixtape simplifies this: connect your Spotify account, curate 6-10 songs, add a personal message and optional dancing avatar, then share via email, SMS, or WhatsApp. Recipients experience a personalised landing page with your selections, your face, and your message.

---

## Product Vision

**For** anyone who wants to share meaningful music with someone they care about,

**Who** finds modern playlist sharing impersonal and complicated,

**Mixtape is** a simple web app

**That** lets you create, personalise, and send a curated music collection in under 5 minutes,

**Unlike** Spotify's native sharing which lacks personalisation and emotional context,

**Our product** brings back the intimate, thoughtful gesture of the original mixtape.

---

## Goals & Success Metrics

### Business Goals

1. Build email subscriber list for The AI Cookbook newsletter
2. Create a compelling, shareable build tutorial demonstrating practical AI/product development
3. Generate organic word-of-mouth through viral sharing mechanics
4. Demonstrate BuildFirst capabilities through a real, functional product

### Success Metrics

| Metric | Target (3 months) | Stretch Goal |
|--------|-------------------|--------------|
| Mixtapes created | 500 | 2,000 |
| Email signups captured | 200 | 1,000 |
| Viral coefficient | 0.3 (30% of recipients create their own) | 0.5 |
| Average songs per mixtape | 6-8 | 8-10 |

---

## User Personas

Mixtape is for anyone who wants to share music with meaning. The common thread: a shared memory, a moment worth remembering, a feeling that words alone can't capture.

### The Old Friend

- **Context:** Remember that summer in Ibiza? That road trip? Those nights in Dubai?
- **Motivation:** Rekindling a connection, saying "I was thinking of you"
- **Use case:** "Here are the songs from that trip - miss those times"

### The Long-Distance Loved One

- **Context:** Partner, family member, or close friend living far away
- **Motivation:** Staying emotionally connected across distance
- **Use case:** "Songs that remind me of us" or "thinking of you today"

### The Celebrator

- **Context:** Birthday, anniversary, graduation, new job
- **Motivation:** Something more personal than a card, more lasting than flowers
- **Use case:** "Happy 40th - here's the soundtrack to your life"

### The Comforter

- **Context:** Friend going through a tough time - breakup, loss, stress
- **Motivation:** Showing support when you don't know what to say
- **Use case:** "No words needed - just listen"

---

## User Journeys

### Journey 1: Creating a Mixtape

1. User lands on homepage, sees simple value proposition and CTA
2. User clicks "Make a Mixtape" and is prompted to connect Spotify
3. After OAuth, user sees search interface with cassette tape visual
4. User searches for songs, adds 6-10 tracks to their mixtape
5. User enters recipient name, optional selfie, and short message
6. User reviews mixtape preview
7. User chooses sharing method (email, SMS, WhatsApp, or copy link)
8. Confirmation screen with option to create another

### Journey 2: Receiving a Mixtape

1. Recipient receives message: "[Name] made you a mixtape"
2. Clicks link, lands on personalised page with sender's photo/avatar
3. Sees personal message and track listing
4. Clicks play - if logged into Spotify Premium, full playback; otherwise 30-second previews
5. If previews only, sees gentle prompt to connect Spotify for full experience
6. At bottom: CTA to "Make a mixtape for someone else"

---

## Functional Requirements

### Core Features (MVP)

#### F1: Spotify Authentication

- OAuth 2.0 flow with Spotify
- Required scopes: user-read-email, playlist-modify-public (if saving to Spotify)
- Store minimal user data (Spotify ID, email for account creation)
- Works with both free and premium Spotify accounts for creation

#### F2: Track Search & Selection

- Search Spotify catalogue by song title, artist, or album
- Display results with album art, track name, artist, duration
- Add/remove tracks from mixtape (minimum 1, maximum 12 tracks)
- Drag-and-drop reordering of tracks
- 30-second preview playback during selection

#### F3: Personalisation

- Recipient name field (required)
- Personal message (optional, max 200 characters)
- Photo upload for sender avatar (optional)

#### F4: Dancing Avatar (V1 - Simplified)

- Accept photo upload (face detection to crop)
- Frame photo in animated container (polaroid style, bouncing/swaying)
- CSS animation synced to imply dancing
- Fallback: default avatar if no photo provided

#### F5: Sharing

- Generate unique shareable URL for each mixtape
- Share via email (using email API or mailto link)
- Share via SMS (sms: URL scheme)
- Share via WhatsApp (wa.me URL scheme)
- Copy link to clipboard

#### F6: Recipient Experience

- Personalised landing page with sender info, message, track list
- Embedded Spotify player for playback
- Graceful handling of playback restrictions (30s previews with upgrade prompt)
- "Make your own mixtape" CTA (viral loop)
- No login required to view/play

#### F7: Email Capture

- Capture sender email during Spotify OAuth
- Optional newsletter signup checkbox (pre-checked, GDPR compliant)
- Optional email capture when recipient clicks "Make your own"

#### F8: Analytics Dashboard

- Admin dashboard showing real-time metrics vs. targets
- Key metrics tracked: mixtapes created, emails captured, viral coefficient, avg songs per mixtape
- Visual progress bars showing actual vs. target (3-month) vs. stretch goal
- Time-series charts showing daily/weekly trends
- Conversion funnel: visits → Spotify connect → mixtape created → shared → recipient opened → recipient created own
- Password-protected admin route (/admin)

### Future Features (Post-MVP)

- **V2 Dancing Avatar:** Face-on-body compositing using D-ID or similar API
- **Multi-platform support:** Songlink/Odesli integration for Apple Music, Deezer links
- **Mixtape templates:** Pre-designed themes (Birthday, Road Trip, Missing You)
- **Reaction/reply:** Recipient can send a thank you or reply mixtape
- **Analytics:** Sender can see if/when mixtape was played

---

## Non-Functional Requirements

### Performance

- Page load time < 2 seconds
- Search results returned < 500ms
- Mixtape creation flow completable in < 5 minutes

### Scalability

- Support 1,000 concurrent users
- Database designed for 100,000+ mixtapes

### Security & Privacy

- HTTPS everywhere
- Spotify tokens stored securely, refreshed appropriately
- Uploaded photos stored with random UUIDs (not discoverable)
- GDPR compliant: clear data retention policy, deletion capability
- Mixtape URLs use non-sequential, non-guessable IDs

### Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigable
- Screen reader friendly

---

## Technical Architecture

### Stack Recommendation

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend | Next.js 14 (React) | SSR for SEO, API routes, fast development |
| Styling | Tailwind CSS | Rapid prototyping, retro aesthetic achievable |
| Database | Supabase (PostgreSQL) | Free tier, auth built-in, real-time capable |
| File Storage | Supabase Storage or Cloudflare R2 | Photo uploads, cost-effective |
| Hosting | Vercel | Zero-config Next.js deployment, free tier |
| Email | Resend or SendGrid | Transactional email, newsletter integration |
| Analytics | Plausible or PostHog | Privacy-friendly, simple |

### Data Model

- **Users Table:** id, spotify_id, email, display_name, created_at, newsletter_opt_in
- **Mixtapes Table:** id, user_id, recipient_name, message, photo_url, created_at, share_token
- **Tracks Table:** id, mixtape_id, spotify_track_id, position, track_name, artist_name, album_art_url
- **Events Table:** id, mixtape_id, event_type (view/play/share/create), created_at, referrer, user_agent
- **Targets Table:** id, metric_name, target_value, stretch_value, period_end

### API Endpoints

- **POST /api/auth/spotify** - Initiate OAuth flow
- **GET /api/auth/callback** - Handle OAuth callback
- **GET /api/search?q={query}** - Search Spotify tracks
- **POST /api/mixtapes** - Create new mixtape
- **GET /api/mixtapes/{token}** - Retrieve mixtape for viewing
- **POST /api/upload** - Upload sender photo
- **GET /api/admin/analytics** - Retrieve dashboard metrics (protected)
- **POST /api/events** - Track funnel events (view, play, create)

---

## Design Guidelines

### Visual Direction

- **Aesthetic:** Retro/nostalgic with modern usability. Think early web meets cassette culture.
- **Typography:** Blocky, pixelated headers; clean sans-serif body text
- **Colour palette:** Warm, muted tones - think faded album covers, worn tape labels
- **Key visual:** Cassette tape graphic that fills in as tracks are added
- **Animations:** Subtle, playful - tape reels spinning, bouncing avatar

### UX Principles

- **Simplicity first:** One page for creation, one page for viewing
- **Progressive disclosure:** Show only what's needed at each step
- **Delight:** Small moments of joy (sounds, animations) that don't impede flow
- **Mobile-first:** Most sharing happens on phones

---

## Spotify API Constraints

- **Playback:** Full tracks only for Premium users logged into browser; others get 30-second previews
- **Rate limits:** Monitor and implement caching for search results
- **Branding:** Must follow Spotify branding guidelines, include attribution
- **Content policy:** Cannot cache/store audio files; must stream from Spotify
- **Approval:** Extended quota mode may require Spotify approval if usage grows

---

## Legal Requirements

The following legal documents are required before public launch:

### Privacy Policy

- Data collected: email address, Spotify ID, uploaded photos, usage analytics
- Purpose: providing the service, optional newsletter
- Data retention and deletion policy
- Third-party services disclosure (Spotify API, analytics, hosting)
- GDPR compliance: right to access, correct, delete personal data

### Terms of Service

- Service provided "as is" - limitation of liability
- User content ownership and license grant
- Acceptable use policy (no illegal content, harassment, or misuse)
- Right to terminate accounts and remove content

### Cookie Notice

- Required for EU/UK users if using cookies or tracking
- Note: Plausible Analytics is cookie-free, simplifying compliance
- Simple banner with link to privacy policy if cookies are used

*These documents can be plain-English and concise. A single page each covering the basics is sufficient for a free, non-commercial project.*

---

## Timeline & Milestones

| Phase | Deliverables | Duration |
|-------|--------------|----------|
| Phase 1: Foundation | Spotify OAuth, track search, basic UI shell | 1 week |
| Phase 2: Core Flow | Mixtape creation, database, sharing URLs | 1 week |
| Phase 3: Recipient Experience | Landing page, embedded player, mobile optimisation | 1 week |
| Phase 4: Polish | Avatar feature, animations, email capture, analytics | 1 week |
| Phase 5: Launch | Testing, Cookbook article, soft launch | 1 week |

**Total estimated timeline: 5 weeks**

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Spotify API changes/deprecation | Low | Abstract API layer; monitor Spotify developer blog |
| Low viral adoption | Medium | Strong CTA on recipient page; social proof elements |
| 30-second preview frustrates users | Medium | Frame as "nostalgic preview"; clear Spotify upgrade path |
| Photo upload misuse | Low | No public gallery; photos only visible via direct link |
| Hosting costs if viral | Low | Vercel/Supabase free tiers generous; monitor usage |

---

## Open Questions

1. Should mixtapes expire after a certain period, or persist indefinitely?
2. Do we want to save the mixtape as a Spotify playlist on the creator's account?
3. Should recipients be able to "reply" with their own mixtape?
4. What's the right balance of retro aesthetic vs. modern usability?
5. Domain name options: mixtape.fm? makemixtape.com? sendamixtape.com?

---

## Appendix

### Spotify API Reference

- Web API Documentation: https://developer.spotify.com/documentation/web-api
- Embeds Documentation: https://developer.spotify.com/documentation/embeds
- Branding Guidelines: https://developer.spotify.com/documentation/design

### Competitive Landscape

- **Spotify native sharing:** Functional but impersonal
- **Playlist.me:** Similar concept, less emotional/personal focus
- **Receiptify/Instafest:** Viral music visualisations, but consumption-focused not gift-focused

---

*— End of Document —*

---

<sub>*Disclaimer: Mixtape is an independent project. It is not affiliated with, endorsed by, sponsored by, or in any way officially connected with Spotify AB or any of its subsidiaries or affiliates. The creator of Mixtape does not work for Spotify and receives no compensation from Spotify. Spotify is a registered trademark of Spotify AB.*</sub>
