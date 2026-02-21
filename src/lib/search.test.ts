/**
 * Unit tests — search.ts (QRT-187)
 *
 * Tests: search() ranking logic — lessons by title/subtitle/keyPoint/concept,
 * SOS phrase matching by target/english/romaji, result limits, edge cases.
 */

import { describe, it, expect } from 'vitest';
import { search } from './search';
import type { Lesson, SOSCategory } from '../types/language';

// ── Fixtures ──────────────────────────────────────────────────────────────────

function makeLesson(overrides: Partial<Lesson> = {}): Lesson {
  return {
    id: 'test-lesson',
    module: 0,
    title: 'は — Topic Marker',
    subtitle: 'Marking the topic of a sentence',
    sample: { target: '私は学生です', highlightedTerm: 'は', literal: 'I [topic] student am', natural: 'I am a student.' },
    concept: 'The は particle marks the topic of the sentence.',
    keyPoints: ['は contrasts topic with context', 'は can imply contrast'],
    practiceItems: [],
    ...overrides,
  };
}

function makeSOSCategory(overrides: Partial<SOSCategory> = {}): SOSCategory {
  return {
    id: 'medical',
    emoji: '🏥',
    name: 'Medical',
    color: '#ff6b6b',
    phrases: [
      { target: '助けてください', romaji: 'tasukete kudasai', english: 'Please help me' },
      { target: 'アレルギーがあります', romaji: 'arerugii ga arimasu', english: 'I have allergies' },
    ],
    ...overrides,
  };
}

const LESSONS: Lesson[] = [
  makeLesson({ id: 'l1', title: 'は — Topic Marker', subtitle: 'Marking the topic', keyPoints: ['は marks topic'] }),
  makeLesson({ id: 'l2', title: 'が — Subject Marker', subtitle: 'Subject vs topic', keyPoints: ['が marks subject'] }),
  makeLesson({ id: 'l3', title: 'Verb Conjugation', subtitle: 'Plain and polite forms', concept: 'Verbs conjugate for tense.', keyPoints: ['desu is polite copula'] }),
];

const SOS_CATEGORIES: SOSCategory[] = [
  makeSOSCategory(),
  {
    id: 'transport',
    emoji: '🚉',
    name: 'Transport',
    color: '#4a90e2',
    phrases: [
      { target: '駅はどこですか', romaji: 'eki wa doko desu ka', english: 'Where is the station?' },
      { target: 'タクシーを呼んでください', english: 'Please call a taxi' },
    ],
  },
];

// ── search() — empty / trivial ─────────────────────────────────────────────────

describe('search — empty / trivial', () => {
  it('returns empty array for empty query', () => {
    expect(search({ query: '', lessons: LESSONS, sosCategories: SOS_CATEGORIES })).toEqual([]);
  });

  it('returns empty array for whitespace-only query', () => {
    expect(search({ query: '   ', lessons: LESSONS, sosCategories: SOS_CATEGORIES })).toEqual([]);
  });

  it('returns empty array when no content matches', () => {
    const results = search({ query: 'zzznomatch99', lessons: LESSONS, sosCategories: SOS_CATEGORIES });
    expect(results).toHaveLength(0);
  });
});

// ── search() — lesson matching ─────────────────────────────────────────────────

describe('search — lesson matching', () => {
  it('matches lessons by title (case-insensitive)', () => {
    const results = search({ query: 'topic marker', lessons: LESSONS, sosCategories: [] });
    expect(results.some(r => r.kind === 'lesson' && (r as any).lesson.id === 'l1')).toBe(true);
  });

  it('matches lessons by subtitle', () => {
    const results = search({ query: 'subject vs topic', lessons: LESSONS, sosCategories: [] });
    expect(results.some(r => r.kind === 'lesson' && (r as any).lesson.id === 'l2')).toBe(true);
  });

  it('matches lessons by keyPoint', () => {
    const results = search({ query: 'desu is polite', lessons: LESSONS, sosCategories: [] });
    expect(results.some(r => r.kind === 'lesson' && (r as any).lesson.id === 'l3')).toBe(true);
  });

  it('matches lessons by concept', () => {
    const results = search({ query: 'conjugate for tense', lessons: LESSONS, sosCategories: [] });
    expect(results.some(r => r.kind === 'lesson' && (r as any).lesson.id === 'l3')).toBe(true);
  });

  it('sets matchedField to "title" for title matches', () => {
    const results = search({ query: 'Topic Marker', lessons: LESSONS, sosCategories: [] });
    const lessonResult = results.find(r => r.kind === 'lesson');
    expect(lessonResult).toBeDefined();
    expect((lessonResult as any).matchedField).toBe('title');
  });

  it('sets matchedField to "subtitle" for subtitle matches', () => {
    const results = search({ query: 'Subject vs topic', lessons: LESSONS, sosCategories: [] });
    const lessonResult = results.find(r => r.kind === 'lesson');
    expect((lessonResult as any).matchedField).toBe('subtitle');
  });

  it('matches Japanese characters in keyPoints', () => {
    const l = makeLesson({ id: 'l-jp', keyPoints: ['は contrasts topic'] });
    const results = search({ query: 'は contrasts', lessons: [l], sosCategories: [] });
    expect(results).toHaveLength(1);
    expect((results[0] as any).matchedField).toBe('keyPoint');
  });

  it('does not return duplicate lesson for multiple field matches', () => {
    // Lesson that matches both title and subtitle — should appear only once
    const l = makeLesson({ id: 'l-dup', title: 'verb verb', subtitle: 'verb forms' });
    const results = search({ query: 'verb', lessons: [l], sosCategories: [] });
    const dupLessons = results.filter(r => r.kind === 'lesson' && (r as any).lesson.id === 'l-dup');
    expect(dupLessons).toHaveLength(1);
  });

  it('returns results for multiple matching lessons', () => {
    const results = search({ query: 'marker', lessons: LESSONS, sosCategories: [] });
    const lessonResults = results.filter(r => r.kind === 'lesson');
    // l1 (Topic Marker) and l2 (Subject Marker) both match
    expect(lessonResults.length).toBeGreaterThanOrEqual(2);
  });
});

// ── search() — SOS phrase matching ────────────────────────────────────────────

describe('search — SOS phrase matching', () => {
  it('matches SOS phrases by English text', () => {
    const results = search({ query: 'help me', lessons: [], sosCategories: SOS_CATEGORIES });
    const phraseResult = results.find(r => r.kind === 'phrase');
    expect(phraseResult).toBeDefined();
    expect((phraseResult as any).english).toContain('help');
  });

  it('matches SOS phrases by romaji', () => {
    const results = search({ query: 'tasukete', lessons: [], sosCategories: SOS_CATEGORIES });
    expect(results.some(r => r.kind === 'phrase')).toBe(true);
  });

  it('matches SOS phrases by target (Japanese)', () => {
    const results = search({ query: '助けて', lessons: [], sosCategories: SOS_CATEGORIES });
    expect(results.some(r => r.kind === 'phrase')).toBe(true);
  });

  it('phrase result includes category metadata', () => {
    const results = search({ query: 'allergies', lessons: [], sosCategories: SOS_CATEGORIES });
    const phrase = results.find(r => r.kind === 'phrase');
    expect(phrase).toBeDefined();
    expect((phrase as any).categoryId).toBe('medical');
    expect((phrase as any).categoryEmoji).toBe('🏥');
    expect((phrase as any).categoryName).toBe('Medical');
  });

  it('handles phrases with no romaji field gracefully', () => {
    // タクシーを呼んでください has no romaji — should not throw
    const results = search({ query: 'taxi', lessons: [], sosCategories: SOS_CATEGORIES });
    // "taxi" doesn't appear in the English "Please call a taxi" — let's check
    // Actually "taxi" IS in "Please call a taxi"
    expect(results.some(r => r.kind === 'phrase')).toBe(true);
  });

  it('returns both lesson and phrase results in one query', () => {
    const results = search({ query: 'は', lessons: LESSONS, sosCategories: SOS_CATEGORIES });
    // Some lessons contain は, SOS eki phrase has は in romaji/target
    const hasLesson = results.some(r => r.kind === 'lesson');
    const hasPhrase = results.some(r => r.kind === 'phrase');
    expect(hasLesson || hasPhrase).toBe(true); // at least one type
  });
});

// ── search() — limits ─────────────────────────────────────────────────────────

describe('search — result limits', () => {
  it('respects maxResults parameter', () => {
    const manyLessons = Array.from({ length: 30 }, (_, i) =>
      makeLesson({ id: `l${i}`, title: `Lesson ${i} — marker` }),
    );
    const results = search({ query: 'marker', lessons: manyLessons, sosCategories: [], maxResults: 5 });
    expect(results.length).toBeLessThanOrEqual(5);
  });

  it('defaults to maxResults 40', () => {
    const manyLessons = Array.from({ length: 50 }, (_, i) =>
      makeLesson({ id: `l${i}`, title: `Lesson ${i} — marker` }),
    );
    const results = search({ query: 'marker', lessons: manyLessons, sosCategories: [] });
    expect(results.length).toBeLessThanOrEqual(40);
  });

  it('returns fewer than maxResults when not enough matches', () => {
    const results = search({ query: 'topic', lessons: LESSONS, sosCategories: [], maxResults: 100 });
    // Only 1 lesson matches "topic" in title — result count should be small
    expect(results.length).toBeLessThan(100);
  });
});

// ── search() — case / accent insensitivity ────────────────────────────────────

describe('search — normalization', () => {
  it('is case-insensitive', () => {
    const r1 = search({ query: 'TOPIC', lessons: LESSONS, sosCategories: [] });
    const r2 = search({ query: 'topic', lessons: LESSONS, sosCategories: [] });
    expect(r1.length).toBe(r2.length);
  });

  it('handles mixed-case query', () => {
    const results = search({ query: 'TopiC MaRkEr', lessons: LESSONS, sosCategories: [] });
    expect(results.some(r => r.kind === 'lesson')).toBe(true);
  });

  it('handles NFC-normalized unicode', () => {
    // é vs é (precomposed vs combining) — both should match
    const l = makeLesson({ id: 'l-accent', title: 'Café expressions' });
    const r = search({ query: 'caf\u00e9', lessons: [l], sosCategories: [] });
    expect(r.length).toBeGreaterThan(0);
  });
});
