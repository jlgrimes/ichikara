/**
 * BookmarkContext — save lessons and SOS phrases.
 *
 * item_type: 'lesson' | 'phrase'
 * item_id:   lessonId  |  'categoryId:phraseIndex'
 *
 * Optimistic localStorage write + async Supabase sync (same pattern as ProgressContext).
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';

// ── Types ─────────────────────────────────────────────────────────────────────

export type BookmarkType = 'lesson' | 'phrase';

export interface BookmarkItem {
  type: BookmarkType;
  id: string;
}

// ── localStorage helpers ──────────────────────────────────────────────────────

function lsKey(userId: string, languageId: string) {
  return `ichikara_bookmarks_${userId}_${languageId}`;
}

function lsRead(userId: string, languageId: string): BookmarkItem[] {
  try {
    const raw = localStorage.getItem(lsKey(userId, languageId));
    if (!raw) return [];
    return JSON.parse(raw) as BookmarkItem[];
  } catch { return []; }
}

function lsWrite(userId: string, languageId: string, items: BookmarkItem[]) {
  try {
    localStorage.setItem(lsKey(userId, languageId), JSON.stringify(items));
  } catch { /* ignore */ }
}

function makeKey(type: BookmarkType, id: string) {
  return `${type}:${id}`;
}

// ── Context ───────────────────────────────────────────────────────────────────

interface BookmarkContextValue {
  bookmarks: BookmarkItem[];
  loading: boolean;
  isBookmarked: (type: BookmarkType, id: string) => boolean;
  toggleBookmark: (type: BookmarkType, id: string) => Promise<void>;
  lessonBookmarks: BookmarkItem[];
  phraseBookmarks: BookmarkItem[];
}

const BookmarkContext = createContext<BookmarkContextValue>({
  bookmarks: [],
  loading: false,
  isBookmarked: () => false,
  toggleBookmark: async () => {},
  lessonBookmarks: [],
  phraseBookmarks: [],
});

// ── Provider ──────────────────────────────────────────────────────────────────

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { languageId } = useLanguage();

  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading]     = useState(false);

  // Derived sets for O(1) lookup
  const [keySet, setKeySet] = useState<Set<string>>(new Set());

  function syncKeySet(items: BookmarkItem[]) {
    setKeySet(new Set(items.map(b => makeKey(b.type, b.id))));
  }

  // ── Load ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!user) { setBookmarks([]); setKeySet(new Set()); return; }

    // Seed from cache
    const cached = lsRead(user.id, languageId);
    setBookmarks(cached);
    syncKeySet(cached);

    setLoading(true);
    supabase
      .from('bookmarks')
      .select('item_type, item_id')
      .eq('user_id', user.id)
      .eq('language_id', languageId)
      .then(({ data, error }) => {
        setLoading(false);
        if (error || !data) return;
        const remote: BookmarkItem[] = data.map(r => ({
          type: r.item_type as BookmarkType,
          id: r.item_id as string,
        }));
        setBookmarks(remote);
        syncKeySet(remote);
        lsWrite(user.id, languageId, remote);
      });
  }, [user, languageId]);

  // ── Toggle ────────────────────────────────────────────────────────────────

  const toggleBookmark = useCallback(
    async (type: BookmarkType, id: string) => {
      if (!user) return;

      const k = makeKey(type, id);
      const exists = keySet.has(k);

      let next: BookmarkItem[];
      if (exists) {
        next = bookmarks.filter(b => makeKey(b.type, b.id) !== k);
      } else {
        next = [...bookmarks, { type, id }];
      }

      setBookmarks(next);
      syncKeySet(next);
      lsWrite(user.id, languageId, next);

      if (exists) {
        await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('item_type', type)
          .eq('item_id', id)
          .eq('language_id', languageId);
      } else {
        await supabase.from('bookmarks').upsert(
          { user_id: user.id, item_type: type, item_id: id, language_id: languageId },
          { onConflict: 'user_id,item_type,item_id,language_id' },
        );
      }
    },
    [user, languageId, bookmarks, keySet],
  );

  const isBookmarked = useCallback(
    (type: BookmarkType, id: string) => keySet.has(makeKey(type, id)),
    [keySet],
  );

  const lessonBookmarks = bookmarks.filter(b => b.type === 'lesson');
  const phraseBookmarks = bookmarks.filter(b => b.type === 'phrase');

  return (
    <BookmarkContext.Provider value={{
      bookmarks, loading, isBookmarked, toggleBookmark,
      lessonBookmarks, phraseBookmarks,
    }}>
      {children}
    </BookmarkContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useBookmarks() {
  return useContext(BookmarkContext);
}
