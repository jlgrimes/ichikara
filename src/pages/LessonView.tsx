import { useEffect, useMemo } from 'react';
import { Navbar, Page, PageContent, ErrorState, useNavigation } from '../lib/ui';
import { ConceptHero } from '../components/ConceptHero';
import { useLanguage } from '../context/LanguageContext';
import { useProgress } from '../context/ProgressContext';
import { useBookmarks } from '../context/BookmarkContext';
import { getLessonMastery } from '../lib/quiz';
import { hapticMedium, hapticSuccess } from '../lib/haptics';
import { QuizView } from './QuizView';

interface LessonViewProps {
  lessonId: string;
}

/** Mirror of buildCards in QuizView — just need the IDs for mastery calc. */
function getCardIds(lesson: { id: string; sample: unknown; sections?: unknown[] }): string[] {
  const ids = ['sample'];
  if (lesson.sections) {
    lesson.sections.forEach((_, i) => ids.push(`section-${i}`));
  }
  return ids;
}

export function LessonView({ lessonId }: LessonViewProps) {
  const { push }               = useNavigation();
  const { language }           = useLanguage();
  const { isComplete, markComplete, markIncomplete } = useProgress();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const lesson      = language.curriculum.find((l) => l.id === lessonId);
  const completed   = isComplete(lessonId);
  const bookmarked  = isBookmarked('lesson', lessonId);

  const cardIds = useMemo(() => (lesson ? getCardIds(lesson) : []), [lesson]);
  const mastery = useMemo(() => getLessonMastery(lessonId, cardIds), [lessonId, cardIds]);

  // Analytics — fire on mount
  useEffect(() => {
    if (!lesson) return;
    import('../lib/analytics').then(({ analytics }) =>
      analytics.lessonOpened(lesson.id, lesson.module, lesson.title),
    );
  }, [lesson?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!lesson) {
    return (
      <Page>
        <Navbar title="Lesson" />
        <PageContent>
          <ErrorState
            title="Lesson not found"
            message="This lesson may have been removed or the link is invalid."
          />
        </PageContent>
      </Page>
    );
  }

  return (
    <Page>
      <Navbar
        title={`Module ${lesson.module}`}
        right={
          <button
            onClick={() => { hapticMedium(); toggleBookmark('lesson', lessonId); }}
            className="min-h-[44px] min-w-[44px] flex items-center justify-end text-xl active:opacity-40 transition-opacity"
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark lesson'}
          >
            <span className={bookmarked ? 'text-[var(--color-accent)]' : 'text-gray-300 dark:text-gray-600'}>
              {bookmarked ? '★' : '☆'}
            </span>
          </button>
        }
      />

      <PageContent>
        {/* Big hero */}
        <ConceptHero
          target={lesson.sample.target}
          highlightedTerm={lesson.sample.highlightedTerm}
          literal={lesson.sample.literal}
          natural={lesson.sample.natural}
        />

        <div className="max-w-2xl mx-auto px-4 pb-16 space-y-6">

          {/* Title */}
          <div>
            <h1 className="text-2xl font-black text-[var(--color-ink)] mb-0.5">{lesson.title}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{lesson.subtitle}</p>
          </div>

          {/* Structural concept */}
          <div>
            <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">
              Structural Concept
            </p>
            <div className="bg-[var(--surface-solid)] rounded-2xl border border-[var(--surface-border)] p-5 shadow-sm">
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{lesson.concept}</p>
            </div>
          </div>

          {/* Sections with mini-heroes OR flat key points */}
          {lesson.sections && lesson.sections.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {lesson.sections.map((section, i) => (
                <div key={i} className={i > 0 ? 'pt-6' : ''}>
                  <ConceptHero
                    target={section.sample.target}
                    highlightedTerm={section.sample.highlightedTerm}
                    literal={section.sample.literal}
                    natural={section.sample.natural}
                    size="section"
                  />
                  <ul className="space-y-2 mt-2">
                    {section.points.map((point, j) => (
                      <li key={j} className="flex gap-3 items-start">
                        <span className="text-[var(--color-accent)] font-bold mt-0.5 shrink-0">→</span>
                        <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">Key Points</p>
              <ul className="space-y-3">
                {lesson.keyPoints.map((point, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="text-[var(--color-accent)] font-bold mt-0.5 shrink-0">→</span>
                    <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Mark Complete ─────────────────────────────────────────── */}
          <div>
            <button
              onClick={() => {
                if (completed) {
                  hapticMedium();
                  markIncomplete(lessonId);
                  import('../lib/analytics').then(({ analytics }) => analytics.lessonUnmarked(lessonId));
                } else {
                  hapticSuccess();
                  markComplete(lessonId);
                  import('../lib/analytics').then(({ analytics }) => analytics.lessonCompleted(lessonId, lesson.module));
                }
              }}
              className={[
                'w-full rounded-2xl p-4 flex items-center justify-between gap-4',
                'border-2 transition-all duration-200 ease-out select-none',
                completed
                  ? 'bg-emerald-50 border-emerald-200 active:bg-emerald-100'
                  : 'bg-[var(--surface-solid)] border-[var(--surface-border)] active:bg-[var(--surface-active)]',
              ].join(' ')}
            >
              <div className="flex items-center gap-3">
                <div className={[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all',
                  completed ? 'bg-emerald-500 text-white' : 'bg-[var(--input-bg)] text-gray-400',
                ].join(' ')}>
                  ✓
                </div>
                <div className="text-left">
                  <p className={[
                    'text-sm font-semibold transition-colors',
                    completed ? 'text-emerald-700' : 'text-[var(--color-ink)]',
                  ].join(' ')}>
                    {completed ? 'Lesson complete' : 'Mark as complete'}
                  </p>
                  <p className="text-xs text-gray-400 font-mono">
                    {completed ? 'tap to undo' : 'track your progress'}
                  </p>
                </div>
              </div>
              {completed && (
                <span className="text-[11px] font-mono text-emerald-500 uppercase tracking-widest shrink-0">
                  Done
                </span>
              )}
            </button>
          </div>

          {/* ── Practice / Quiz ───────────────────────────────────────── */}
          <div className="pt-2">
            <button
              onClick={() => push(<QuizView lessonId={lesson.id} />)}
              className={[
                'w-full rounded-2xl p-5 text-left',
                'bg-[var(--color-ink)]',
                'shadow-[0_4px_24px_rgba(26,26,46,0.15)]',
                'active:scale-[0.97] active:opacity-90',
                'transition-all duration-150 ease-out select-none',
              ].join(' ')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-mono text-white/50 mb-1 uppercase tracking-widest">
                    Flashcard Practice
                  </p>
                  <p className="text-base font-bold text-white">
                    Practice this lesson
                  </p>
                  <p className="text-xs text-white/50 mt-0.5">
                    {cardIds.length} card{cardIds.length !== 1 ? 's' : ''} · spaced repetition
                  </p>
                </div>
                <div className="text-right">
                  {mastery > 0 ? (
                    <>
                      <p className="text-2xl font-black text-white">{mastery}%</p>
                      <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">mastered</p>
                    </>
                  ) : (
                    <p className="text-3xl text-white/60">→</p>
                  )}
                </div>
              </div>
            </button>
          </div>
        </div>
      </PageContent>
    </Page>
  );
}
