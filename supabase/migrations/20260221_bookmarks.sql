-- Bookmarks — lessons and SOS phrases saved by the user
CREATE TABLE IF NOT EXISTS bookmarks (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type    TEXT        NOT NULL CHECK (item_type IN ('lesson', 'phrase')),
  item_id      TEXT        NOT NULL,   -- lessonId | 'categoryId:phraseIndex'
  language_id  TEXT        NOT NULL DEFAULT 'japanese',
  bookmarked_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (user_id, item_type, item_id, language_id)
);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own_bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users_insert_own_bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_delete_own_bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user
  ON bookmarks (user_id, language_id, item_type);
