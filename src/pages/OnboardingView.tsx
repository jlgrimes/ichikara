/**
 * OnboardingView — first-launch walkthrough with level self-assessment.
 *
 * 3 screens:
 *   0 — Welcome
 *   1 — How it works
 *   2 — Level check (self-assessment)
 *
 * Completion stores result to localStorage via useOnboarding.
 */

import { useState } from 'react';
import { markOnboarded, type JLPTStart } from '../hooks/useOnboarding';
import { hapticLight, hapticSuccess } from '../lib/haptics';

interface Props {
  onComplete: () => void;
}

// ── Pager dots ────────────────────────────────────────────────────────────────

function Dots({ total, active }: { total: number; active: number }) {
  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={[
            'rounded-full transition-all duration-300',
            i === active
              ? 'w-5 h-2 bg-[var(--color-accent)]'
              : 'w-2 h-2 bg-gray-200 dark:bg-gray-700',
          ].join(' ')}
        />
      ))}
    </div>
  );
}

// ── Screen components ─────────────────────────────────────────────────────────

function WelcomeScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
      <div>
        <p className="text-[11px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
          Welcome to
        </p>
        <h1 className="text-[72px] font-black text-[var(--color-ink)] tracking-tight leading-none mb-4">
          一から
        </h1>
        <p className="text-lg font-bold text-[var(--color-ink)]">
          Japanese from scratch.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
          Grammar that makes sense — structural, not rote.
        </p>
      </div>
      <div className="w-24 h-1 bg-[var(--color-accent)] rounded-full opacity-40" />
    </div>
  );
}

function HowItWorksScreen() {
  const features = [
    {
      icon: '📖',
      title: 'Grammar lessons',
      desc: 'Structural concepts — how Japanese actually works, not memorisation lists.',
    },
    {
      icon: '🃏',
      title: 'Flashcard practice',
      desc: 'Spaced repetition drills on every lesson. Track your mastery.',
    },
    {
      icon: '🆘',
      title: 'SOS phrases',
      desc: 'Travel-ready phrases you can show your phone or play aloud.',
    },
  ];

  return (
    <div className="flex-1 flex flex-col justify-center px-8 gap-6">
      <div>
        <p className="text-[11px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
          Three tools
        </p>
        <h2 className="text-3xl font-black text-[var(--color-ink)] leading-tight">
          Everything you need
        </h2>
      </div>
      <div className="space-y-4">
        {features.map(f => (
          <div key={f.title} className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--surface-solid)] border border-[var(--surface-border)] flex items-center justify-center text-2xl shrink-0 shadow-sm">
              {f.icon}
            </div>
            <div className="flex-1">
              <p className="font-bold text-[var(--color-ink)] text-[15px]">{f.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface LevelScreenProps {
  selected: JLPTStart | null;
  onSelect: (level: JLPTStart) => void;
}

function LevelScreen({ selected, onSelect }: LevelScreenProps) {
  const levels: { value: JLPTStart; label: string; sub: string }[] = [
    {
      value: 'N5',
      label: 'Complete beginner',
      sub: 'Start from nouns, particles, and copula',
    },
    {
      value: 'N4',
      label: 'I know the basics',
      sub: 'Jump to verb forms, て-form, and clauses',
    },
    {
      value: 'N3',
      label: 'Upper beginner',
      sub: 'Dive into conditionals, causative, and passive',
    },
    {
      value: 'skip',
      label: 'Just show me everything',
      sub: 'No suggestion — I\'ll navigate myself',
    },
  ];

  return (
    <div className="flex-1 flex flex-col justify-center px-6 gap-5">
      <div>
        <p className="text-[11px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
          Level check
        </p>
        <h2 className="text-3xl font-black text-[var(--color-ink)] leading-tight">
          Where are you starting?
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          We'll suggest where to begin. You can always change this.
        </p>
      </div>
      <div className="space-y-3">
        {levels.map(l => {
          const active = selected === l.value;
          return (
            <button
              key={l.value}
              onClick={() => { hapticLight(); onSelect(l.value); }}
              className={[
                'w-full text-left rounded-2xl p-4 border-2 transition-all duration-150 select-none',
                active
                  ? 'bg-[var(--color-ink)] border-[var(--color-ink)] active:opacity-90'
                  : 'bg-[var(--surface-solid)] border-[var(--surface-border)] active:bg-[var(--surface-active)]',
              ].join(' ')}
            >
              <p className={`font-bold text-[15px] ${active ? 'text-white' : 'text-[var(--color-ink)]'}`}>
                {l.label}
              </p>
              <p className={`text-xs mt-0.5 leading-snug ${active ? 'text-white/60' : 'text-gray-500 dark:text-gray-400'}`}>
                {l.sub}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

const TOTAL = 3;

export function OnboardingView({ onComplete }: Props) {
  const [screen, setScreen]     = useState(0);
  const [level, setLevel]       = useState<JLPTStart | null>(null);

  const isLast = screen === TOTAL - 1;

  const next = () => {
    hapticLight();
    if (isLast) {
      hapticSuccess();
      const chosen = level ?? 'N5';
      markOnboarded(chosen);
      import('../lib/analytics').then(({ analytics }) => analytics.onboardingCompleted(chosen));
      onComplete();
    } else {
      setScreen(s => s + 1);
    }
  };

  const canAdvance = !isLast || level !== null;

  return (
    <div
      className="min-h-dvh bg-[var(--color-paper)] flex flex-col"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* Skip — top right (not on last screen) */}
      {!isLast && (
        <div className="flex justify-end px-6 pt-4 pb-0">
          <button
            onClick={() => {
              markOnboarded('skip');
              import('../lib/analytics').then(({ analytics }) => analytics.onboardingSkipped());
              onComplete();
            }}
            className="text-sm text-gray-400 dark:text-gray-500 active:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-end"
          >
            Skip
          </button>
        </div>
      )}

      {/* Screen content */}
      <div className="flex-1 flex flex-col">
        {screen === 0 && <WelcomeScreen />}
        {screen === 1 && <HowItWorksScreen />}
        {screen === 2 && <LevelScreen selected={level} onSelect={setLevel} />}
      </div>

      {/* Bottom: dots + button */}
      <div className="px-6 pb-6 pt-4 space-y-5">
        <Dots total={TOTAL} active={screen} />

        <button
          onClick={next}
          disabled={!canAdvance}
          className={[
            'w-full rounded-2xl py-4 font-bold text-[15px]',
            'transition-all duration-150 select-none',
            canAdvance
              ? 'bg-[var(--color-ink)] text-white active:opacity-80'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600',
          ].join(' ')}
        >
          {isLast ? 'Start learning →' : 'Continue →'}
        </button>
      </div>
    </div>
  );
}
