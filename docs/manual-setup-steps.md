# Manual Setup Steps for Mixtape

These are the manual steps required to set up Mixtape from scratch. These steps cannot be automated by Claude and must be done by you.

---

## 1. Apple Developer Account Setup

**Time:** 30-60 minutes (includes waiting for approval if new account)

### Steps:
1. Go to https://developer.apple.com
2. Sign in with your Apple ID or create a new developer account
3. Enroll in the Apple Developer Program ($99/year)
4. Wait for enrollment approval (usually instant for existing Apple IDs)

### Create MusicKit Identifier:
1. Go to Certificates, Identifiers & Profiles
2. Click "Identifiers" → "+" button
3. Select "MusicKit Identifier"
4. Enter a description (e.g., "Mixtape App")
5. Enter an identifier (e.g., "com.luminary.mixtape")
6. Save

### Create MusicKit Key:
1. Go to "Keys" → "+" button
2. Name it (e.g., "Mixtape MusicKit Key")
3. Check "MusicKit" checkbox
4. Continue and Register
5. **Download the .p8 key file** (you can only download once!)
6. Note the **Key ID** displayed
7. Note your **Team ID** (visible in top right of developer portal)

### Environment Variables Generated:
```
APPLE_TEAM_ID=<your team ID>
APPLE_KEY_ID=<from key creation>
APPLE_PRIVATE_KEY=<contents of .p8 file, keep newlines>
```

---

## 2. Supabase Project Setup

**Time:** 15-20 minutes

### Create Project:
1. Go to https://supabase.com
2. Sign in or create account
3. Click "New Project"
4. Select your organization
5. Enter project name: "Mixtape"
6. Generate a strong database password (save it!)
7. Select region closest to your users
8. Click "Create new project"
9. Wait for project to initialize (~2 minutes)

### Get API Keys:
1. Go to Settings → API
2. Copy the **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy the **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy the **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

### Create Database Tables:
1. Go to SQL Editor
2. Run this SQL:

```sql
-- Create mixtapes table
CREATE TABLE mixtapes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  share_token VARCHAR(12) UNIQUE NOT NULL,
  title VARCHAR(100),
  sender_name VARCHAR(100),
  recipient_name VARCHAR(100) NOT NULL DEFAULT 'You',
  recipient_email VARCHAR(255),
  message TEXT,
  photo_url TEXT,
  reply_to_mixtape_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tracks table
CREATE TABLE tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mixtape_id UUID REFERENCES mixtapes(id) ON DELETE CASCADE,
  spotify_track_id VARCHAR(50) NOT NULL,
  position INTEGER NOT NULL,
  track_name VARCHAR(255) NOT NULL,
  artist_name VARCHAR(255) NOT NULL,
  album_art_url TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table for analytics
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mixtape_id UUID REFERENCES mixtapes(id) ON DELETE SET NULL,
  user_id UUID,
  event_type VARCHAR(50) NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_mixtapes_share_token ON mixtapes(share_token);
CREATE INDEX idx_tracks_mixtape_id ON tracks(mixtape_id);
CREATE INDEX idx_events_mixtape_id ON events(mixtape_id);
CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_events_created_at ON events(created_at);
```

### Set Row Level Security (Optional but Recommended):
```sql
-- Enable RLS
ALTER TABLE mixtapes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Allow public read access to mixtapes
CREATE POLICY "Mixtapes are viewable by everyone" ON mixtapes
  FOR SELECT USING (true);

-- Allow service role full access
CREATE POLICY "Service role has full access to mixtapes" ON mixtapes
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to tracks" ON tracks
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to events" ON events
  FOR ALL USING (auth.role() = 'service_role');
```

---

## 3. SendGrid Setup

**Time:** 10-15 minutes

### Create Account:
1. Go to https://sendgrid.com
2. Sign up for free account (100 emails/day free)
3. Verify your email address

### Verify Sender Identity:
1. Go to Settings → Sender Authentication
2. Choose "Single Sender Verification" (easiest for starting)
3. Enter your sender details:
   - From Email: noreply@yourdomain.com (or your personal email)
   - From Name: "Mixtape"
   - Reply To: your email
4. Click "Create"
5. Check your email and verify

### Create API Key:
1. Go to Settings → API Keys
2. Click "Create API Key"
3. Name it "Mixtape"
4. Select "Restricted Access"
5. Under "Mail Send", set to "Full Access"
6. Click "Create & View"
7. **Copy the API key** (shown only once!)

### Environment Variables Generated:
```
SENDGRID_API_KEY=<your API key>
SENDGRID_FROM_EMAIL=<your verified sender email>
```

---

## 4. Vercel Project Setup

**Time:** 10 minutes

### Connect Repository:
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Import your Mixtape repository
5. Vercel will auto-detect Next.js

### Configure Environment Variables:
1. Before deploying, expand "Environment Variables"
2. Add ALL environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `APPLE_TEAM_ID`
   - `APPLE_KEY_ID`
   - `APPLE_PRIVATE_KEY` (paste entire key including BEGIN/END lines)
   - `SENDGRID_API_KEY`
   - `SENDGRID_FROM_EMAIL`
   - `NEXT_PUBLIC_APP_URL` (will be your Vercel URL or custom domain)
   - `ADMIN_PASSWORD` (generate a strong 24+ character password)

3. Click "Deploy"

### Set Custom Domain (Optional):
1. After deploy, go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain

---

## 5. Domain & DNS Setup (If Using Custom Domain)

**Time:** 5-30 minutes (depends on DNS propagation)

### Vercel Domain:
1. In Vercel project, go to Settings → Domains
2. Enter your domain (e.g., mixtape.yourdomain.com)
3. Vercel will show required DNS records

### DNS Configuration:
Add these records at your DNS provider:

**For subdomain (e.g., mixtape.yourdomain.com):**
```
Type: CNAME
Name: mixtape
Value: cname.vercel-dns.com
```

**For apex domain (e.g., yourdomain.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

### Wait for Propagation:
- Usually 5-15 minutes
- Can take up to 48 hours
- Check status in Vercel dashboard

---

## 6. Generate Admin Password

**Time:** 1 minute

Generate a secure admin password:

```bash
# On Mac/Linux terminal:
openssl rand -base64 24

# Or use a password manager to generate
```

Save this as `ADMIN_PASSWORD` in Vercel environment variables.

---

## Post-Setup Verification Checklist

### Test Each Feature:
- [ ] Visit /create - can you search for songs?
- [ ] Add tracks - do they appear in the list?
- [ ] Name the mixtape - does it save?
- [ ] Click Send Tape - does personalization appear?
- [ ] Share via link - does the URL work?
- [ ] Share via email - does the email arrive?
- [ ] Open mixtape link - does the listen page load?
- [ ] Play a track - does preview play?
- [ ] Visit /admin with password - does dashboard load?

### Check OG Images:
1. Create a test mixtape
2. Share the link in iMessage or Twitter
3. Verify the preview shows "You received a mixtape!"

### Check Analytics:
1. Create a mixtape
2. Visit admin panel
3. Verify the count increased
4. Verify funnel shows activity

---

## Troubleshooting Common Issues

### "Search not working"
- Check `APPLE_TEAM_ID`, `APPLE_KEY_ID`, and `APPLE_PRIVATE_KEY` are set
- Verify the .p8 key includes newlines (`\n` characters)
- Check Vercel logs for specific errors

### "Email not sending"
- Verify SendGrid sender is verified
- Check `SENDGRID_API_KEY` and `SENDGRID_FROM_EMAIL` are set
- Check SendGrid activity feed for bounces

### "Admin page returns 401"
- Verify `ADMIN_PASSWORD` is set in Vercel
- Clear browser cache and try again
- Check the password doesn't have special characters that need escaping

### "OG images showing homepage instead of mixtape"
- This is iOS caching from a previous error
- New mixtapes should work correctly
- Wait for cache to expire or test with new URLs

---

## Time Summary

| Step | Time Required |
|------|---------------|
| Apple Developer Setup | 30-60 min |
| Supabase Setup | 15-20 min |
| SendGrid Setup | 10-15 min |
| Vercel Setup | 10 min |
| Custom Domain | 5-30 min |
| Admin Password | 1 min |
| **Total** | **~1.5-2.5 hours** |

Note: Most of this time is one-time setup. Once configured, deploying updates takes only 1-2 minutes.
