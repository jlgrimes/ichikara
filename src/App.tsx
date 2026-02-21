import { useCallback, useEffect, useRef, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NavigationStack, TabBar } from './lib/ui';
import { AuthPage } from './pages/AuthPage';
import { Home } from './pages/Home';
import { SOSHome } from './pages/SOSHome';
import { SettingsView } from './pages/SettingsView';

type Tab = 'grammar' | 'sos' | 'settings';

const TABS = [
  { id: 'grammar',  icon: '文', label: 'Grammar'  },
  { id: 'sos',      icon: '助', label: 'SOS'       },
  { id: 'settings', icon: '設', label: 'Settings'  },
];

const TAB_ORDER: Record<Tab, number> = { grammar: 0, sos: 1, settings: 2 };

// Morph animation: cross-fade + subtle directional slide (iOS 26 feel)
const DUR = 260; // ms
const OFFSET = 28; // px — gentle directional push, not a full slide

function AppShell() {
  const { session, loading, signOut } = useAuth();

  // React state drives the tab bar indicator only
  const [activeTab, setActiveTab] = useState<Tab>('grammar');

  const tabRefs   = useRef<Map<Tab, HTMLDivElement>>(new Map());
  const currentTab = useRef<Tab>('grammar');

  // Set initial opacity/pointer-events on mount (avoids flash)
  useEffect(() => {
    tabRefs.current.forEach((el, id) => {
      el.style.opacity      = id === 'grammar' ? '1' : '0';
      el.style.pointerEvents = id === 'grammar' ? 'auto' : 'none';
    });
  }, []);

  const switchTab = useCallback((newTab: Tab) => {
    if (newTab === currentTab.current) return;
    const prevTab = currentTab.current;
    currentTab.current = newTab;
    setActiveTab(newTab);

    const dir    = TAB_ORDER[newTab] > TAB_ORDER[prevTab] ? 1 : -1;
    const prevEl = tabRefs.current.get(prevTab);
    const nextEl = tabRefs.current.get(newTab);
    const ease   = `${DUR}ms cubic-bezier(0.16, 1, 0.3, 1)`;

    // Incoming — place it offset + transparent, then animate in
    if (nextEl) {
      nextEl.style.transition   = 'none';
      nextEl.style.opacity      = '0';
      nextEl.style.transform    = `translateX(${dir * OFFSET}px)`;
      nextEl.style.pointerEvents = 'none';
      nextEl.getBoundingClientRect(); // flush reflow
      nextEl.style.transition   = `opacity ${ease}, transform ${ease}`;
      nextEl.style.opacity      = '1';
      nextEl.style.transform    = 'translateX(0)';
      nextEl.style.pointerEvents = 'auto';
    }

    // Outgoing — fade + slide away
    if (prevEl) {
      prevEl.style.transition   = `opacity ${ease}, transform ${ease}`;
      prevEl.style.opacity      = '0';
      prevEl.style.transform    = `translateX(${-dir * OFFSET}px)`;
      prevEl.style.pointerEvents = 'none';
      // Reset transform silently after animation so it's ready next time
      setTimeout(() => {
        if (prevEl) {
          prevEl.style.transition = 'none';
          prevEl.style.transform  = 'translateX(0)';
        }
      }, DUR + 20);
    }
  }, []);

  if (loading) {
    return (
      <div className="h-dvh bg-[var(--color-paper)] flex items-center justify-center">
        <p className="text-gray-400 text-sm font-mono">loading...</p>
      </div>
    );
  }

  if (!session) return <AuthPage />;

  return (
    <div className="h-dvh overflow-hidden relative bg-[var(--color-paper)]">
      {((['grammar', 'sos', 'settings'] as Tab[])).map(t => (
        <div
          key={t}
          ref={el => { if (el) tabRefs.current.set(t, el); }}
          className="absolute inset-0"
          // Initial visibility is set in useEffect above
          // style here is just a fallback — useEffect overrides
        >
          {t === 'grammar'  && <NavigationStack initialPage={<Home />} />}
          {t === 'sos'      && <NavigationStack initialPage={<SOSHome />} />}
          {t === 'settings' && <NavigationStack initialPage={<SettingsView onSignOut={signOut} />} />}
        </div>
      ))}

      <TabBar<Tab>
        tabs={TABS}
        activeTab={activeTab}
        onChange={switchTab}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
