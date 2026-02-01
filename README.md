# 🎵 Mixtape

**Create and share digital mixtapes with the people you care about.**

Mixtape brings back the emotional art of making mixtapes for the streaming era. Search for songs, add a personal message, and share your creation via email or link. No account required.

![Mixtape Screenshot](https://mixtape.thisisluminary.co/opengraph-image)

## ✨ Features

- **🎧 Apple Music Integration** - Search millions of songs from the Apple Music catalog
- **📼 Nostalgic Design** - Beautiful cassette tape aesthetic with spinning reels
- **💌 Personal Touch** - Add sender/recipient names and liner notes
- **📧 Email Sharing** - Send mixtapes directly to someone's inbox
- **🔗 Link Sharing** - Share via any messaging app
- **📊 Analytics Dashboard** - Track views, plays, and viral coefficient
- **🖼️ Social Previews** - Dynamic OG images for beautiful link previews
- **🔒 Privacy-First** - No accounts, no tracking cookies, minimal data

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier works)
- Apple Developer account ($99/year)
- SendGrid account (free tier: 100 emails/day)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/mixtape.git
   cd mixtape
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your credentials (see [Environment Setup](#environment-setup) below)

4. **Set up the database**
   - Create a new Supabase project
   - Run the SQL from `docs/manual-setup-steps.md` in Supabase SQL Editor

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🔧 Environment Setup

You'll need to set up accounts with these services:

| Service | Purpose | Cost |
|---------|---------|------|
| [Supabase](https://supabase.com) | Database | Free tier available |
| [Apple Developer](https://developer.apple.com) | Music search/playback | $99/year |
| [SendGrid](https://sendgrid.com) | Email sending | Free: 100/day |
| [Vercel](https://vercel.com) | Hosting | Free tier available |

See [`docs/manual-setup-steps.md`](docs/manual-setup-steps.md) for detailed setup instructions.

### Required Environment Variables

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
ADMIN_PASSWORD=
NEXT_PUBLIC_APP_URL=
```

## 📁 Project Structure

```
mixtape/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Homepage
│   │   ├── create/            # Create mixtape flow
│   │   ├── m/[token]/         # Listen page (shared mixtapes)
│   │   ├── admin/             # Analytics dashboard
│   │   └── api/               # API routes
│   ├── components/            # React components
│   ├── lib/                   # Utilities & integrations
│   │   ├── musickit/          # Apple Music API
│   │   ├── supabase/          # Database client
│   │   ├── email.ts           # SendGrid integration
│   │   └── analytics/         # Event tracking
│   └── styles/                # Global styles & fonts
├── public/                    # Static assets
├── docs/                      # Documentation
│   ├── PRD-mixtape-v1.md     # Product requirements
│   └── manual-setup-steps.md  # Setup guide
└── Designs/                   # Design assets
```

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Music API:** [Apple MusicKit JS](https://developer.apple.com/musickit/)
- **Email:** [SendGrid](https://sendgrid.com/)
- **Hosting:** [Vercel](https://vercel.com/)
- **Analytics:** [Vercel Analytics](https://vercel.com/analytics) + Custom events

## 📊 Database Schema

```sql
-- Mixtapes
mixtapes (id, share_token, title, sender_name, recipient_name,
          recipient_email, message, created_at)

-- Tracks
tracks (id, mixtape_id, position, track_name, artist_name,
        album_art_url, duration_ms)

-- Analytics Events
events (id, mixtape_id, event_type, metadata, created_at)
```

## 🔐 Security

This project was built with security in mind:

- ✅ All user input sanitized
- ✅ Admin routes protected by middleware
- ✅ Event types validated against allowlist
- ✅ No hardcoded secrets in codebase
- ✅ Environment variables for all sensitive data
- ✅ Share tokens are 12 characters (not guessable)

See the [Security section in the PRD](docs/PRD-mixtape-v1.md) for more details.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Contribution Guide

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Ideas for Contributions

- 🎵 Spotify integration
- 💬 Reply mixtapes (respond with your own)
- 👥 Collaborative mixtapes
- 📱 PWA support
- 🎨 Custom artwork upload
- 🌍 Internationalization

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Claude Code](https://claude.ai) by Anthropic
- Inspired by the lost art of making mixtapes
- Part of [The AI Cookbook](https://theaicookbook.substack.com) project

## 📬 Contact

- **Website:** [mixtape.thisisluminary.co](https://mixtape.thisisluminary.co)
- **Newsletter:** [The AI Cookbook](https://theaicookbook.substack.com)
- **Issues:** [GitHub Issues](https://github.com/YOUR_USERNAME/mixtape/issues)

---

**Made with ❤️ and AI assistance**

*Remember: The best mixtape is the one you make for someone you care about.*
