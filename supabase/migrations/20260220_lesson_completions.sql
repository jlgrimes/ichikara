-- Lesson completions — one row per user×lesson×language
CREATE TABLE IF NOT EXISTS lesson_completions (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id    TEXT        NOT NULL,
  language_id  TEXT        NOT NULL DEFAULT 'japanese',
  completed_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (user_id, lesson_id, language_id)
);

-- Row-level security
ALTER TABLE lesson_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own"
  ON lesson_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users_insert_own"
  ON lesson_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_delete_own"
  ON lesson_completions FOR DELETE
  USING (auth.uid() = user_id);

-- Index for fast per-user lookups
CREATE INDEX IF NOT EXISTS idx_lesson_completions_user
  ON lesson_completions (user_id, language_id);
