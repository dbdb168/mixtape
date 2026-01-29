# How I Built Mixtape: A Non-Developer's Guide to Building a Music Sharing App

*I am not a developer. I cannot write code. But I built Mixtape anyway.*

## The Idea

Remember making mixtapes? That feeling of carefully selecting each song, thinking about someone as you curated the perfect playlist? I wanted to bring that back—but for the streaming era.

The goal was simple: let anyone pick songs, add a personal message, and send a digital mixtape to someone they care about. No account required. No friction. Just music and meaning.

## The Tech Stack

Here's what powers Mixtape:

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type safety (Claude handles this) |
| **Tailwind CSS** | Styling with a retro cassette aesthetic |
| **Supabase** | PostgreSQL database for storing mixtapes |
| **Apple MusicKit** | Song search and playback |
| **SendGrid** | Transactional emails to recipients |
| **Vercel** | Hosting and deployment |

## How It Works

### 1. Creating a Mixtape

Users land on a "boombox" interface with three panels:
- **Left**: Search Apple Music's catalog
- **Center**: A cassette visualization with editable title
- **Right**: Track list with drag-and-drop reordering

When you click "Send Tape", the mixtape is saved to Supabase and you get a unique shareable link.

### 2. Sharing

Two options:
- **Email**: Enter their email, we send a beautiful HTML email via SendGrid
- **Link**: Copy/share the link via any messaging app

### 3. Listening

Recipients open the link and see a "jewel case" visualization with the cassette inside. If they have Apple Music, they can play the full tracks. If not, they get 30-second previews.

## The Database Schema

Three main tables:

```sql
-- Mixtapes
mixtapes (
  id, share_token, title, sender_name,
  recipient_name, recipient_email, message,
  created_at
)

-- Tracks
tracks (
  id, mixtape_id, position, track_name,
  artist_name, album_art_url, duration_ms
)

-- Analytics Events
events (
  id, mixtape_id, event_type, metadata,
  created_at
)
```

## Key Features I'm Proud Of

### The Cassette Aesthetic
Pure CSS wizardry creates a realistic cassette tape with spinning reels during "recording". The j-card insert, jewel case reflections, and paper texture for liner notes all add to the nostalgic feel.

### Viral Loop Built-In
Every mixtape has a "Make your own mixtape" CTA. We track when people click it to measure the viral coefficient.

### Privacy-First
- Recipient emails are used only to send the notification—not stored
- No accounts required
- No tracking cookies
- Simple, honest privacy policy

### Dynamic Social Previews
When someone shares a mixtape link, the preview shows:
- The sender's name
- Number of tracks
- A cassette visualization

Generated dynamically using Next.js OG image generation.

## The Build Process

I used Claude Code (Anthropic's AI coding assistant) to build this entire app. My workflow:

1. **Describe what I want** in plain English
2. **Review the code** Claude generates
3. **Test in the browser** and report issues
4. **Iterate** until it works

Key prompts that shaped the app:
- "Create a boombox-style interface for searching and adding tracks"
- "Make the cassette reels spin when recording"
- "Add drag-and-drop reordering to the track list"
- "Generate dynamic OG images for social sharing"

## Security: The Clawdbot Lesson

If you've been following AI news, you know about Clawdbot—the cautionary tale of AI-generated code shipping with security vulnerabilities. Building with AI assistants is powerful, but it comes with responsibility. The AI doesn't automatically think about security. You have to ask.

Before launching Mixtape, I ran a comprehensive security audit. Here's what we found and fixed:

### What We Found (14 Vulnerabilities)

| Severity | Issue | Risk |
|----------|-------|------|
| **Critical** | API endpoint allowed anyone to modify any mixtape | Data tampering |
| **Critical** | Admin password was a placeholder value | Full admin access |
| **High** | Admin API had no authentication | Analytics exposure |
| **High** | User input went directly into email headers | Email injection attacks |
| **High** | Event types weren't validated | Database pollution |
| **Medium** | No email format validation | Malformed data |
| **Medium** | No input length limits | Buffer issues |
| **Low** | Share tokens were only 8 characters | Guessable URLs |

### How We Fixed Them

1. **Removed the dangerous PATCH endpoint** - If an API endpoint doesn't need to exist, delete it
2. **Added middleware authentication** - Protected `/api/admin/*` routes
3. **Input sanitization** - Created `sanitizeForEmail()` to strip dangerous characters
4. **Allowlist validation** - Event types must match a predefined list
5. **Strong passwords** - Generated 24-character random admin password
6. **Longer tokens** - Increased share URLs from 8 to 12 characters

### The Lesson

**AI-generated code is not security-audited code.** Before you ship anything that handles user data, asks for emails, or has an admin panel:

1. Run a security review (ask Claude to audit its own code)
2. Check for OWASP Top 10 vulnerabilities
3. Validate all user input
4. Use strong authentication
5. Remove unused endpoints

This isn't about being paranoid—it's about being responsible. Your users trust you with their data.

## Lessons Learned

### 1. Start with the user experience
I sketched the cassette interface before writing any code. Having a clear vision of what users would see made it easier to describe to Claude.

### 2. Security is not optional
See above. Even for a fun side project, security matters.

### 3. Small details create magic
The spinning reels, paper texture, cassette reflection—these don't add "functionality" but they make the experience feel special.

### 4. Analytics from day one
Built-in event tracking for views, plays, and CTA clicks lets us understand how people use the app.

## What's Next?

- Spotify integration (in addition to Apple Music)
- Reply mixtapes (respond with your own mixtape)
- Collaborative mixtapes (multiple people add tracks)

## Try It

Make a mixtape for someone you care about: [mixtape.thisisluminary.co](https://mixtape.thisisluminary.co)

---

*This is part of The AI Cookbook series, where I document building real products with AI assistance. Subscribe at [theaicookbook.substack.com](https://theaicookbook.substack.com)*
