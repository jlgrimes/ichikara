import { useState } from 'react';
import { Page, PageContent, useNavigation } from '../lib/ui';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { PrivacyPage } from './PrivacyPage';
import { TermsPage } from './TermsPage';

interface SettingsViewProps {
  onSignOut: () => void;
}

export function SettingsView({ onSignOut }: SettingsViewProps) {
  const { session }  = useAuth();
  const { push }     = useNavigation();
  const { language } = useLanguage();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try { await onSignOut(); }
    finally { setSigningOut(false); }
  };

  return (
    <Page>
      {/* Safe area fill */}
      <div
        className="shrink-0 bg-[var(--color-paper)]"
        style={{ height: 'env(safe-area-inset-top)' }}
      />

      <PageContent>
        <div className="max-w-lg mx-auto px-4 space-y-8">

          {/* Large title */}
          <div className="pt-6 pb-2">
            <h1 className="text-[42px] font-black text-[var(--color-ink)] tracking-tight leading-none">
              Settings
            </h1>
          </div>

          {/* Language */}
          <div>
            <p className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 px-1">
              Language
            </p>
            <button
              onClick={() => push(<LanguageSelector />)}
              className="w-full bg-[var(--surface-bg)] backdrop-blur-sm rounded-3xl border border-[var(--surface-border)] shadow-[0_2px_16px_rgba(0,0,0,0.06)] px-5 py-4 flex items-center gap-3 active:scale-[0.98] active:bg-[var(--surface-active)] transition-all select-none"
            >
              <span className="text-2xl leading-none">{language.meta.flag}</span>
              <div className="flex-1 text-left">
                <p className="text-sm font-bold text-[var(--color-ink)]">{language.meta.name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{language.meta.nativeName}</p>
              </div>
              <span className="text-gray-300 dark:text-gray-600 text-xl leading-none">›</span>
            </button>
          </div>

          {/* Account */}
          <div>
            <p className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 px-1">
              Account
            </p>
            <div className="bg-[var(--surface-bg)] backdrop-blur-sm rounded-3xl border border-[var(--surface-border)] shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="px-5 py-4 border-b border-[var(--surface-border)]">
                <p className="text-[11px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-0.5">
                  Signed in as
                </p>
                <p className="text-sm font-medium text-[var(--color-ink)]">
                  {session?.user?.email ?? '—'}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className={[
                  'w-full px-5 py-4 text-left font-medium text-sm transition-colors select-none',
                  signingOut
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-[var(--color-accent)] active:bg-[var(--surface-active)]',
                ].join(' ')}
              >
                {signingOut ? 'Signing out…' : 'Sign out'}
              </button>
            </div>
          </div>

          {/* About */}
          <div>
            <p className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 px-1">
              About
            </p>
            <div className="bg-[var(--surface-bg)] backdrop-blur-sm rounded-3xl border border-[var(--surface-border)] shadow-[0_2px_16px_rgba(0,0,0,0.06)] px-5 py-5 space-y-1">
              <p className="text-[17px] font-black text-[var(--color-ink)] tracking-tight">一から</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Japanese — structural, from the ground up</p>
              <p className="text-xs font-mono text-gray-300 dark:text-gray-600 pt-1">v0.1.0</p>
            </div>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 px-1">
              Legal
            </p>
            <div className="bg-[var(--surface-bg)] backdrop-blur-sm rounded-3xl border border-[var(--surface-border)] shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
              <button
                onClick={() => push(<PrivacyPage />)}
                className="w-full px-5 py-4 flex items-center justify-between border-b border-[var(--surface-border)] active:bg-[var(--surface-active)] transition-colors select-none"
              >
                <p className="text-sm font-medium text-[var(--color-ink)]">Privacy Policy</p>
                <span className="text-gray-300 dark:text-gray-600 text-xl leading-none">›</span>
              </button>
              <button
                onClick={() => push(<TermsPage />)}
                className="w-full px-5 py-4 flex items-center justify-between active:bg-[var(--surface-active)] transition-colors select-none"
              >
                <p className="text-sm font-medium text-[var(--color-ink)]">Terms of Service</p>
                <span className="text-gray-300 dark:text-gray-600 text-xl leading-none">›</span>
              </button>
            </div>
          </div>

        </div>
      </PageContent>
    </Page>
  );
}
