// ── Core content types (language-agnostic) ────────────────────────────────────

export interface TargetSample {
  target: string;           // The target-language text
  highlightedTerm: string;  // The specific term being highlighted
  literal: string;          // Literal/gloss translation
  natural: string;          // Natural English translation
}

export interface LessonSection {
  sample: TargetSample;
  points: string[];
}

export interface PracticeItem {
  type: 'identify' | 'build' | 'read';
  prompt: string;
  content: string;
}

export interface Lesson {
  id: string;
  module: number;
  title: string;
  subtitle: string;
  sample: TargetSample;
  concept: string;
  sections?: LessonSection[];
  keyPoints: string[];
  practiceItems: PracticeItem[];
}

export interface SOSPhrase {
  target: string;   // phrase in target language (shown large for pointing)
  romaji?: string;  // romanization (optional — not all languages need it)
  english: string;  // English meaning
}

export interface SOSCategory {
  id: string;
  emoji: string;
  name: string;
  color: string;
  phrases: SOSPhrase[];
}

// ── Language metadata ─────────────────────────────────────────────────────────

export interface LanguageMeta {
  id: string;          // 'japanese', 'spanish', 'korean', etc.
  name: string;        // 'Japanese'
  nativeName: string;  // '日本語'
  flag: string;        // '🇯🇵'
  script: string;      // 'CJK', 'Latin', 'Arabic', 'Hangul', etc.
  rtl?: boolean;       // right-to-left script
  available: boolean;  // content is ready to use
  comingSoon?: boolean; // show "coming soon" instead of disabled
}

// ── Full language bundle ──────────────────────────────────────────────────────

export interface LanguageContent {
  meta: LanguageMeta;
  curriculum: Lesson[];
  sosCategories: SOSCategory[];
  // Optional language-specific reference sheet (like Japanese particle system)
  referenceSheet?: {
    title: string;
    description: string;
    entries: ReferenceEntry[];
  };
}

export interface ReferenceEntry {
  symbol: string;
  name: string;
  role: string;
  examples: Array<{ sentence: string; translation: string }>;
}
