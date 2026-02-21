/**
 * PaywallView — premium upsell screen (QRT-202)
 *
 * Shown when a free user taps a premium feature.
 * Native iOS feel: spring-physics entrance, blurred glass cards, haptics.
 *
 * Plan pricing is stubbed here — QRT-201 (StoreKit) will inject real prices
 * via the `prices` prop or from a subscription context once available.
 */

import { useEffect, useRef, useState } from 'react';
import { Navbar, Page, PageContent } from '../lib/ui';
import { hapticLight, hapticMedium, hapticSuccess } from '../lib/haptics';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PaywallPlan {
  id: 'monthly' | 'annual';
  label: string;
  price: string;        // e.g. '$4.99/mo'
  priceMonthly: string; // normalised monthly, for comparison row
  badge?: string;       // e.g. 'Best value · save 40%'
}

interface PaywallViewProps {
  /**
   * Called when the user taps 'Start Free Trial'.
   * QRT-201 will implement the actual StoreKit purchase here.
   */
  onSubscribe?: (planId: 'monthly' | 'annual') => Promise<void>;
  /**
   * Called when the user taps 'Restore purchases'.
   */
  onRestore?: () => Promise<void>;
  /** Source context shown in analytics. e.g. 'tts', 'ai_explanation', 'language_pack' */
  source?: string;
}

// ── Stub pricing (replaced by StoreKit in QRT-201) ────────────────────────────

const DEFAULT_PLANS: PaywallPlan[] = [
  {
    id:           'annual',
    label:        'Annual',
    price:        '$35.99/yr',
    priceMonthly: '$3.00/mo',
    badge:        'Best value · save 40%',
  },
  {
    id:           'monthly',
    label:        'Monthly',
    price:        '$4.99/mo',
    priceMonthly: '$4.99/mo',
  },
];

// ── Feature list ──────────────────────────────────────────────────────────────

const PREMIUM_FEATURES = [
  {
    icon: '🔊',
    title: 'Audio pronunciation',
    desc: 'Tap any phrase to hear native-speed Japanese. Adjustable playback rate.',
  },
  {
    icon: '✦',
    title: 'AI sentence explanations',
    desc: 'Tap any example to get a structural breakdown from GPT-4.',
  },
  {
    icon: '🌍',
    title: 'All language packs',
    desc: 'Unlock every language — Spanish, Korean, Mandarin, French, and more.',
  },
  {
    icon: '📚',
    title: 'Advanced lesson library',
    desc: 'N3, N2, and N1 content — conditionals, passive, causative, and nuance.',
  },
  {
    icon: '★',
    title: 'Unlimited bookmarks',
    desc: 'Save as many lessons and SOS phrases as you want.',
  },
];

// ── Animated feature row ──────────────────────────────────────────────────────

function FeatureRow({
  icon, title, desc, delay,
}: { icon: string; title: string; desc: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity   = '0';
    el.style.transform = 'translateY(16px)';
    const t = setTimeout(() => {
      el.style.transition = `opacity 400ms ease ${delay}ms, transform 500ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`;
      el.style.opacity    = '1';
      el.style.transform  = 'translateY(0)';
    }, 50);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div ref={ref} className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-2xl bg-[var(--surface-solid)] border border-[var(--surface-border)] flex items-center justify-center text-xl shrink-0 shadow-sm">
        {icon}
      </div>
      <div className="flex-1 pt-0.5">
        <p className="font-bold text-[var(--color-ink)] text-[15px] leading-none mb-1">{title}</p>
        <p className="text-sm text-[var(--color-muted)] leading-snug">{desc}</p>
      </div>
    </div>
  );
}

// ── Plan card ─────────────────────────────────────────────────────────────────

function PlanCard({
  plan, selected, onSelect,
}: { plan: PaywallPlan; selected: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className={[
        'flex-1 rounded-2xl border-2 p-4 text-left transition-all duration-200 select-none',
        'relative overflow-hidden',
        selected
          ? 'bg-[var(--color-ink)] border-[var(--color-ink)] active:opacity-90'
          : 'bg-[var(--surface-solid)] border-[var(--surface-border)] active:bg-[var(--surface-active)]',
      ].join(' ')}
    >
      {/* Best value badge */}
      {plan.badge && (
        <div className={[
          'absolute -top-px left-1/2 -translate-x-1/2',
          'px-3 py-0.5 rounded-b-xl text-[10px] font-bold uppercase tracking-wider',
          selected ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700',
        ].join(' ')}>
          {plan.badge}
        </div>
      )}

      <p className={`text-[11px] font-mono uppercase tracking-widest mb-1 mt-3 ${selected ? 'text-white/60' : 'text-[var(--color-muted)]'}`}>
        {plan.label}
      </p>
      <p className={`font-black text-xl leading-none mb-1 ${selected ? 'text-white' : 'text-[var(--color-ink)]'}`}>
        {plan.price}
      </p>
      <p className={`text-xs ${selected ? 'text-white/50' : 'text-[var(--color-muted)]'}`}>
        {plan.id === 'annual' ? plan.priceMonthly + ' billed yearly' : 'billed monthly'}
      </p>

      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
          <span className="text-white text-xs font-black">✓</span>
        </div>
      )}
    </button>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function PaywallView({ onSubscribe, onRestore, source }: PaywallViewProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  const [loading, setLoading]           = useState(false);
  const [restoring, setRestoring]       = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // Hero slide-in
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    el.style.opacity   = '0';
    el.style.transform = 'translateY(24px)';
    const t = setTimeout(() => {
      el.style.transition = 'opacity 400ms ease 0ms, transform 500ms cubic-bezier(0.16,1,0.3,1) 0ms';
      el.style.opacity    = '1';
      el.style.transform  = 'translateY(0)';
    }, 50);
    return () => clearTimeout(t);
  }, []);

  const handleSubscribe = async () => {
    hapticMedium();
    setLoading(true);
    try {
      if (onSubscribe) {
        await onSubscribe(selectedPlan);
        hapticSuccess();
      } else {
        // Stub — QRT-201 will wire StoreKit here
        console.log('[PaywallView] StoreKit purchase stub — plan:', selectedPlan, 'source:', source);
        setTimeout(() => {
          setLoading(false);
          // In production: subscription context updates, paywall closes, feature unlocks
        }, 800);
        return;
      }
    } catch (err) {
      console.error('[PaywallView] subscribe error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    hapticLight();
    setRestoring(true);
    try {
      if (onRestore) {
        await onRestore();
      } else {
        console.log('[PaywallView] StoreKit restore stub');
        await new Promise(r => setTimeout(r, 600));
      }
    } finally {
      setRestoring(false);
    }
  };

  return (
    <Page>
      <Navbar title="" />

      <PageContent>
        <div className="max-w-lg mx-auto px-5 pb-12 space-y-8">

          {/* Hero */}
          <div ref={headerRef} className="text-center pt-2 pb-2 space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-amber-500 flex items-center justify-center text-3xl mx-auto shadow-lg">
              ✦
            </div>
            <h1 className="text-3xl font-black text-[var(--color-ink)] tracking-tight leading-tight">
              Unlock Premium
            </h1>
            <p className="text-sm text-[var(--color-muted)] max-w-xs mx-auto leading-relaxed">
              Audio, AI explanations, advanced content, and every language pack — all in one.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-5">
            {PREMIUM_FEATURES.map((f, i) => (
              <FeatureRow key={f.title} {...f} delay={i * 60 + 100} />
            ))}
          </div>

          {/* Pricing cards */}
          <div className="space-y-3">
            <p className="text-[11px] font-mono text-[var(--color-muted)] uppercase tracking-widest px-1">
              Choose a plan
            </p>
            <div className="flex gap-3">
              {DEFAULT_PLANS.map(plan => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  selected={selectedPlan === plan.id}
                  onSelect={() => { hapticLight(); setSelectedPlan(plan.id); }}
                />
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className={[
                'w-full rounded-2xl py-4 font-bold text-[15px] select-none',
                'bg-amber-500 text-white shadow-lg shadow-amber-500/30',
                'transition-opacity duration-150',
                loading ? 'opacity-60' : 'active:opacity-80',
              ].join(' ')}
            >
              {loading ? 'Processing…' : 'Start Free Trial'}
            </button>

            <p className="text-center text-xs text-[var(--color-muted)] leading-relaxed">
              3-day free trial, then{' '}
              {selectedPlan === 'annual' ? '$35.99/year' : '$4.99/month'}.
              Cancel anytime in App Store Settings.
            </p>

            <button
              onClick={handleRestore}
              disabled={restoring}
              className="w-full text-center text-sm text-[var(--color-muted)] underline underline-offset-2 active:opacity-50 py-2 select-none"
            >
              {restoring ? 'Restoring…' : 'Restore purchases'}
            </button>
          </div>

          {/* Legal */}
          <p className="text-center text-[11px] text-[var(--color-muted)] leading-relaxed opacity-70">
            Payment charged to your Apple ID at confirmation. Subscription automatically renews unless cancelled at least 24 hours before the end of the current period.
          </p>

        </div>
      </PageContent>
    </Page>
  );
}
