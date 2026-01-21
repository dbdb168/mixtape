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
