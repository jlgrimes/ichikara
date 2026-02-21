import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Navbar, Page, PageContent, Button, useNavigation } from '../lib/ui';
import { useLanguage } from '../context/LanguageContext';
import { getLessonMastery, recordResult, sortByPriority } from '../lib/quiz';
import { hapticSuccess, hapticWarning } from '../lib/haptics';
import type { Lesson, TargetSample } from '../types/language';

// ── Card data ─────────────────────────────────────────────────────────────────

interface QuizCard {
  id: string;
  front: TargetSample;
  /** One crisp insight shown on the back, beneath the translation. */
  insight: string;
}

function buildCards(lesson: Lesson): QuizCard[] {
  const cards: QuizCard[] = [];

  // Main sample sentence
  cards.push({
    id: 'sample',
    front: lesson.sample,
    insight: lesson.keyPoints[0] ?? '',
  });

  // One card per section (lessons with sections have rich multi-part content)
  if (lesson.sections) {
    lesson.sections.forEach((section, i) => {
      cards.push({
        id: `section-${i}`,
        front: section.sample,
        insight: section.points[0] ?? '',
      });
    });
  }

  return cards;
}

// ── Highlighted Japanese text ─────────────────────────────────────────────────

function HighlightedJapanese({
  target,
  highlightedTerm,
  size = 'large',
}: {
  target: string;
  highlightedTerm: string;
  size?: 'large' | 'medium';
}) {
  const idx = target.indexOf(highlightedTerm);
  const before = idx >= 0 ? target.slice(0, idx) : target;
  const after = idx >= 0 ? target.slice(idx + highlightedTerm.length) : '';
  const found = idx >= 0;

  const cls =
    size === 'large'
      ? 'text-5xl font-black text-[var(--color-ink)] leading-tight tracking-wide'
      : 'text-3xl font-black text-[var(--color-ink)] leading-tight tracking-wide';

  return (
    <p className={cls}>
      {before}
      {found && (
        <span className="text-[var(--color-accent)] relative">
          {highlightedTerm}
          <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-[var(--color-accent)] opacity-40 rounded-full" />
        </span>
      )}
      {after}
    </p>
  );
}

// ── Progress dots ─────────────────────────────────────────────────────────────

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex justify-center gap-1.5 py-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={[
            'rounded-full transition-all duration-200',
            i === current
              ? 'w-4 h-2 bg-[var(--color-accent)]'
              : i < current
              ? 'w-2 h-2 bg-[var(--color-accent)] opacity-30'
              : 'w-2 h-2 bg-gray-200',
          ].join(' ')}
        />
      ))}
    </div>
  );
}

// ── Done screen ───────────────────────────────────────────────────────────────

function DoneScreen({
  mastery,
  cardCount,
  onRetry,
  onBack,
}: {
  mastery: number;
  cardCount: number;
  onRetry: () => void;
  onBack: () => void;
}) {
  const emoji = mastery >= 80 ? '🎯' : mastery >= 50 ? '📈' : '💪';
  const msg =
    mastery >= 80
      ? 'Solid mastery — keep it up!'
      : mastery >= 50
      ? 'Getting there — one more pass!'
      : 'Good start — practice again tomorrow!';

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
      <div className="text-7xl">{emoji}</div>
      <div>
        <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-1">
          Session complete
        </p>
        <p className="text-3xl font-black text-[var(--color-ink)] mb-1">{mastery}% mastery</p>
        <p className="text-sm text-gray-500">{msg}</p>
        <p className="text-xs text-gray-400 font-mono mt-1">{cardCount} card{cardCount !== 1 ? 's' : ''} reviewed</p>
      </div>
      <div className="w-full space-y-3">
        <Button fullWidth onClick={onRetry} variant="secondary">
          Practice again
        </Button>
        <Button fullWidth onClick={onBack}>
          Back to lesson
        </Button>
      </div>
    </div>
  );
}

// ── Main QuizView ─────────────────────────────────────────────────────────────

interface QuizViewProps {
  lessonId: string;
}

export function QuizView({ lessonId }: QuizViewProps) {
  const { pop } = useNavigation();
  const { language } = useLanguage();

  const lesson = language.curriculum.find((l) => l.id === lessonId);
  const cards  = useMemo(() => (lesson ? buildCards(lesson) : []), [lesson]);
  const cardIds = useMemo(() => cards.map((c) => c.id), [cards]);

  // ── Session state ──────────────────────────────────────────────────────────

  // Ordered list of card IDs for this session (lowest score first)
  const [queue, setQueue] = useState<string[]>(() =>
    sortByPriority(lessonId, cardIds),
  );
  const [cursor, setCursor]     = useState(0);   // index into queue
  const [revealed, setRevealed] = useState(false);
  const [done, setDone]         = useState<Set<string>>(new Set());
  const [sessionComplete, setSessionComplete] = useState(false);

  // Analytics — quiz started on mount
  useEffect(() => {
    import('../lib/analytics').then(({ analytics }) =>
      analytics.quizStarted(lessonId, cardIds.length),
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Card map for O(1) lookup
  const cardMap = useMemo(
    () => new Map(cards.map((c) => [c.id, c])),
    [cards],
  );

  const currentCardId = queue[cursor];
  const currentCard   = currentCardId ? cardMap.get(currentCardId) : undefined;

  // ── Flip animation ─────────────────────────────────────────────────────────

  const cardRef = useRef<HTMLDivElement>(null);

  const reveal = useCallback(() => {
    if (revealed) return;
    setRevealed(true);
  }, [revealed]);

  // ── Answer handlers ────────────────────────────────────────────────────────

  const advance = useCallback(
    (correct: boolean) => {
      if (!currentCardId) return;

      recordResult(lessonId, currentCardId, correct);

      if (correct) {
        hapticSuccess();
        const newDone = new Set(done);
        newDone.add(currentCardId);
        setDone(newDone);

        const nextCursor = cursor + 1;
        if (nextCursor >= queue.length) {
          // All cards in queue visited — check if any need re-review
          const remainingIds = queue.filter((id) => !newDone.has(id));
          if (remainingIds.length === 0) {
            setSessionComplete(true);
            const finalMastery = getLessonMastery(lessonId, cardIds);
            import('../lib/analytics').then(({ analytics }) =>
              analytics.quizCompleted(lessonId, finalMastery, newDone.size),
            );
          } else {
            // Re-queue cards that were answered wrong this session
            setQueue(sortByPriority(lessonId, remainingIds));
            setCursor(0);
            setRevealed(false);
          }
        } else {
          setCursor(nextCursor);
          setRevealed(false);
        }
      } else {
        hapticWarning();
        // "Again" — re-queue this card at the end (but not if already at end)
        const newQueue = [
          ...queue.slice(0, cursor),
          ...queue.slice(cursor + 1),
          currentCardId,
        ];
        setQueue(newQueue);
        // cursor stays same (next card slides in)
        if (cursor >= newQueue.length) {
          setCursor(0);
        }
        setRevealed(false);
      }
    },
    [currentCardId, lessonId, done, cursor, queue],
  );

  const retry = useCallback(() => {
    setQueue(sortByPriority(lessonId, cardIds));
    setCursor(0);
    setDone(new Set());
    setRevealed(false);
    setSessionComplete(false);
  }, [lessonId, cardIds]);

  // ── Mastery (live, from localStorage) ─────────────────────────────────────

  const mastery = getLessonMastery(lessonId, cardIds);

  // ── Render ─────────────────────────────────────────────────────────────────

  if (!lesson) return null;

  return (
    <Page>
      <Navbar
        title={`Practice — ${lesson.title.split(' — ')[0]}`}
        right={
          <span className="text-xs font-mono text-gray-400">
            {mastery}% mastered
          </span>
        }
      />

      <PageContent>
        <div className="max-w-lg mx-auto px-4 flex flex-col min-h-full pb-8">
          {sessionComplete ? (
            <DoneScreen
              mastery={mastery}
              cardCount={done.size}
              onRetry={retry}
              onBack={pop}
            />
          ) : (
            <>
              {/* Progress indicator */}
              <ProgressDots
                total={queue.length}
                current={cursor}
              />

              {/* Counter */}
              <p className="text-center text-xs font-mono text-gray-400 mb-4">
                {cursor + 1} / {queue.length}
              </p>

              {currentCard && (
                <div className="flex flex-col gap-4">
                  {/* ── Card ── */}
                  <div
                    ref={cardRef}
                    onClick={reveal}
                    className={[
                      'rounded-3xl border transition-all duration-200 select-none',
                      'shadow-[0_4px_32px_rgba(26,26,46,0.08)]',
                      revealed
                        ? 'bg-[var(--surface-solid)] border-[var(--surface-border)] cursor-default'
                        : 'bg-[var(--surface-solid)] border-[var(--surface-border)] cursor-pointer active:scale-[0.98] active:shadow-none',
                    ].join(' ')}
                  >
                    {/* Front — always visible */}
                    <div className="text-center px-6 pt-8 pb-4">
                      <HighlightedJapanese
                        target={currentCard.front.target}
                        highlightedTerm={currentCard.front.highlightedTerm}
                      />
                    </div>

                    {/* Divider + Back — slides in on reveal */}
                    <div
                      className={[
                        'overflow-hidden transition-all duration-300 ease-out',
                        revealed ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0',
                      ].join(' ')}
                    >
                      <div className="h-px bg-[var(--surface-divider)] mx-6" />
                      <div className="px-6 py-5 space-y-3">
                        {/* Literal */}
                        <div>
                          <p className="text-[11px] font-mono text-gray-400 uppercase tracking-widest mb-1">
                            Literal
                          </p>
                          <p className="text-sm font-mono font-medium text-[var(--color-ink)] leading-relaxed">
                            {currentCard.front.literal}
                          </p>
                        </div>
                        {/* Natural */}
                        <div>
                          <p className="text-[11px] font-mono text-gray-400 uppercase tracking-widest mb-1">
                            Natural
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">
                            {currentCard.front.natural}
                          </p>
                        </div>
                        {/* Insight */}
                        {currentCard.insight && (
                          <div className="bg-[var(--color-accent)]/8 rounded-xl px-4 py-3 mt-2">
                            <p className="text-[11px] font-mono text-[var(--color-accent)] uppercase tracking-widest mb-1">
                              Key insight
                            </p>
                            <p className="text-sm text-[var(--color-ink)] leading-relaxed">
                              {currentCard.insight}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tap-to-reveal hint */}
                    {!revealed && (
                      <div className="text-center pb-6">
                        <p className="text-xs font-mono text-gray-300 animate-pulse">
                          tap to reveal
                        </p>
                      </div>
                    )}
                  </div>

                  {/* ── Answer buttons (only after reveal) ── */}
                  <div
                    className={[
                      'flex gap-3 transition-all duration-300',
                      revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none',
                    ].join(' ')}
                  >
                    <button
                      onClick={() => advance(false)}
                      className={[
                        'flex-1 min-h-[56px] rounded-2xl border-2 font-semibold text-sm',
                        'border-red-200 bg-red-50 text-red-600',
                        'active:scale-[0.97] active:bg-red-100 transition-all select-none',
                      ].join(' ')}
                    >
                      ↩ Again
                    </button>
                    <button
                      onClick={() => advance(true)}
                      className={[
                        'flex-1 min-h-[56px] rounded-2xl border-2 font-semibold text-sm',
                        'border-emerald-200 bg-emerald-50 text-emerald-700',
                        'active:scale-[0.97] active:bg-emerald-100 transition-all select-none',
                      ].join(' ')}
                    >
                      Got it ✓
                    </button>
                  </div>

                  {/* Skip / hint */}
                  {!revealed && (
                    <div className="text-center">
                      <button
                        onClick={reveal}
                        className="text-xs font-mono text-gray-400 active:opacity-50 min-h-[44px] px-4"
                      >
                        Reveal answer
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </PageContent>
    </Page>
  );
}
