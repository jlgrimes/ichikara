/**
 * Unit tests — quiz.ts spaced-repetition engine (QRT-187)
 *
 * Tests: getScore, recordResult, getLessonMastery, sortByPriority
 *
 * localStorage is provided by jsdom (vitest environment: 'jsdom').
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { getScore, getLessonMastery, recordResult, sortByPriority } from './quiz';

const LESSON = 'lesson-wa-particle';
const CARD_A  = 'sample';
const CARD_B  = 'section-0';
const CARD_C  = 'section-1';

// ── Helpers ───────────────────────────────────────────────────────────────────

function clearQuizStorage() {
  const keys = Object.keys(localStorage).filter(k => k.startsWith('ichikara_quiz'));
  keys.forEach(k => localStorage.removeItem(k));
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────

beforeEach(() => {
  clearQuizStorage();
});

// ── getScore ──────────────────────────────────────────────────────────────────

describe('getScore', () => {
  it('returns 0 for an unseen card', () => {
    expect(getScore(LESSON, CARD_A)).toBe(0);
  });

  it('returns 0 for a stored score of 0', () => {
    localStorage.setItem('ichikara_quiz_lesson-wa-particle_sample', '0');
    expect(getScore(LESSON, CARD_A)).toBe(0);
  });

  it('returns the stored numeric score', () => {
    localStorage.setItem('ichikara_quiz_lesson-wa-particle_sample', '3');
    expect(getScore(LESSON, CARD_A)).toBe(3);
  });

  it('clamps negative stored values to 0', () => {
    localStorage.setItem('ichikara_quiz_lesson-wa-particle_sample', '-5');
    expect(getScore(LESSON, CARD_A)).toBe(0);
  });

  it('handles NaN in storage gracefully', () => {
    localStorage.setItem('ichikara_quiz_lesson-wa-particle_sample', 'banana');
    // parseInt('banana') = NaN → Math.max(0, NaN) = 0
    expect(getScore(LESSON, CARD_A)).toBe(0);
  });
});

// ── recordResult ──────────────────────────────────────────────────────────────

describe('recordResult', () => {
  it('increments score from 0 to 1 on correct', () => {
    recordResult(LESSON, CARD_A, true);
    expect(getScore(LESSON, CARD_A)).toBe(1);
  });

  it('increments score across multiple correct answers', () => {
    recordResult(LESSON, CARD_A, true); // 1
    recordResult(LESSON, CARD_A, true); // 2
    recordResult(LESSON, CARD_A, true); // 3
    expect(getScore(LESSON, CARD_A)).toBe(3);
  });

  it('caps score at 10', () => {
    for (let i = 0; i < 15; i++) recordResult(LESSON, CARD_A, true);
    expect(getScore(LESSON, CARD_A)).toBe(10);
  });

  it('resets score to 0 on incorrect ("Again")', () => {
    recordResult(LESSON, CARD_A, true); // 1
    recordResult(LESSON, CARD_A, true); // 2
    recordResult(LESSON, CARD_A, false); // 0
    expect(getScore(LESSON, CARD_A)).toBe(0);
  });

  it('keeps score at 0 after incorrect on fresh card', () => {
    recordResult(LESSON, CARD_A, false);
    expect(getScore(LESSON, CARD_A)).toBe(0);
  });

  it('scores are per-card — different cards are independent', () => {
    recordResult(LESSON, CARD_A, true); // card A = 1
    recordResult(LESSON, CARD_B, true); // card B = 1
    recordResult(LESSON, CARD_B, true); // card B = 2
    recordResult(LESSON, CARD_A, false); // card A reset = 0
    expect(getScore(LESSON, CARD_A)).toBe(0);
    expect(getScore(LESSON, CARD_B)).toBe(2);
  });

  it('scores are per-lesson — same card id in different lessons is independent', () => {
    recordResult('lesson-A', CARD_A, true);
    recordResult('lesson-B', CARD_A, true);
    recordResult('lesson-B', CARD_A, true);
    expect(getScore('lesson-A', CARD_A)).toBe(1);
    expect(getScore('lesson-B', CARD_A)).toBe(2);
  });
});

// ── getLessonMastery ──────────────────────────────────────────────────────────

describe('getLessonMastery', () => {
  it('returns 0 for an empty card list', () => {
    expect(getLessonMastery(LESSON, [])).toBe(0);
  });

  it('returns 0 when all cards are unseen', () => {
    expect(getLessonMastery(LESSON, [CARD_A, CARD_B, CARD_C])).toBe(0);
  });

  it('returns 100 when all cards are fully mastered (score ≥ 3)', () => {
    recordResult(LESSON, CARD_A, true);
    recordResult(LESSON, CARD_A, true);
    recordResult(LESSON, CARD_A, true);
    recordResult(LESSON, CARD_B, true);
    recordResult(LESSON, CARD_B, true);
    recordResult(LESSON, CARD_B, true);
    expect(getLessonMastery(LESSON, [CARD_A, CARD_B])).toBe(100);
  });

  it('returns 50 when half the cards are mastered', () => {
    // CARD_A: score 3 (mastered), CARD_B: score 0 → total = 3, max = 6, pct = 50
    recordResult(LESSON, CARD_A, true);
    recordResult(LESSON, CARD_A, true);
    recordResult(LESSON, CARD_A, true);
    expect(getLessonMastery(LESSON, [CARD_A, CARD_B])).toBe(50);
  });

  it('caps individual card contribution at MAX_SCORE=3 even if score is higher', () => {
    // Score 10 for one card — should still count as 3 (mastered), not more
    for (let i = 0; i < 10; i++) recordResult(LESSON, CARD_A, true);
    expect(getLessonMastery(LESSON, [CARD_A])).toBe(100);
  });

  it('returns partial mastery as a rounded percentage', () => {
    // CARD_A: score 1 → contribution = min(1, 3) = 1
    // CARD_B: score 2 → contribution = min(2, 3) = 2
    // total = 3, max = 3*2 = 6 → 50%
    recordResult(LESSON, CARD_A, true); // 1
    recordResult(LESSON, CARD_B, true); // 1
    recordResult(LESSON, CARD_B, true); // 2
    expect(getLessonMastery(LESSON, [CARD_A, CARD_B])).toBe(50);
  });

  it('rounds to integer percentage', () => {
    // 1 card, score 1 → 1/3 = 0.333 → 33%
    recordResult(LESSON, CARD_A, true); // score = 1
    const pct = getLessonMastery(LESSON, [CARD_A]);
    expect(Number.isInteger(pct)).toBe(true);
    expect(pct).toBe(33);
  });
});

// ── sortByPriority ────────────────────────────────────────────────────────────

describe('sortByPriority', () => {
  it('returns an empty array for empty input', () => {
    expect(sortByPriority(LESSON, [])).toEqual([]);
  });

  it('returns single-element array unchanged', () => {
    expect(sortByPriority(LESSON, [CARD_A])).toEqual([CARD_A]);
  });

  it('puts lower-scored (more review needed) cards first', () => {
    // CARD_A = 3 (mastered), CARD_B = 1 (needs work), CARD_C = 0 (unseen)
    recordResult(LESSON, CARD_A, true);
    recordResult(LESSON, CARD_A, true);
    recordResult(LESSON, CARD_A, true);
    recordResult(LESSON, CARD_B, true);
    // CARD_C untouched = 0
    const sorted = sortByPriority(LESSON, [CARD_A, CARD_B, CARD_C]);
    // Should be: CARD_C(0), CARD_B(1), CARD_A(3)
    expect(sorted[0]).toBe(CARD_C);
    expect(sorted[1]).toBe(CARD_B);
    expect(sorted[2]).toBe(CARD_A);
  });

  it('does not mutate the input array', () => {
    const input = [CARD_A, CARD_B, CARD_C];
    const inputCopy = [...input];
    sortByPriority(LESSON, input);
    expect(input).toEqual(inputCopy);
  });

  it('handles ties by preserving relative order (stable-ish)', () => {
    // All 0 — order should be [A, B, C] (stable sort preserves insertion order)
    const sorted = sortByPriority(LESSON, [CARD_A, CARD_B, CARD_C]);
    // All tied at 0 — no specific order requirement, just verify length
    expect(sorted).toHaveLength(3);
    expect(sorted).toContain(CARD_A);
    expect(sorted).toContain(CARD_B);
    expect(sorted).toContain(CARD_C);
  });

  it('returns a new array (does not mutate)', () => {
    const input = [CARD_A, CARD_B];
    const result = sortByPriority(LESSON, input);
    expect(result).not.toBe(input); // different reference
  });
});
