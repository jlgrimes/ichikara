/**
 * ProgressContext — lesson completion tracking
 *
 * Stores completions in Supabase (lesson_completions table) with an
 * optimistic localStorage mirror for instant reads across sessions.
 *
 * Falls back gracefully if Supabase is unavailable (table not yet created,
 * offline, etc.) — completions persist in localStorage only in that case.
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

// ── localStorage helpers ──────────────────────────────────────────────────────

function lsKey(userId: string, languageId: string) {
  return `ichikara_progress_${userId}_${languageId}`;
}

function lsRead(userId: string, languageId: string): Set<string> {
  try {
    const raw = localStorage.getItem(lsKey(userId, languageId));
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function lsWrite(userId: string, languageId: string, ids: Set<string>) {
  try {
    localStorage.setItem(lsKey(userId, languageId), JSON.stringify([...ids]));
  } catch {
    // ignore
  }
}

// ── Context shape ─────────────────────────────────────────────────────────────

interface ProgressContextValue {
  /** Set of lesson IDs the user has completed for the current language. */
  completedIds: Set<string>;
  /** True while initial fetch is in flight. */
  loading: boolean;
  /** Mark a lesson complete. Optimistic — updates UI immediately. */
  markComplete: (lessonId: string) => Promise<void>;
  /** Toggle off a completion (undo). */
  markIncomplete: (lessonId: string) => Promise<void>;
  /** Convenience boolean check. */
  isComplete: (lessonId: string) => boolean;
  /** Count of completed lessons. */
  completedCount: number;
}

const ProgressContext = createContext<ProgressContextValue>({
  completedIds: new Set(),
  loading: false,
  markComplete: async () => {},
  markIncomplete: async () => {},
  isComplete: () => false,
  completedCount: 0,
});

// ── Provider ──────────────────────────────────────────────────────────────────

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { languageId } = useLanguage();

  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // ── Initial load ───────────────────────────────────────────────────────────

  useEffect(() => {
    if (!user) {
      setCompletedIds(new Set());
      return;
    }

    // Seed from localStorage instantly (zero perceived latency)
    const cached = lsRead(user.id, languageId);
    setCompletedIds(cached);

    // Then fetch from Supabase to catch cross-device changes
    setLoading(true);
    supabase
      .from('lesson_completions')
      .select('lesson_id')
      .eq('user_id', user.id)
      .eq('language_id', languageId)
      .then(({ data, error }) => {
        setLoading(false);
        if (error || !data) return; // silently fall back to cached
        const remote = new Set(data.map((r) => r.lesson_id as string));
        setCompletedIds(remote);
        lsWrite(user.id, languageId, remote);
      });
  }, [user, languageId]);

  // ── Mark complete ──────────────────────────────────────────────────────────

  const markComplete = useCallback(
    async (lessonId: string) => {
      if (!user) return;

      // Optimistic update
      const next = new Set(completedIds);
      next.add(lessonId);
      setCompletedIds(next);
      lsWrite(user.id, languageId, next);

      // Persist to Supabase (upsert so duplicate taps are no-ops)
      await supabase.from('lesson_completions').upsert(
        { user_id: user.id, lesson_id: lessonId, language_id: languageId },
        { onConflict: 'user_id,lesson_id,language_id' },
      );
    },
    [user, languageId, completedIds],
  );

  // ── Mark incomplete ────────────────────────────────────────────────────────

  const markIncomplete = useCallback(
    async (lessonId: string) => {
      if (!user) return;

      const next = new Set(completedIds);
      next.delete(lessonId);
      setCompletedIds(next);
      lsWrite(user.id, languageId, next);

      await supabase
        .from('lesson_completions')
        .delete()
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .eq('language_id', languageId);
    },
    [user, languageId, completedIds],
  );

  const isComplete = useCallback(
    (lessonId: string) => completedIds.has(lessonId),
    [completedIds],
  );

  return (
    <ProgressContext.Provider
      value={{
        completedIds,
        loading,
        markComplete,
        markIncomplete,
        isComplete,
        completedCount: completedIds.size,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useProgress() {
  return useContext(ProgressContext);
}
