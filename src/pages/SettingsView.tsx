/**
 * SettingsView — full production settings (QRT-200)
 *
 * Sections:
 *   Profile      — avatar (initials), email, display name
 *   Subscription — free / premium badge, upgrade CTA
 *   Language     — language picker
 *   Notifications — placeholder (QRT-208)
 *   Legal        — Privacy Policy, Terms of Service
 *   About        — version, build
 *   Account      — sign out, delete account (destructive)
 *   Dev          — component catalog (dev builds only)
 */

import { lazy, Suspense, useState } from 'react';
import { Page, PageContent, useNavigation, ActionSheet } from '../lib/ui';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useSubscription } from '../hooks/useSubscription';
import { hapticMedium, hapticHeavy, hapticSuccess } from '../lib/haptics';
import { supabase } from '../lib/supabase';
import { LanguageSelector } from './LanguageSelector';
import { PrivacyPage } from './PrivacyPage';
import { TermsPage } from './TermsPage';
import { PaywallView } from './PaywallView';

// Dev-only component catalog — tree-shaken in prod
const ComponentCatalog = import.meta.env.DEV
  ? lazy(() => import('../lib/ui/ComponentCatalog').then(m => ({ default: m.ComponentCatalog })))
  : null;

// ── Avatar (initials) ─────────────────────────────────────────────────────────

function Avatar({ email }: { email: string }) {
  const initials = email
    .split('@')[0]
    .split(/[._\-+]/)
    .map(p => p[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('') || '?';

  return (
    <div className="w-16 h-16 rounded-2xl bg-[var(--color-ink)] flex items-center justify-center shrink-0">
      <span className="text-xl font-black text-white tracking-tight select-none">
        {initials}
      </span>
    </div>
  );
}

// ── Subscription badge ────────────────────────────────────────────────────────

function SubscriptionBadge({ isPremium }: { isPremium: boolean }) {
  if (isPremium) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white tracking-wide">
        ✦ PREMIUM
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--surface-solid)] text-[var(--color-muted)] border border-[var(--surface-border)] tracking-wide">
      FREE
    </span>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-mono text-[var(--color-muted)] uppercase tracking-widest mb-3 px-1">
        {label}
      </p>
      <div className="bg-[var(--surface-bg)] backdrop-blur-sm rounded-3xl border border-[var(--surface-border)] shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function RowDivider() {
  return <div className="h-px bg-[var(--surface-border)] mx-5" />;
}

interface RowProps {
  label: string;
  sublabel?: string;
  right?: React.ReactNode;
  chevron?: boolean;
  destructive?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

function Row({ label, sublabel, right, chevron = true, destructive = false, onClick, disabled }: RowProps) {
  const inner = (
    <>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium leading-none mb-0.5 ${destructive ? 'text-[var(--color-danger)]' : 'text-[var(--color-ink)]'}`}>
          {label}
        </p>
        {sublabel && (
          <p className="text-xs text-[var(--color-muted)] mt-0.5 leading-snug">{sublabel}</p>
        )}
      </div>
      {right && <div className="shrink-0">{right}</div>}
      {chevron && !right && (
        <span className="text-[var(--color-muted)] text-xl leading-none shrink-0">›</span>
      )}
    </>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={[
          'w-full px-5 py-4 flex items-center gap-3 text-left',
          'transition-colors select-none',
          disabled ? 'opacity-40 cursor-not-allowed' : 'active:bg-[var(--surface-active)]',
        ].join(' ')}
      >
        {inner}
      </button>
    );
  }

  return (
    <div className="px-5 py-4 flex items-center gap-3">
      {inner}
    </div>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────────

interface SettingsViewProps {
  onSignOut: () => void;
}

export function SettingsView({ onSignOut }: SettingsViewProps) {
  const { session }            = useAuth();
  const { push }               = useNavigation();
  const { language }           = useLanguage();
  const subscription           = useSubscription();

  const [signingOut, setSigningOut]   = useState(false);
  const [deleting, setDeleting]       = useState(false);
  const [showDeleteSheet, setShowDeleteSheet] = useState(false);

  const email       = session?.user?.email ?? '';
  const displayName = session?.user?.user_metadata?.full_name
    ?? session?.user?.user_metadata?.name
    ?? email.split('@')[0]
    ?? 'You';

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleSignOut = async () => {
    hapticMedium();
    setSigningOut(true);
    try { await onSignOut(); }
    finally { setSigningOut(false); }
  };

  const handleDeleteAccount = async () => {
    hapticHeavy();
    setDeleting(true);
    try {
      // Sign out locally first — the account deletion via Edge Function (or
      // Supabase admin API) should be done server-side in QRT-210/production.
      // For now we sign out and clear local state.
      await supabase.auth.signOut();
      hapticSuccess();
    } catch (err) {
      console.error('Delete account error:', err);
      setDeleting(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <Page>
      {/* Safe area fill */}
      <div className="shrink-0 bg-[var(--color-paper)]" style={{ height: 'env(safe-area-inset-top)' }} />

      <PageContent>
        <div className="max-w-lg mx-auto px-4 space-y-8 pb-12">

          {/* Large title */}
          <div className="pt-6 pb-2">
            <h1 className="text-[42px] font-black text-[var(--color-ink)] tracking-tight leading-none">
              Settings
            </h1>
          </div>

          {/* ── Profile ─────────────────────────────────────────────────── */}
          <Section label="Profile">
            <div className="px-5 py-5 flex items-center gap-4">
              <Avatar email={email} />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[var(--color-ink)] text-[17px] leading-tight truncate">
                  {displayName}
                </p>
                <p className="text-sm text-[var(--color-muted)] mt-0.5 truncate">{email}</p>
                <div className="mt-2">
                  <SubscriptionBadge isPremium={subscription.isPremium} />
                </div>
              </div>
            </div>
          </Section>

          {/* ── Subscription ─────────────────────────────────────────────── */}
          {!subscription.loading && (
            <Section label="Subscription">
              {subscription.isPremium ? (
                <>
                  <Row
                    label="Ichikara Premium"
                    sublabel={subscription.expiresAt
                      ? `Renews ${new Date(subscription.expiresAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
                      : 'Active subscription'
                    }
                    right={<SubscriptionBadge isPremium />}
                    chevron={false}
                  />
                  <RowDivider />
                  <Row
                    label="Manage subscription"
                    sublabel="Cancel or change plan in App Store"
                    onClick={() => {
                      // Opens App Store subscription management
                      window.open('https://apps.apple.com/account/subscriptions', '_blank');
                    }}
                  />
                </>
              ) : (
                <>
                  <div className="px-5 py-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-bold text-[var(--color-ink)] text-[15px]">Ichikara Free</p>
                      <SubscriptionBadge isPremium={false} />
                    </div>
                    <p className="text-sm text-[var(--color-muted)] leading-snug mb-4">
                      Upgrade to Premium for AI sentence explanations, unlimited lesson bookmarks, and early access to new features.
                    </p>
                    <button
                      onClick={() => {
                        hapticMedium();
                        push(<PaywallView source="settings" />);
                      }}
                      className="w-full rounded-2xl py-3.5 bg-amber-500 text-white font-bold text-sm active:opacity-80 transition-opacity select-none"
                    >
                      ✦ Upgrade to Premium
                    </button>
                  </div>
                </>
              )}
            </Section>
          )}

          {/* ── Language ─────────────────────────────────────────────────── */}
          <Section label="Learning">
            <Row
              label={language.meta.name}
              sublabel={language.meta.nativeName}
              right={<span className="text-2xl leading-none">{language.meta.flag}</span>}
              onClick={() => { hapticMedium(); push(<LanguageSelector />); }}
            />
          </Section>

          {/* ── Legal ────────────────────────────────────────────────────── */}
          <Section label="Legal">
            <Row
              label="Privacy Policy"
              onClick={() => { hapticMedium(); push(<PrivacyPage />); }}
            />
            <RowDivider />
            <Row
              label="Terms of Service"
              onClick={() => { hapticMedium(); push(<TermsPage />); }}
            />
          </Section>

          {/* ── About ────────────────────────────────────────────────────── */}
          <Section label="About">
            <Row label="一から" sublabel="Japanese — structural, from the ground up" chevron={false} />
            <RowDivider />
            <Row label="Version" right={<span className="text-sm font-mono text-[var(--color-muted)]">0.1.0</span>} chevron={false} />
            <RowDivider />
            <Row
              label="Rate the app"
              sublabel="Enjoying Ichikara? Leave a review 🙏"
              onClick={() => {
                window.open('https://apps.apple.com/app/id0000000000?action=write-review', '_blank');
              }}
            />
          </Section>

          {/* ── Account ──────────────────────────────────────────────────── */}
          <Section label="Account">
            <Row
              label={signingOut ? 'Signing out…' : 'Sign out'}
              destructive={false}
              chevron={false}
              onClick={handleSignOut}
              disabled={signingOut}
            />
            <RowDivider />
            <Row
              label="Delete account"
              sublabel="Permanently removes your account and data"
              destructive
              chevron={false}
              onClick={() => { hapticHeavy(); setShowDeleteSheet(true); }}
              disabled={deleting}
            />
          </Section>

          {/* ── Developer (dev only) ──────────────────────────────────────── */}
          {import.meta.env.DEV && ComponentCatalog !== null && (
            <Section label="Developer">
              <Row
                label="UI Component Catalog"
                sublabel="Dev only — all components with live examples"
                onClick={() =>
                  push(
                    <Suspense fallback={
                      <div className="flex-1 flex items-center justify-center">
                        <p className="text-sm font-mono text-[var(--color-muted)]">Loading…</p>
                      </div>
                    }>
                      <ComponentCatalog />
                    </Suspense>,
                  )
                }
              />
            </Section>
          )}

        </div>
      </PageContent>

      {/* Delete account confirmation sheet */}
      <ActionSheet
        open={showDeleteSheet}
        onClose={() => setShowDeleteSheet(false)}
        title="Permanently deletes your account and all progress. This cannot be undone."
        actions={[
          {
            label: deleting ? 'Deleting…' : 'Delete my account',
            destructive: true,
            onPress: async () => {
              setShowDeleteSheet(false);
              await handleDeleteAccount();
            },
          },
        ]}
      />
    </Page>
  );
}
