import { useCallback, useRef, useState } from 'react';
import { Page, PageContent, Skeleton, useNavigation } from '../lib/ui';
import { LessonCard } from '../components/LessonCard';
import { useLanguage } from '../context/LanguageContext';
import { useProgress } from '../context/ProgressContext';
import { useBookmarks } from '../context/BookmarkContext';
import { isTTSAvailable, speak, stopSpeaking } from '../lib/tts';
import { LessonView } from './LessonView';

// ── Fullscreen overlay (shared SOS pattern) ───────────────────────────────────

interface FullscreenPhrase {
  target: string;
  romaji?: string;
  english: string;
}

// ── Main view ─────────────────────────────────────────────────────────────────

export function SavedView() {
  const { push }       = useNavigation();
  const { language }   = useLanguage();
  const { isComplete } = useProgress();
  const { lessonBookmarks, phraseBookmarks, loading } = useBookmarks();

  const [fullscreen, setFullscreen]     = useState<FullscreenPhrase | null>(null);
  const [playingTarget, setPlayingTarget] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Resolve lesson bookmarks ───────────────────────────────────────────────
  const savedLessons = lessonBookmarks
    .map(b => language.curriculum.find(l => l.id === b.id))
    .filter(Boolean) as typeof language.curriculum;

  // ── Resolve phrase bookmarks ───────────────────────────────────────────────
  // id format: 'categoryId:phraseIndex'
  const savedPhrases = phraseBookmarks.map(b => {
    const [catId, idxStr] = b.id.split(':');
    const idx = parseInt(idxStr, 10);
    const cat = language.sosCategories.find(c => c.id === catId);
    if (!cat) return null;
    const phrase = cat.phrases[idx];
    if (!phrase) return null;
    return { ...phrase, categoryId: cat.id, categoryEmoji: cat.emoji, categoryName: cat.name, bookmarkId: b.id };
  }).filter(Boolean) as Array<{
    target: string; romaji?: string; english: string;
    categoryId: string; categoryEmoji: string; categoryName: string; bookmarkId: string;
  }>;

  // ── Audio ─────────────────────────────────────────────────────────────────
  const playPhrase = useCallback((target: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPlayingTarget(target);
    speak(target, { lang: 'ja-JP', rate: 0.8 });
    timerRef.current = setTimeout(() => setPlayingTarget(null), Math.max(1500, target.length * 200));
  }, []);

  const isEmpty = savedLessons.length === 0 && savedPhrases.length === 0;

  return (
    <Page>
      {/* Safe area fill */}
      <div className="shrink-0 bg-[var(--color-paper)]" style={{ height: 'env(safe-area-inset-top)' }} />

      <PageContent>
        <div className="max-w-4xl mx-auto px-4 space-y-8">

          {/* Large title */}
          <div className="pt-6 pb-2">
            <h1 className="text-[42px] font-black text-[var(--color-ink)] tracking-tight leading-none">
              Saved
            </h1>
            <p className="text-sm text-gray-400 dark:text-gray-500 font-mono mt-1.5">
              lessons &amp; phrases
            </p>
          </div>

          {/* Loading skeletons */}
          {loading && (
            <div className="space-y-8">
              <div className="space-y-3">
                <Skeleton.Line width={80} height={10} className="opacity-50" />
                <Skeleton.LessonGrid count={4} />
              </div>
              <div className="space-y-3">
                <Skeleton.Line width={100} height={10} className="opacity-50" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[1,2,3].map(i => <Skeleton.PhraseCard key={i} />)}
                </div>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && isEmpty && (
            <div className="text-center py-16 space-y-3">
              <p className="text-4xl">★</p>
              <p className="text-lg font-bold text-[var(--color-ink)]">Nothing saved yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Tap ★ on any lesson or phrase to save it here.
              </p>
            </div>
          )}

          {/* Saved lessons */}
          {savedLessons.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                Lessons — {savedLessons.length}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {savedLessons.map(lesson => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    completed={isComplete(lesson.id)}
                    onClick={() => push(<LessonView lessonId={lesson.id} />)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Saved phrases */}
          {savedPhrases.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                SOS Phrases — {savedPhrases.length}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {savedPhrases.map(p => (
                  <div
                    key={p.bookmarkId}
                    className="bg-[var(--surface-bg)] backdrop-blur-sm rounded-3xl border border-[var(--surface-border)] shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-5 flex items-center gap-3"
                  >
                    {/* Text — tap for fullscreen */}
                    <button
                      onClick={() => setFullscreen(p)}
                      className="flex-1 text-left active:opacity-70 transition-opacity select-none"
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-[11px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                          {p.categoryEmoji} {p.categoryName}
                        </span>
                      </div>
                      <p className="text-2xl font-black text-[var(--color-ink)] leading-snug mb-1">
                        {p.target}
                      </p>
                      {p.romaji && (
                        <p className="text-xs font-mono text-gray-400 dark:text-gray-500 mb-0.5">{p.romaji}</p>
                      )}
                      <p className="text-sm text-gray-600 dark:text-gray-400">{p.english}</p>
                    </button>

                    {/* Audio */}
                    {isTTSAvailable() && (
                      <button
                        onClick={() => playPhrase(p.target)}
                        className={[
                          'w-9 h-9 rounded-full flex items-center justify-center shrink-0',
                          'transition-all duration-150 select-none',
                          playingTarget === p.target
                            ? 'bg-[var(--color-accent)] text-white'
                            : 'bg-[var(--input-bg)] text-gray-400 active:opacity-70',
                        ].join(' ')}
                      >
                        <span className={playingTarget === p.target ? 'text-base animate-pulse' : 'text-base'}>🔊</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </PageContent>

      {/* Fullscreen overlay */}
      {fullscreen && (
        <div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[var(--color-ink)] px-8"
          onClick={() => { setFullscreen(null); stopSpeaking(); }}
          style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <p className="text-[11px] font-mono text-white/20 uppercase tracking-widest mb-12">tap anywhere to close</p>
          <p className="text-6xl font-black text-white text-center leading-tight mb-6">{fullscreen.target}</p>
          {fullscreen.romaji && (
            <p className="text-lg font-mono text-white/50 text-center mb-1">{fullscreen.romaji}</p>
          )}
          <p className="text-base text-white/40 text-center mb-10">{fullscreen.english}</p>
          {isTTSAvailable() && (
            <button
              onClick={e => { e.stopPropagation(); playPhrase(fullscreen.target); }}
              className={[
                'w-16 h-16 rounded-full flex items-center justify-center active:scale-90 transition-all',
                playingTarget === fullscreen.target
                  ? 'bg-[var(--surface-solid)] text-[var(--color-ink)]'
                  : 'bg-white/20 text-white active:bg-white/30',
              ].join(' ')}
            >
              <span className={playingTarget === fullscreen.target ? 'text-2xl animate-pulse' : 'text-2xl'}>🔊</span>
            </button>
          )}
        </div>
      )}
    </Page>
  );
}
