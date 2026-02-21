import type { LanguageMeta } from '../../types/language';
import type { LanguageBundle } from './japanese';
import { JAPANESE } from './japanese';

// ── Language registry ─────────────────────────────────────────────────────────
// Languages with available: true have full content.
// Others show as "coming soon" in the language selector.

export const LANGUAGE_META: LanguageMeta[] = [
  // ── Available ──────────────────────────────────────────────────────────────
  { id: 'japanese',    name: 'Japanese',    nativeName: '日本語',    flag: '🇯🇵', script: 'CJK',     available: true  },

  // ── Coming soon — roughly sorted by speaker count ─────────────────────────
  { id: 'mandarin',    name: 'Mandarin',    nativeName: '普通话',    flag: '🇨🇳', script: 'CJK',     available: false, comingSoon: true },
  { id: 'spanish',     name: 'Spanish',     nativeName: 'Español',   flag: '🇪🇸', script: 'Latin',   available: false, comingSoon: true },
  { id: 'hindi',       name: 'Hindi',       nativeName: 'हिन्दी',    flag: '🇮🇳', script: 'Devanagari', available: false, comingSoon: true },
  { id: 'arabic',      name: 'Arabic',      nativeName: 'العربية',   flag: '🇸🇦', script: 'Arabic',  available: false, comingSoon: true, rtl: true },
  { id: 'french',      name: 'French',      nativeName: 'Français',  flag: '🇫🇷', script: 'Latin',   available: false, comingSoon: true },
  { id: 'portuguese',  name: 'Portuguese',  nativeName: 'Português', flag: '🇧🇷', script: 'Latin',   available: false, comingSoon: true },
  { id: 'bengali',     name: 'Bengali',     nativeName: 'বাংলা',     flag: '🇧🇩', script: 'Bengali', available: false, comingSoon: true },
  { id: 'russian',     name: 'Russian',     nativeName: 'Русский',   flag: '🇷🇺', script: 'Cyrillic', available: false, comingSoon: true },
  { id: 'urdu',        name: 'Urdu',        nativeName: 'اردو',      flag: '🇵🇰', script: 'Arabic',  available: false, comingSoon: true, rtl: true },
  { id: 'indonesian',  name: 'Indonesian',  nativeName: 'Bahasa',    flag: '🇮🇩', script: 'Latin',   available: false, comingSoon: true },
  { id: 'german',      name: 'German',      nativeName: 'Deutsch',   flag: '🇩🇪', script: 'Latin',   available: false, comingSoon: true },
  { id: 'korean',      name: 'Korean',      nativeName: '한국어',     flag: '🇰🇷', script: 'Hangul',  available: false, comingSoon: true },
  { id: 'vietnamese',  name: 'Vietnamese',  nativeName: 'Tiếng Việt', flag: '🇻🇳', script: 'Latin',  available: false, comingSoon: true },
  { id: 'turkish',     name: 'Turkish',     nativeName: 'Türkçe',    flag: '🇹🇷', script: 'Latin',   available: false, comingSoon: true },
  { id: 'tamil',       name: 'Tamil',       nativeName: 'தமிழ்',     flag: '🇮🇳', script: 'Tamil',   available: false, comingSoon: true },
  { id: 'persian',     name: 'Persian',     nativeName: 'فارسی',     flag: '🇮🇷', script: 'Arabic',  available: false, comingSoon: true, rtl: true },
  { id: 'swahili',     name: 'Swahili',     nativeName: 'Kiswahili', flag: '🇰🇪', script: 'Latin',   available: false, comingSoon: true },
  { id: 'malay',       name: 'Malay',       nativeName: 'Bahasa Melayu', flag: '🇲🇾', script: 'Latin', available: false, comingSoon: true },
  { id: 'tagalog',     name: 'Tagalog',     nativeName: 'Filipino',  flag: '🇵🇭', script: 'Latin',   available: false, comingSoon: true },
  { id: 'thai',        name: 'Thai',        nativeName: 'ภาษาไทย',   flag: '🇹🇭', script: 'Thai',    available: false, comingSoon: true },
  { id: 'italian',     name: 'Italian',     nativeName: 'Italiano',  flag: '🇮🇹', script: 'Latin',   available: false, comingSoon: true },
  { id: 'polish',      name: 'Polish',      nativeName: 'Polski',    flag: '🇵🇱', script: 'Latin',   available: false, comingSoon: true },
  { id: 'ukrainian',   name: 'Ukrainian',   nativeName: 'Українська', flag: '🇺🇦', script: 'Cyrillic', available: false, comingSoon: true },
  { id: 'dutch',       name: 'Dutch',       nativeName: 'Nederlands', flag: '🇳🇱', script: 'Latin',  available: false, comingSoon: true },
  { id: 'greek',       name: 'Greek',       nativeName: 'Ελληνικά',  flag: '🇬🇷', script: 'Greek',   available: false, comingSoon: true },
  { id: 'romanian',    name: 'Romanian',    nativeName: 'Română',    flag: '🇷🇴', script: 'Latin',   available: false, comingSoon: true },
  { id: 'hebrew',      name: 'Hebrew',      nativeName: 'עברית',     flag: '🇮🇱', script: 'Hebrew',  available: false, comingSoon: true, rtl: true },
  { id: 'czech',       name: 'Czech',       nativeName: 'Čeština',   flag: '🇨🇿', script: 'Latin',   available: false, comingSoon: true },
  { id: 'hungarian',   name: 'Hungarian',   nativeName: 'Magyar',    flag: '🇭🇺', script: 'Latin',   available: false, comingSoon: true },
  { id: 'swedish',     name: 'Swedish',     nativeName: 'Svenska',   flag: '🇸🇪', script: 'Latin',   available: false, comingSoon: true },
  { id: 'catalan',     name: 'Catalan',     nativeName: 'Català',    flag: '🏴', script: 'Latin',    available: false, comingSoon: true },
  { id: 'norwegian',   name: 'Norwegian',   nativeName: 'Norsk',     flag: '🇳🇴', script: 'Latin',   available: false, comingSoon: true },
  { id: 'danish',      name: 'Danish',      nativeName: 'Dansk',     flag: '🇩🇰', script: 'Latin',   available: false, comingSoon: true },
  { id: 'finnish',     name: 'Finnish',     nativeName: 'Suomi',     flag: '🇫🇮', script: 'Latin',   available: false, comingSoon: true },
  { id: 'slovak',      name: 'Slovak',      nativeName: 'Slovenčina', flag: '🇸🇰', script: 'Latin',  available: false, comingSoon: true },
  { id: 'bulgarian',   name: 'Bulgarian',   nativeName: 'Български', flag: '🇧🇬', script: 'Cyrillic', available: false, comingSoon: true },
  { id: 'serbian',     name: 'Serbian',     nativeName: 'Српски',    flag: '🇷🇸', script: 'Cyrillic', available: false, comingSoon: true },
  { id: 'croatian',    name: 'Croatian',    nativeName: 'Hrvatski',  flag: '🇭🇷', script: 'Latin',   available: false, comingSoon: true },
  { id: 'lithuanian',  name: 'Lithuanian',  nativeName: 'Lietuvių',  flag: '🇱🇹', script: 'Latin',   available: false, comingSoon: true },
  { id: 'latvian',     name: 'Latvian',     nativeName: 'Latviešu',  flag: '🇱🇻', script: 'Latin',   available: false, comingSoon: true },
  { id: 'estonian',    name: 'Estonian',    nativeName: 'Eesti',     flag: '🇪🇪', script: 'Latin',   available: false, comingSoon: true },
  { id: 'slovenian',   name: 'Slovenian',   nativeName: 'Slovenščina', flag: '🇸🇮', script: 'Latin', available: false, comingSoon: true },
  { id: 'albanian',    name: 'Albanian',    nativeName: 'Shqip',     flag: '🇦🇱', script: 'Latin',   available: false, comingSoon: true },
  { id: 'macedonian',  name: 'Macedonian',  nativeName: 'Македонски', flag: '🇲🇰', script: 'Cyrillic', available: false, comingSoon: true },
  { id: 'bosnian',     name: 'Bosnian',     nativeName: 'Bosanski',  flag: '🇧🇦', script: 'Latin',   available: false, comingSoon: true },
  { id: 'icelandic',   name: 'Icelandic',   nativeName: 'Íslenska',  flag: '🇮🇸', script: 'Latin',   available: false, comingSoon: true },
  { id: 'welsh',       name: 'Welsh',       nativeName: 'Cymraeg',   flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', script: 'Latin', available: false, comingSoon: true },
  { id: 'irish',       name: 'Irish',       nativeName: 'Gaeilge',   flag: '🇮🇪', script: 'Latin',   available: false, comingSoon: true },
  { id: 'basque',      name: 'Basque',      nativeName: 'Euskara',   flag: '🏴', script: 'Latin',    available: false, comingSoon: true },
  { id: 'latin',       name: 'Latin',       nativeName: 'Latina',    flag: '🏛️', script: 'Latin',    available: false, comingSoon: true },
  { id: 'esperanto',   name: 'Esperanto',   nativeName: 'Esperanto', flag: '🟢', script: 'Latin',    available: false, comingSoon: true },
  { id: 'maltese',     name: 'Maltese',     nativeName: 'Malti',     flag: '🇲🇹', script: 'Latin',   available: false, comingSoon: true },
  { id: 'faroese',     name: 'Faroese',     nativeName: 'Føroyskt',  flag: '🇫🇴', script: 'Latin',   available: false, comingSoon: true },
  { id: 'georgian',    name: 'Georgian',    nativeName: 'ქართული',   flag: '🇬🇪', script: 'Georgian', available: false, comingSoon: true },
  { id: 'armenian',    name: 'Armenian',    nativeName: 'Հայerեն',   flag: '🇦🇲', script: 'Armenian', available: false, comingSoon: true },
  { id: 'azerbaijani', name: 'Azerbaijani', nativeName: 'Azərbaycan', flag: '🇦🇿', script: 'Latin',  available: false, comingSoon: true },
  { id: 'kazakh',      name: 'Kazakh',      nativeName: 'Қазақша',   flag: '🇰🇿', script: 'Cyrillic', available: false, comingSoon: true },
  { id: 'uzbek',       name: 'Uzbek',       nativeName: "O'zbek",    flag: '🇺🇿', script: 'Latin',   available: false, comingSoon: true },
  { id: 'mongolian',   name: 'Mongolian',   nativeName: 'Монгол',    flag: '🇲🇳', script: 'Cyrillic', available: false, comingSoon: true },
  { id: 'tibetan',     name: 'Tibetan',     nativeName: 'བོད་སྐད་',  flag: '🏔️', script: 'Tibetan',  available: false, comingSoon: true },
  { id: 'nepali',      name: 'Nepali',      nativeName: 'नेपाली',    flag: '🇳🇵', script: 'Devanagari', available: false, comingSoon: true },
  { id: 'sinhala',     name: 'Sinhala',     nativeName: 'සිංහල',     flag: '🇱🇰', script: 'Sinhala', available: false, comingSoon: true },
  { id: 'burmese',     name: 'Burmese',     nativeName: 'ဗမာ',       flag: '🇲🇲', script: 'Myanmar', available: false, comingSoon: true },
  { id: 'khmer',       name: 'Khmer',       nativeName: 'ខ្មែរ',     flag: '🇰🇭', script: 'Khmer',   available: false, comingSoon: true },
  { id: 'lao',         name: 'Lao',         nativeName: 'ລາວ',       flag: '🇱🇦', script: 'Lao',     available: false, comingSoon: true },
  { id: 'amharic',     name: 'Amharic',     nativeName: 'አማርኛ',     flag: '🇪🇹', script: 'Ethiopic', available: false, comingSoon: true },
  { id: 'yoruba',      name: 'Yoruba',      nativeName: 'Yorùbá',    flag: '🇳🇬', script: 'Latin',   available: false, comingSoon: true },
  { id: 'igbo',        name: 'Igbo',        nativeName: 'Igbo',      flag: '🇳🇬', script: 'Latin',   available: false, comingSoon: true },
  { id: 'hausa',       name: 'Hausa',       nativeName: 'Hausa',     flag: '🇳🇬', script: 'Latin',   available: false, comingSoon: true },
  { id: 'zulu',        name: 'Zulu',        nativeName: 'isiZulu',   flag: '🇿🇦', script: 'Latin',   available: false, comingSoon: true },
  { id: 'xhosa',       name: 'Xhosa',       nativeName: 'isiXhosa',  flag: '🇿🇦', script: 'Latin',   available: false, comingSoon: true },
  { id: 'afrikaans',   name: 'Afrikaans',   nativeName: 'Afrikaans', flag: '🇿🇦', script: 'Latin',   available: false, comingSoon: true },
  { id: 'quechua',     name: 'Quechua',     nativeName: 'Runasimi',  flag: '🇵🇪', script: 'Latin',   available: false, comingSoon: true },
];

// ── Content loader ────────────────────────────────────────────────────────────
// Available language bundles. Add imports here as languages are built.

const AVAILABLE_CONTENT: Record<string, LanguageBundle> = {
  japanese: JAPANESE,
};

export function getLanguageContent(id: string): LanguageBundle | null {
  return AVAILABLE_CONTENT[id] ?? null;
}

export function getLanguageMeta(id: string): LanguageMeta | undefined {
  return LANGUAGE_META.find(l => l.id === id);
}
