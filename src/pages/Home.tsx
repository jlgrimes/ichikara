import { useCallback, useEffect, useRef, useState } from 'react';
import { Page, PageContent, useNavigation } from '../lib/ui';
import { LessonCard } from '../components/LessonCard';
import { useLanguage } from '../context/LanguageContext';
import { useProgress } from '../context/ProgressContext';
import { search, type PhraseResult } from '../lib/search';
import { isTTSAvailable, speak } from '../lib/tts';
import { getStartLevel } from '../hooks/useOnboarding';
import { LessonView } from './LessonView';
import { ParticlesView } from './ParticlesView';

const MODULE_LABELS: Record<number, string> = {
  0:  'Primitives',
  1:  'Particle Type System',
  2:  'Verb System',
  3:  'Adjectives',
  4:  'Extended Particles',
  5:  'Clauses & Nominalization',
  6:  'Relative Clauses',
  7:  'て-Auxiliaries',
  8:  'Potential & Passive',
  9:  'Giving & Receiving',
  10: 'Causative',
  11: 'Conditionals',
  12: 'Sentence-Final Particles',
  13: 'Change & Becoming',
  14: 'Formal Structures',
  15: 'Advanced Nuance',
};

const JLPT_GROUPS = [
  {
    level: 'N5', desc: 'Core building blocks',
    modules: [0, 1, 2, 3],
    pill: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    line: 'bg-emerald-100',
  },
  {
    level: 'N4', desc: 'Expanding structure',
    modules: [4, 5, 6, 7, 8, 9],
    pill: 'bg-blue-100 text-blue-700 border-blue-200',
    line: 'bg-blue-100',
  },
  {
    level: 'N3', desc: 'Complex grammar',
    modules: [10, 11, 12],
    pill: 'bg-purple-100 text-purple-700 border-purple-200',
    line: 'bg-purple-100',
  },
  {
    level: 'N2', desc: 'Advanced expressions',
    modules: [13, 14, 15],
    pill: 'bg-rose-100 text-rose-700 border-rose-200',
    line: 'bg-rose-100',
  },
];

export function Home() {
  const { push }     = useNavigation();
  const { language } = useLanguage();
  const { isComplete, completedCount } = useProgress();
  const CURRICULUM   = language.curriculum;
  const totalLessons = CURRICULUM.length;
  const pct          = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const startLevel   = getStartLevel(); // from onboarding self-assessment

  // ── Search state ────────────────────────────────────────────────────────────
  const [query, setQuery]               = useState('');
  const [fullscreenPhrase, setFullscreenPhrase] = useState<PhraseResult | null>(null);
  const [playingPhrase, setPlayingPhrase] = useState<string | null>(null); // target text
  const playTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef     = useRef<HTMLInputElement>(null);

  const results = query.trim()
    ? search({ query, lessons: CURRICULUM, sosCategories: language.sosCategories })
    : [];

  // Analytics — fire search event when query has results (debounced-ish: fires on render)
  useEffect(() => {
    if (!query.trim() || results.length === 0) return;
    const timer = setTimeout(() => {
      const lr = results.filter(r => r.kind === 'lesson').length;
      const pr = results.filter(r => r.kind === 'phrase').length;
      import('../lib/analytics').then(({ analytics }) =>
        analytics.searchPerformed(query.trim().length, lr, pr),
      );
    }, 800); // fire after user stops typing for 800ms
    return () => clearTimeout(timer);
  }, [query, results.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const lessonResults = results.filter(r => r.kind === 'lesson') as Extract<(typeof results)[0], { kind: 'lesson' }>[];
  const phraseResults = results.filter(r => r.kind === 'phrase') as PhraseResult[];

  const clearSearch = useCallback(() => {
    setQuery('');
    inputRef.current?.blur();
  }, []);

  // ── Play phrase audio ───────────────────────────────────────────────────────
  const playPhrase = useCallback((target: string) => {
    if (playTimerRef.current) clearTimeout(playTimerRef.current);
    setPlayingPhrase(target);
    speak(target, { lang: 'ja-JP', rate: 0.8 });
    const estimatedMs = Math.max(1500, target.length * 200);
    playTimerRef.current = setTimeout(() => setPlayingPhrase(null), estimatedMs);
  }, []);

  return (
    <Page>
      {/* Safe area fill */}
      <div
        className="shrink-0 bg-[var(--color-paper)]"
        style={{ height: 'env(safe-area-inset-top)' }}
      />

      <PageContent>
        <div className="max-w-4xl mx-auto px-4 space-y-8">

          {/* iOS 26 large title + progress summary */}
          <div className="pt-6 pb-0">
            <h1 className="text-[42px] font-black text-[var(--color-ink)] tracking-tight leading-none">
              一から
            </h1>
            <p className="text-sm text-gray-400 font-mono mt-1.5">from scratch</p>

            {/* Progress bar */}
            <div className="mt-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-gray-400">
                  {completedCount} / {totalLessons} lessons complete
                </span>
                {completedCount > 0 && (
                  <span className="text-xs font-mono text-[var(--color-accent)]">{pct}%</span>
                )}
              </div>
              <div className="h-1.5 bg-[var(--input-bg)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>

          {/* ── iOS-style search bar ─────────────────────────────────────── */}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-[var(--input-bg)] rounded-xl px-3 h-10">
              {/* Magnifier */}
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                ref={inputRef}
                type="search"
                inputMode="search"
                placeholder="Search lessons, phrases…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className={[
                  'flex-1 bg-transparent text-[15px] text-[var(--color-ink)]',
                  'placeholder:text-gray-400 outline-none',
                  'min-h-[36px]',
                ].join(' ')}
              />
              {query && (
                <button
                  onClick={clearSearch}
                  className="text-gray-400 dark:text-gray-500 active:text-gray-600 w-5 h-5 flex items-center justify-center rounded-full bg-[var(--input-bg)] shrink-0"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
            {query && (
              <button
                onClick={clearSearch}
                className="text-[var(--color-accent)] text-[15px] font-medium active:opacity-50 shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-end"
              >
                Cancel
              </button>
            )}
          </div>

          {/* ── Search results ──────────────────────────────────────────── */}
          {query.trim() ? (
            <div className="space-y-6 pb-8">
              {results.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-2xl mb-2">🔍</p>
                  <p className="text-sm text-gray-500">No results for "{query}"</p>
                  <p className="text-xs font-mono text-gray-300 mt-1">
                    Try a particle (は, が), verb form, or English word
                  </p>
                </div>
              ) : (
                <>
                  {/* Lesson results */}
                  {lessonResults.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                        Grammar Lessons — {lessonResults.length}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {lessonResults.map(r => (
                        <div key={r.lesson.id} className="space-y-1">
                          <LessonCard
                            lesson={r.lesson}
                            completed={isComplete(r.lesson.id)}
                            onClick={() => push(<LessonView lessonId={r.lesson.id} />)}
                          />
                          {r.matchedField !== 'title' && r.matchedField !== 'subtitle' && (
                            <p className="text-xs text-gray-400 font-mono px-2 truncate">
                              {r.snippet}
                            </p>
                          )}
                        </div>
                      ))}
                      </div>
                    </div>
                  )}

                  {/* SOS phrase results */}
                  {phraseResults.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                        SOS Phrases — {phraseResults.length}
                      </p>
                      {phraseResults.map((r, i) => (
                        <div
                          key={i}
                          className={[
                            'bg-[var(--surface-bg)] backdrop-blur-sm rounded-3xl border border-[var(--surface-border)]',
                            'shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-5',
                            'flex items-center gap-3',
                          ].join(' ')}
                        >
                          {/* Text — tappable for fullscreen */}
                          <button
                            onClick={() => setFullscreenPhrase(r)}
                            className="flex-1 text-left active:opacity-70 transition-opacity select-none"
                          >
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">
                                {r.categoryEmoji} {r.categoryName}
                              </span>
                            </div>
                            <p className="text-2xl font-black text-[var(--color-ink)] leading-snug mb-1">
                              {r.target}
                            </p>
                            {r.romaji && (
                              <p className="text-xs font-mono text-gray-400 mb-0.5">{r.romaji}</p>
                            )}
                            <p className="text-sm text-gray-600">{r.english}</p>
                          </button>

                          {/* Audio button */}
                          {isTTSAvailable() && (
                            <button
                              onClick={() => playPhrase(r.target)}
                              className={[
                                'w-9 h-9 rounded-full flex items-center justify-center',
                                'transition-all duration-150 select-none shrink-0',
                                playingPhrase === r.target
                                  ? 'bg-[var(--color-accent)] text-white'
                                  : 'bg-[var(--input-bg)] text-gray-400 active:opacity-70',
                              ].join(' ')}
                            >
                              <span className={playingPhrase === r.target ? 'text-base animate-pulse' : 'text-base'}>
                                🔊
                              </span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            /* ── Normal curriculum view ───────────────────────────────── */
            <div className="space-y-10 pb-4">
              {/* Particle system shortcut */}
              <button
                onClick={() => push(<ParticlesView />)}
                className={[
                  'w-full text-left rounded-3xl p-6',
                  'bg-[var(--color-ink)]',
                  'shadow-[0_4px_24px_rgba(26,26,46,0.18)]',
                  'active:scale-[0.97] active:opacity-90',
                  'transition-all duration-150 ease-out select-none',
                ].join(' ')}
              >
                <p className="text-[11px] font-mono text-white/50 mb-1.5 uppercase tracking-widest">
                  Core Reference
                </p>
                <h2 className="text-[19px] font-bold text-white leading-snug">
                  Particle Type System
                </h2>
                <p className="text-[13px] text-white/60 mt-1.5">
                  は　が　を　に　で　の — the skeleton of every sentence
                </p>
              </button>

              {/* Curriculum grouped by JLPT */}
              {JLPT_GROUPS.map(({ level, desc, modules, pill, line }) => {
                const hasLessons = modules.some(mod => CURRICULUM.some(l => l.module === mod));
                if (!hasLessons) return null;
                return (
                  <div key={level} className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className={`flex-1 h-px ${line}`} />
                      <div className="flex flex-col items-center">
                        <span className={`text-[11px] font-mono font-bold px-3 py-1 rounded-full border ${pill}`}>
                          JLPT {level}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono mt-0.5">{desc}</span>
                        {startLevel === level && (
                          <span className="text-[9px] font-mono text-[var(--color-accent)] uppercase tracking-widest mt-1">
                            ↑ your start
                          </span>
                        )}
                      </div>
                      <div className={`flex-1 h-px ${line}`} />
                    </div>
                    {modules.map(mod => {
                      const lessons = CURRICULUM.filter(l => l.module === mod);
                      if (lessons.length === 0) return null;
                      return (
                        <div key={mod} className="space-y-2">
                          <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                            Module {mod} — {MODULE_LABELS[mod]}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {lessons.map(lesson => (
                            <LessonCard
                              key={lesson.id}
                              lesson={lesson}
                              completed={isComplete(lesson.id)}
                              onClick={() => push(<LessonView lessonId={lesson.id} />)}
                            />
                          ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}

              <p className="text-xs text-center text-gray-300 font-mono">一から — from scratch</p>
            </div>
          )}
        </div>
      </PageContent>

      {/* ── Fullscreen phrase overlay (same as SOSDetail) ────────────── */}
      {fullscreenPhrase && (
        <div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[var(--color-ink)] px-8"
          onClick={() => setFullscreenPhrase(null)}
          style={{
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          <p className="text-[11px] font-mono text-white/30 uppercase tracking-widest mb-4">
            {fullscreenPhrase.categoryEmoji} {fullscreenPhrase.categoryName}
          </p>
          <p className="text-[11px] font-mono text-white/20 uppercase tracking-widest mb-12">
            tap anywhere to close
          </p>
          <p className="text-6xl font-black text-white text-center leading-tight mb-6">
            {fullscreenPhrase.target}
          </p>
          {fullscreenPhrase.romaji && (
            <p className="text-lg font-mono text-white/50 text-center mb-1">
              {fullscreenPhrase.romaji}
            </p>
          )}
          <p className="text-base text-white/40 text-center mb-10">
            {fullscreenPhrase.english}
          </p>

          {/* Audio button in fullscreen */}
          {isTTSAvailable() && (
            <button
              onClick={(e) => { e.stopPropagation(); playPhrase(fullscreenPhrase.target); }}
              className={[
                'w-16 h-16 rounded-full flex items-center justify-center',
                'transition-all duration-150 select-none active:scale-90',
                playingPhrase === fullscreenPhrase.target
                  ? 'bg-[var(--surface-solid)] text-[var(--color-ink)]'
                  : 'bg-white/20 text-white active:bg-white/30',
              ].join(' ')}
            >
              <span className={[
                'text-2xl',
                playingPhrase === fullscreenPhrase.target ? 'animate-pulse' : '',
              ].join(' ')}>🔊</span>
            </button>
          )}
        </div>
      )}
    </Page>
  );
}
