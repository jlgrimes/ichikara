import { Page, PageContent } from '../lib/ui';
import { useAuth } from '../context/AuthContext';

interface SettingsViewProps {
  onSignOut: () => void;
}

export function SettingsView({ onSignOut }: SettingsViewProps) {
  const { session } = useAuth();

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

          {/* Account */}
          <div>
            <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3 px-1">
              Account
            </p>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/60 shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <p className="text-[11px] font-mono text-gray-400 uppercase tracking-widest mb-0.5">
                  Signed in as
                </p>
                <p className="text-sm font-medium text-[var(--color-ink)]">
                  {session?.user?.email ?? '—'}
                </p>
              </div>
              <button
                onClick={onSignOut}
                className="w-full px-5 py-4 text-left text-[var(--color-accent)] font-medium text-sm active:bg-gray-50 transition-colors select-none"
              >
                Sign out
              </button>
            </div>
          </div>

          {/* About */}
          <div>
            <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3 px-1">
              About
            </p>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/60 shadow-[0_2px_16px_rgba(0,0,0,0.06)] px-5 py-5 space-y-1">
              <p className="text-[17px] font-black text-[var(--color-ink)] tracking-tight">一から</p>
              <p className="text-sm text-gray-500">Japanese — structural, from the ground up</p>
              <p className="text-xs font-mono text-gray-300 pt-1">v0.1.0</p>
            </div>
          </div>

        </div>
      </PageContent>
    </Page>
  );
}
