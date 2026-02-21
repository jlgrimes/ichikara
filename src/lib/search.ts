/**
 * Global search — lessons + SOS phrases
 *
 * Simple substring matching across all content fields.
 * Case-insensitive, accent-insensitive (normalised).
 */

import type { Lesson, SOSCategory } from '../types/language';

// ── Result types ──────────────────────────────────────────────────────────────

export interface LessonResult {
  kind: 'lesson';
  lesson: Lesson;
  /** Which field matched — used to highlight the snippet. */
  matchedField: 'title' | 'subtitle' | 'concept' | 'keyPoint';
  snippet: string;
}

export interface PhraseResult {
  kind: 'phrase';
  categoryId: string;
  categoryEmoji: string;
  categoryName: string;
  target: string;
  romaji?: string;
  english: string;
}

export type SearchResult = LessonResult | PhraseResult;

// ── Normalise ─────────────────────────────────────────────────────────────────

function norm(s: string): string {
  return s.toLowerCase().normalize('NFC');
}

function matches(haystack: string, needle: string): boolean {
  return norm(haystack).includes(norm(needle));
}

// ── Search ────────────────────────────────────────────────────────────────────

export interface SearchInput {
  query: string;
  lessons: Lesson[];
  sosCategories: SOSCategory[];
  maxResults?: number;
}

export function search({
  query,
  lessons,
  sosCategories,
  maxResults = 40,
}: SearchInput): SearchResult[] {
  const q = query.trim();
  if (!q) return [];

  const results: SearchResult[] = [];

  // ── Lessons ──────────────────────────────────────────────────────────────

  for (const lesson of lessons) {
    if (results.filter(r => r.kind === 'lesson').length >= maxResults / 2) break;

    if (matches(lesson.title, q)) {
      results.push({ kind: 'lesson', lesson, matchedField: 'title', snippet: lesson.title });
      continue;
    }
    if (matches(lesson.subtitle, q)) {
      results.push({ kind: 'lesson', lesson, matchedField: 'subtitle', snippet: lesson.subtitle });
      continue;
    }
    // Search key points
    const kp = lesson.keyPoints.find(k => matches(k, q));
    if (kp) {
      results.push({ kind: 'lesson', lesson, matchedField: 'keyPoint', snippet: kp });
      continue;
    }
    // Concept paragraph (lower priority)
    if (matches(lesson.concept, q)) {
      // Trim a relevant snippet around the match
      const idx = norm(lesson.concept).indexOf(norm(q));
      const start = Math.max(0, idx - 30);
      const snippet = (start > 0 ? '…' : '') + lesson.concept.slice(start, idx + q.length + 40).trim() + '…';
      results.push({ kind: 'lesson', lesson, matchedField: 'concept', snippet });
    }
  }

  // ── SOS phrases ───────────────────────────────────────────────────────────

  for (const cat of sosCategories) {
    for (const phrase of cat.phrases) {
      if (results.filter(r => r.kind === 'phrase').length >= maxResults / 2) break;

      if (
        matches(phrase.target, q) ||
        matches(phrase.english, q) ||
        (phrase.romaji && matches(phrase.romaji, q))
      ) {
        results.push({
          kind: 'phrase',
          categoryId: cat.id,
          categoryEmoji: cat.emoji,
          categoryName: cat.name,
          target: phrase.target,
          romaji: phrase.romaji,
          english: phrase.english,
        });
      }
    }
  }

  return results.slice(0, maxResults);
}
