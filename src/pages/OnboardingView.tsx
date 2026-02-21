/**
 * OnboardingView — full production onboarding (QRT-199)
 *
 * Screens (when unauthenticated):
 *   0  Welcome          — brand hero, CTA
 *   1  Grammar approach — structural vs rote
 *   2  Three tools      — Grammar, Flashcards, SOS
 *   3  Account          — Apple Sign In (primary) + email/password
 *   4  Level check      — N5 / N4 / N3 / skip
 *
 * When user is already signed in, screen 3 (auth) is omitted.
 *
 * Transitions: CSS translate with spring-ish cubic-bezier.
 * Haptics: hapticLight on CTA, hapticSuccess on completion.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { markOnboarded, type JLPTStart } from '../hooks/useOnboarding';
import { hapticLight, hapticMedium, hapticSuccess } from '../lib/haptics';
import { supabase } from '../lib/supabase';
import { signInWithApple, isAppleSignInAvailable } from '../lib/appleSignIn';

interface Props {
  /** Called when the flow is complete (user signed in + level chosen). */
  onComplete: () => void;
  /** If true, the auth screen is skipped (user already has a session). */
  skipAuth?: boolean;
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const SPRING = '420ms cubic-bezier(0.16, 1, 0.3, 1)';
const INPUT_BASE = [
  'w-full rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-solid)]',
  'text-[var(--color-ink)] px-4 py-3.5 text-[15px]',
  'focus:outline-none focus:ring-2 focus:ring-[var(--color-ink)] focus:ring-offset-1 transition-shadow',
  'placeholder:text-[var(--color-muted)]',
].join(' ');

// ── Screen 0: Welcome ─────────────────────────────────────────────────────────

function WelcomeScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-8">
      {/* Brand */}
      <div className="space-y-3">
        <p className="text-[11px] font-mono text-[var(--color-muted)] uppercase tracking-[0.2em]">
          Welcome to
        </p>
        <h1 className="text-[80px] font-black text-[var(--color-ink)] tracking-tight leading-[0.9]">
          一から
        </h1>
        <p className="text-[13px] font-mono text-[var(--color-muted)] tracking-widest">
          ichikara · from scratch
        </p>
      </div>

      {/* Tagline */}
      <div className="space-y-2 max-w-xs">
        <p className="text-xl font-black text-[var(--color-ink)] leading-snug">
          Japanese grammar that actually makes sense.
        </p>
        <p className="text-sm text-[var(--color-muted)] leading-relaxed">
          Structural, not rote. Built for people who want to understand the language, not just memorize phrases.
        </p>
      </div>

      {/* Decorative divider */}
      <div className="flex items-center gap-3 opacity-30">
        <div className="h-px w-12 bg-[var(--color-ink)]" />
        <span className="text-xs font-mono text-[var(--color-ink)]">始めよう</span>
        <div className="h-px w-12 bg-[var(--color-ink)]" />
      </div>
    </div>
  );
}

// ── Screen 1: Grammar approach ────────────────────────────────────────────────

function GrammarApproachScreen() {
  const comparisons = [
    { bad: 'は means "is"', good: 'は marks the sentence topic' },
    { bad: 'が means "but"', good: 'が marks the grammatical subject' },
    { bad: 'Memorize verb lists', good: 'Understand verb morphology' },
  ];

  return (
    <div className="flex-1 flex flex-col justify-center px-6 gap-6">
      <div className="space-y-2">
        <p className="text-[11px] font-mono text-[var(--color-muted)] uppercase tracking-[0.2em]">
          The approach
        </p>
        <h2 className="text-3xl font-black text-[var(--color-ink)] leading-tight">
          Stop memorizing.<br />Start understanding.
        </h2>
        <p className="text-sm text-[var(--color-muted)] leading-relaxed pt-1">
          Most apps teach you vocabulary lists and phrases. Ichikara teaches you the underlying structure — so you can generate sentences, not just recall them.
        </p>
      </div>

      <div className="space-y-3">
        {comparisons.map((c, i) => (
          <div
            key={i}
            className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-solid)] overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-950/20 border-b border-[var(--surface-border)]">
              <span className="text-xs">❌</span>
              <p className="text-sm text-red-600 dark:text-red-400 line-through opacity-70">{c.bad}</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5">
              <span className="text-xs">✓</span>
              <p className="text-sm font-medium text-[var(--color-ink)]">{c.good}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Screen 2: Three tools ─────────────────────────────────────────────────────

function ThreeToolsScreen() {
  const tools = [
    {
      icon: '文',
      color: 'bg-[var(--color-ink)] text-white',
      title: 'Structural lessons',
      desc: '16 modules from zero to N2. Every concept explained as a system, not an exception.',
    },
    {
      icon: '🃏',
      color: 'bg-amber-500 text-white',
      title: 'Flashcard drills',
      desc: 'Spaced-repetition practice on every lesson. Know your mastery at a glance.',
    },
    {
      icon: '🆘',
      color: 'bg-red-500 text-white',
      title: 'SOS phrases',
      desc: 'Medical, transport, food — phrases you can show your phone. Speaks aloud in Japanese.',
    },
  ];

  return (
    <div className="flex-1 flex flex-col justify-center px-6 gap-6">
      <div className="space-y-2">
        <p className="text-[11px] font-mono text-[var(--color-muted)] uppercase tracking-[0.2em]">
          Three tools
        </p>
        <h2 className="text-3xl font-black text-[var(--color-ink)] leading-tight">
          Everything you need.
        </h2>
      </div>

      <div className="space-y-4">
        {tools.map(t => (
          <div key={t.title} className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black shrink-0 shadow-sm ${t.color}`}>
              {t.icon}
            </div>
            <div className="flex-1 pt-1">
              <p className="font-bold text-[var(--color-ink)] text-[15px] leading-none mb-1">{t.title}</p>
              <p className="text-sm text-[var(--color-muted)] leading-snug">{t.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Screen 3: Auth ────────────────────────────────────────────────────────────

type AuthMode = 'signup' | 'login';

interface AuthScreenProps {
  onAuthComplete: () => void;
}

function AuthScreen({ onAuthComplete }: AuthScreenProps) {
  const [mode, setMode]           = useState<AuthMode>('signup');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [loading, setLoading]     = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const emailRef                  = useRef<HTMLInputElement>(null);

  const canShowApple = isAppleSignInAvailable();

  const handleAppleSignIn = async () => {
    hapticMedium();
    setAppleLoading(true);
    setError(null);
    const result = await signInWithApple();
    setAppleLoading(false);

    if (result.ok) {
      hapticSuccess();
      onAuthComplete();
    } else if (result.error !== 'cancelled') {
      setError(result.error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: 'app.ichikara.ichikara://login-callback' },
      });
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        setEmailSent(true);
        setLoading(false);
        // For email confirmation flows, we wait. For auto-confirm, auth state
        // changes will fire onAuthComplete via App.tsx's session listener.
        // We also allow proceeding to the level screen immediately for better UX.
        hapticSuccess();
        setTimeout(onAuthComplete, 1500);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        hapticSuccess();
        onAuthComplete();
      }
    }
  };

  if (emailSent) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-[var(--surface-solid)] border border-[var(--surface-border)] flex items-center justify-center text-4xl shadow-sm">
          ✉️
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[var(--color-ink)]">Check your email</h2>
          <p className="text-sm text-[var(--color-muted)] leading-relaxed max-w-xs">
            We sent a confirmation link to <strong className="text-[var(--color-ink)]">{email}</strong>. Tap it to activate your account.
          </p>
        </div>
        <button
          onClick={onAuthComplete}
          className="text-sm text-[var(--color-muted)] underline-offset-2 underline active:opacity-50"
        >
          Continue anyway →
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-center px-6 gap-5 pb-2">
      <div className="space-y-1">
        <h2 className="text-3xl font-black text-[var(--color-ink)] leading-tight">
          {mode === 'signup' ? 'Create your account' : 'Welcome back'}
        </h2>
        <p className="text-sm text-[var(--color-muted)]">
          {mode === 'signup'
            ? 'Free forever. Your progress syncs across devices.'
            : 'Sign in to pick up where you left off.'}
        </p>
      </div>

      {/* Apple Sign In — only on iOS native */}
      {canShowApple && (
        <button
          onClick={handleAppleSignIn}
          disabled={appleLoading}
          className={[
            'w-full rounded-2xl py-4 flex items-center justify-center gap-3',
            'bg-[var(--color-ink)] text-white font-semibold text-[15px]',
            'transition-opacity duration-150 select-none',
            appleLoading ? 'opacity-50' : 'active:opacity-70',
          ].join(' ')}
        >
          {/* Apple logo SVG */}
          <svg width="17" height="20" viewBox="0 0 17 20" fill="white" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M14.05 10.62c-.02-2.1 1.7-3.1 1.78-3.15-1-1.44-2.5-1.63-3.04-1.65-1.3-.13-2.53.77-3.19.77-.66 0-1.68-.75-2.77-.73-1.42.02-2.74.83-3.47 2.1C1.6 10.7 2.61 15 4.3 17.07c.85 1.02 1.86 2.17 3.18 2.12 1.27-.05 1.75-.83 3.28-.83 1.53 0 1.97.83 3.29.8 1.38-.02 2.25-1.05 3.09-2.08.99-1.19 1.39-2.34 1.41-2.4-.03-.01-2.7-1.04-2.73-3.06h.23zM11.89 4.28c.7-.86 1.17-2.04 1.05-3.23-1.01.04-2.25.68-2.97 1.52-.65.75-1.22 1.96-1.07 3.11 1.13.09 2.28-.58 2.99-1.4z"/>
          </svg>
          {appleLoading ? 'Signing in…' : 'Continue with Apple'}
        </button>
      )}

      {/* Divider */}
      {canShowApple && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[var(--surface-divider)]" />
          <p className="text-xs font-mono text-[var(--color-muted)] uppercase tracking-wider">or</p>
          <div className="flex-1 h-px bg-[var(--surface-divider)]" />
        </div>
      )}

      {/* Email / Password form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          ref={emailRef}
          type="email"
          autoComplete={mode === 'signup' ? 'email' : 'username'}
          inputMode="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className={INPUT_BASE}
        />
        <input
          type="password"
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={6}
          className={INPUT_BASE}
        />

        {error && (
          <p className="text-sm text-[var(--color-danger)] px-1 leading-snug">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          onClick={() => hapticLight()}
          className={[
            'w-full rounded-2xl py-4 font-bold text-[15px]',
            'bg-[var(--color-ink)] text-white transition-opacity select-none',
            loading ? 'opacity-50' : 'active:opacity-70',
          ].join(' ')}
        >
          {loading ? '…' : mode === 'signup' ? 'Create account' : 'Sign in'}
        </button>
      </form>

      {/* Mode toggle */}
      <p className="text-center text-sm text-[var(--color-muted)]">
        {mode === 'signup' ? 'Already have an account? ' : 'New here? '}
        <button
          onClick={() => { setMode(m => m === 'signup' ? 'login' : 'signup'); setError(null); }}
          className="font-bold text-[var(--color-ink)] active:opacity-50 underline-offset-2 underline"
        >
          {mode === 'signup' ? 'Sign in' : 'Create account'}
        </button>
      </p>
    </div>
  );
}

// ── Screen 4: Level check ─────────────────────────────────────────────────────

interface LevelScreenProps {
  selected: JLPTStart | null;
  onSelect: (level: JLPTStart) => void;
}

function LevelScreen({ selected, onSelect }: LevelScreenProps) {
  const levels: { value: JLPTStart; label: string; sub: string; badge: string }[] = [
    {
      value: 'N5',
      label: 'Complete beginner',
      sub: 'Start from nouns, particles, and copula',
      badge: 'N5',
    },
    {
      value: 'N4',
      label: 'I know the basics',
      sub: 'Jump to verb forms, て-form, and clauses',
      badge: 'N4',
    },
    {
      value: 'N3',
      label: 'Upper beginner',
      sub: 'Dive into conditionals, causative, and passive',
      badge: 'N3',
    },
    {
      value: 'skip',
      label: 'Show me everything',
      sub: 'No suggestion — I\'ll navigate myself',
      badge: '—',
    },
  ];

  return (
    <div className="flex-1 flex flex-col justify-center px-6 gap-5">
      <div className="space-y-2">
        <p className="text-[11px] font-mono text-[var(--color-muted)] uppercase tracking-[0.2em]">
          One last thing
        </p>
        <h2 className="text-3xl font-black text-[var(--color-ink)] leading-tight">
          Where are you starting?
        </h2>
        <p className="text-sm text-[var(--color-muted)] leading-relaxed">
          We'll open the right lessons first. You can always change this later.
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
                'flex items-center gap-4',
                active
                  ? 'bg-[var(--color-ink)] border-[var(--color-ink)]'
                  : 'bg-[var(--surface-solid)] border-[var(--surface-border)] active:bg-[var(--surface-active)]',
              ].join(' ')}
            >
              {/* Level badge */}
              <div className={[
                'w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-colors',
                active
                  ? 'bg-white/20 text-white'
                  : 'bg-[var(--surface-bg)] text-[var(--color-ink)] border border-[var(--surface-border)]',
              ].join(' ')}>
                {l.badge}
              </div>
              <div className="flex-1">
                <p className={`font-bold text-[15px] leading-none mb-0.5 ${active ? 'text-white' : 'text-[var(--color-ink)]'}`}>
                  {l.label}
                </p>
                <p className={`text-xs leading-snug ${active ? 'text-white/60' : 'text-[var(--color-muted)]'}`}>
                  {l.sub}
                </p>
              </div>
              {active && (
                <span className="text-white/70 text-lg leading-none">✓</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Pager dots ────────────────────────────────────────────────────────────────

function Dots({ total, active }: { total: number; active: number }) {
  return (
    <div className="flex justify-center gap-2" aria-hidden>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width:   i === active ? 20 : 8,
            height:  8,
            background: i === active ? 'var(--color-ink)' : 'var(--surface-divider)',
          }}
        />
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function OnboardingView({ onComplete, skipAuth = false }: Props) {
  const screens = skipAuth
    ? ['welcome', 'approach', 'tools', 'level'] as const
    : ['welcome', 'approach', 'tools', 'auth', 'level'] as const;

  const [screenIdx, setScreenIdx]     = useState(0);
  const [level, setLevel]             = useState<JLPTStart | null>(null);
  const [direction, setDirection]     = useState<1 | -1>(1); // 1 = forward, -1 = back
  const [animating, setAnimating]     = useState(false);
  const containerRef                  = useRef<HTMLDivElement>(null);

  const currentScreen = screens[screenIdx];
  const isAuthScreen  = currentScreen === 'auth';
  const isLevelScreen = currentScreen === 'level';
  const isFirst       = screenIdx === 0;
  const isLast        = screenIdx === screens.length - 1;
  const canAdvance    = !isLevelScreen || level !== null;

  // Animate slide
  const navigateTo = useCallback((nextIdx: number) => {
    if (animating) return;
    const dir = nextIdx > screenIdx ? 1 : -1;
    setDirection(dir);
    setAnimating(true);
    setScreenIdx(nextIdx);
    setTimeout(() => setAnimating(false), 450);
  }, [animating, screenIdx]);

  const goNext = useCallback(() => {
    if (!canAdvance) return;
    hapticLight();
    if (isLast) {
      hapticSuccess();
      const chosen = level ?? 'N5';
      markOnboarded(chosen);
      import('../lib/analytics').then(({ analytics }) =>
        analytics.onboardingCompleted(chosen),
      );
      onComplete();
    } else {
      navigateTo(screenIdx + 1);
    }
  }, [canAdvance, isLast, level, screenIdx, navigateTo, onComplete]);

  const handleSkip = () => {
    hapticLight();
    markOnboarded('skip');
    import('../lib/analytics').then(({ analytics }) => analytics.onboardingSkipped());
    onComplete();
  };

  const handleAuthComplete = useCallback(() => {
    navigateTo(screenIdx + 1);
  }, [screenIdx, navigateTo]);

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') goNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext]);

  const screenContent: Record<typeof screens[number], React.ReactNode> = {
    welcome:  <WelcomeScreen />,
    approach: <GrammarApproachScreen />,
    tools:    <ThreeToolsScreen />,
    auth:     <AuthScreen onAuthComplete={handleAuthComplete} />,
    level:    <LevelScreen selected={level} onSelect={setLevel} />,
  };

  return (
    <div
      className="min-h-dvh bg-[var(--color-paper)] flex flex-col overflow-hidden"
      style={{
        paddingTop:    'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* Top bar: skip (left) */}
      <div className="flex items-center justify-between px-6 pt-4 pb-0 min-h-[52px]">
        {/* Back button */}
        {!isFirst && !isAuthScreen ? (
          <button
            onClick={() => navigateTo(screenIdx - 1)}
            className="text-sm font-medium text-[var(--color-muted)] active:opacity-50 min-h-[44px] flex items-center gap-1 select-none"
          >
            <span className="text-base">‹</span> Back
          </button>
        ) : <div />}

        {/* Skip */}
        {!isAuthScreen && !isLevelScreen && (
          <button
            onClick={handleSkip}
            className="text-sm text-[var(--color-muted)] active:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-end select-none"
          >
            Skip
          </button>
        )}
      </div>

      {/* Screen content — slide animation */}
      <div
        ref={containerRef}
        className="flex-1 flex flex-col overflow-hidden relative"
      >
        <div
          key={currentScreen}
          className="flex-1 flex flex-col"
          style={{
            animation: `slideIn${direction > 0 ? 'Right' : 'Left'} ${SPRING} both`,
          }}
        >
          {screenContent[currentScreen]}
        </div>
      </div>

      {/* Bottom: dots + CTA — hidden on auth screen (auth has its own submit) */}
      {!isAuthScreen && (
        <div className="px-6 pb-6 pt-4 space-y-5">
          <Dots total={screens.length} active={screenIdx} />
          <button
            onClick={goNext}
            disabled={!canAdvance}
            className={[
              'w-full rounded-2xl py-4 font-bold text-[15px]',
              'transition-all duration-150 select-none',
              canAdvance
                ? 'bg-[var(--color-ink)] text-white active:opacity-80'
                : 'bg-[var(--surface-solid)] text-[var(--color-muted)] border border-[var(--surface-border)]',
            ].join(' ')}
          >
            {isLast ? 'Start learning →' : 'Continue →'}
          </button>
        </div>
      )}

      {/* Slide animation keyframes */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0.5; }
          to   { transform: translateX(0);    opacity: 1;   }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0.5; }
          to   { transform: translateX(0);     opacity: 1;   }
        }
      `}</style>
    </div>
  );
}
