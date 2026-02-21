-- ============================================================================
-- QRT-210: RLS Audit + Subscriptions table
-- Created: 2026-02-21
-- ============================================================================
-- Findings from audit:
-- 1. lesson_completions: missing UPDATE policy (upsert operations need it)
-- 2. bookmarks: missing UPDATE policy
-- 3. subscriptions table: did not exist (referenced in useSubscription.ts)
-- 4. Both tables: no explicit GRANT to anon/authenticated roles (Supabase
--    auto-grants by default, but explicit grants are safer + auditable)
-- ============================================================================

-- ── lesson_completions: add UPDATE policy ────────────────────────────────────

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'lesson_completions'
      AND policyname = 'users_update_own'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "users_update_own"
        ON lesson_completions FOR UPDATE
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id)
    $policy$;
  END IF;
END $$;

-- ── bookmarks: add UPDATE policy ─────────────────────────────────────────────

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'bookmarks'
      AND policyname = 'users_update_own_bookmarks'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "users_update_own_bookmarks"
        ON bookmarks FOR UPDATE
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id)
    $policy$;
  END IF;
END $$;

-- ── Explicit role grants (belt-and-suspenders) ────────────────────────────────
-- Supabase auto-grants these, but explicit grants ensure they survive schema
-- resets and make the security model auditable.

GRANT SELECT, INSERT, UPDATE, DELETE
  ON lesson_completions TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
  ON bookmarks TO authenticated;

-- Revoke anon access to data tables (anon = unauthenticated web requests)
-- Note: Supabase anon key is safe to expose in client — it just has no data access
REVOKE ALL ON lesson_completions FROM anon;
REVOKE ALL ON bookmarks FROM anon;

-- ── subscriptions table ───────────────────────────────────────────────────────
-- Written by Supabase Edge Function after StoreKit receipt validation (QRT-201)
-- Read by useSubscription.ts hook to determine premium access

CREATE TABLE IF NOT EXISTS subscriptions (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier           TEXT        NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'premium')),
  product_id     TEXT,                          -- Apple product ID (e.g. app.ichikara.premium.annual)
  receipt_data   TEXT,                          -- Base64 StoreKit receipt (encrypted at rest)
  purchase_date  TIMESTAMPTZ,
  expires_at     TIMESTAMPTZ,
  is_trial       BOOLEAN     DEFAULT FALSE,
  platform       TEXT        DEFAULT 'ios'  CHECK (platform IN ('ios', 'android', 'web')),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (user_id)                             -- one subscription record per user
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can read their own subscription
CREATE POLICY "users_select_own_subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Only service role (Edge Functions) can insert/update/delete
-- (Users must not be able to self-grant premium)
-- IMPORTANT: Do NOT add INSERT/UPDATE/DELETE policies for 'authenticated' role.
-- Supabase Edge Functions use the service_role key to write subscription records.

GRANT SELECT ON subscriptions TO authenticated;
REVOKE ALL   ON subscriptions FROM anon;

-- Index for fast user lookup
CREATE INDEX IF NOT EXISTS idx_subscriptions_user
  ON subscriptions (user_id);

-- Trigger: auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS subscriptions_updated_at ON subscriptions;
CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
