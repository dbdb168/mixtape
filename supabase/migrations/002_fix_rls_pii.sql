-- 002_fix_rls_pii.sql
--
-- Security hardening: close the RLS PII-exposure holes left by 001.
--
-- Problem (HIGH): 001 shipped three permissive policies that grant the PUBLIC
-- anon key unrestricted access via the Supabase REST API, independent of the
-- app's own code paths:
--   * mixtapes SELECT USING (true)      -> anyone can bulk-read EVERY mixtape,
--                                          including recipient_email / recipient_phone.
--   * tracks   SELECT USING (true)      -> anyone can bulk-read every track.
--   * events   INSERT WITH CHECK (true) -> anyone can inject arbitrary analytics rows.
--
-- The application never uses the anon key to touch these tables: every read and
-- write in src/ goes through the service_role key server-side (which bypasses
-- RLS entirely). So removing the permissive anon policies does NOT break the app.
-- A SECURITY DEFINER RPC is added to preserve a safe, non-PII public lookup path
-- for any future client-side use.

-- ---------------------------------------------------------------------------
-- 0. Reconcile schema drift.
--    The live DB (project hfgdacpkdeqwcfspezgz) has PII columns that the app
--    writes (see src/app/api/mixtapes/route.ts and send-email/route.ts) but that
--    were never added in 001. Add them idempotently so this migration is
--    self-consistent against both the drifted live DB (no-op) and a fresh 001 DB.
-- ---------------------------------------------------------------------------
ALTER TABLE public.mixtapes ADD COLUMN IF NOT EXISTS sender_name TEXT;
ALTER TABLE public.mixtapes ADD COLUMN IF NOT EXISTS recipient_email TEXT;
ALTER TABLE public.mixtapes ADD COLUMN IF NOT EXISTS recipient_phone TEXT;

-- ---------------------------------------------------------------------------
-- 1. Drop the blanket permissive policies.
--    RLS stays ENABLED on every table; with no permissive policy, anon is denied
--    by default. service_role continues to bypass RLS, so the app is unaffected.
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can view mixtapes by share_token" ON public.mixtapes;
DROP POLICY IF EXISTS "Tracks follow mixtape access" ON public.tracks;
DROP POLICY IF EXISTS "Anyone can insert events" ON public.events;

-- ---------------------------------------------------------------------------
-- 2. Safe public lookup path via a SECURITY DEFINER function.
--    Returns a single mixtape (plus its tracks) for an EXACT share_token match.
--    Deliberately EXCLUDES recipient_email and recipient_phone: the public
--    viewer (src/app/m/[token]) never displays them, so they must not leave the
--    server. The function runs as its owner and bypasses RLS, but only ever
--    exposes the non-PII projection below, and only for an exact token.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_mixtape_by_share_token(token TEXT)
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'id', m.id,
    'user_id', m.user_id,
    'share_token', m.share_token,
    'title', m.title,
    'sender_name', m.sender_name,
    'recipient_name', m.recipient_name,
    'message', m.message,
    'photo_url', m.photo_url,
    'reply_to_mixtape_id', m.reply_to_mixtape_id,
    'created_at', m.created_at,
    'tracks', COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', t.id,
          'mixtape_id', t.mixtape_id,
          'spotify_track_id', t.spotify_track_id,
          'position', t.position,
          'track_name', t.track_name,
          'artist_name', t.artist_name,
          'album_art_url', t.album_art_url,
          'duration_ms', t.duration_ms
        ) ORDER BY t.position
      )
      FROM public.tracks t
      WHERE t.mixtape_id = m.id
    ), '[]'::jsonb)
  )
  FROM public.mixtapes m
  WHERE m.share_token = token;
$$;

-- Lock down and re-grant execution explicitly.
REVOKE ALL ON FUNCTION public.get_mixtape_by_share_token(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_mixtape_by_share_token(TEXT) TO anon, authenticated, service_role;
