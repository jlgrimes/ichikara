/**
 * Quiz / spaced-repetition utilities
 *
 * Scores stored in localStorage under `ichikara_quiz_{lessonId}_{cardId}`.
 * Score = number of consecutive correct recalls (max tracked: 5).
 * "Again" resets to 0. "Got it" increments.
 *
 * Mastery = average score across all cards, normalised to 0–100.
 */

const NS = 'ichikara_quiz';

function key(lessonId: string, cardId: string) {
  return `${NS}_${lessonId}_${cardId}`;
}

export function getScore(lessonId: string, cardId: string): number {
  try {
    const raw = localStorage.getItem(key(lessonId, cardId));
    if (raw === null) return 0;
    const n = parseInt(raw, 10);
    return isNaN(n) ? 0 : Math.max(0, n);
  } catch {
    return 0;
  }
}

export function recordResult(lessonId: string, cardId: string, correct: boolean): void {
  try {
    const curr = getScore(lessonId, cardId);
    localStorage.setItem(key(lessonId, cardId), String(correct ? Math.min(curr + 1, 10) : 0));
  } catch {
    // localStorage unavailable (e.g. private browsing edge case) — fail silently
  }
}

/** 0–100 mastery percentage for a lesson given its card IDs. */
export function getLessonMastery(lessonId: string, cardIds: string[]): number {
  if (!cardIds.length) return 0;
  const MAX_SCORE = 3; // treat 3+ correct as "mastered"
  const total = cardIds.reduce(
    (sum, id) => sum + Math.min(getScore(lessonId, id), MAX_SCORE),
    0,
  );
  return Math.round((total / (cardIds.length * MAX_SCORE)) * 100);
}

/** Sort card IDs so lower-scored cards come first (most review needed). */
export function sortByPriority(lessonId: string, cardIds: string[]): string[] {
  return [...cardIds].sort((a, b) => getScore(lessonId, a) - getScore(lessonId, b));
}
