import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NavigationStack, TabBar, type NavigationHandle } from './lib/ui';
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

// Tab position order — drives slide direction
const TAB_IDX: Record<Tab, number> = { grammar: 0, sos: 1, settings: 2 };
const TAB_LIST = ['grammar', 'sos', 'settings'] as Tab[];

const DUR  = 320; // ms — slightly longer for full-width slide to feel smooth
const EASE = `${DUR}ms cubic-bezier(0.16, 1, 0.3, 1)`;

function AppShell() {
  const { session, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('grammar');

  const tabRefs    = useRef<Map<Tab, HTMLDivElement>>(new Map());
  const navHandles = useRef<Map<Tab, NavigationHandle>>(new Map());
  const currentTab = useRef<Tab>('grammar');

  // useLayoutEffect — fires before paint, so no flash.
  // Pre-position ALL tabs: grammar at 0, sos at +100vw, settings at +200vw.
  // No opacity tricks — pure positional slide, just like iOS.
  useLayoutEffect(() => {
    const winW = window.innerWidth;
    tabRefs.current.forEach((el, id) => {
      const offset = (TAB_IDX[id] - TAB_IDX['grammar']) * winW;
      el.style.transition   = 'none';
      el.style.transform    = `translateX(${offset}px)`;
      el.style.pointerEvents = id === 'grammar' ? 'auto' : 'none';
    });
  }, []); // runs once before first paint

  const switchTab = useCallback((newTab: Tab) => {
    if (newTab === currentTab.current) {
      // Tapping the active tab — pop to root with animation (iOS standard)
      navHandles.current.get(newTab)?.popToRoot(true);
      return;
    }
    const prevTab = currentTab.current;
    // Silently reset the outgoing tab to root so it's clean when you return
    navHandles.current.get(prevTab)?.popToRoot(false);
    currentTab.current = newTab;
    setActiveTab(newTab);

    const winW = window.innerWidth;
    const dir  = TAB_IDX[newTab] > TAB_IDX[prevTab] ? 1 : -1;

    const prevEl = tabRefs.current.get(prevTab);
    const nextEl = tabRefs.current.get(newTab);

    // Snap incoming to exactly 1 screen-width in the correct direction,
    // then animate to 0. This handles non-adjacent tab jumps cleanly.
    if (nextEl) {
      nextEl.style.transition   = 'none';
      nextEl.style.transform    = `translateX(${dir * winW}px)`;
      nextEl.style.pointerEvents = 'none';
      nextEl.getBoundingClientRect(); // flush reflow
      nextEl.style.transition   = `transform ${EASE}`;
      nextEl.style.transform    = 'translateX(0)';
      nextEl.style.pointerEvents = 'auto';
    }

    // Outgoing slides away in the opposite direction
    if (prevEl) {
      prevEl.style.transition   = `transform ${EASE}`;
      prevEl.style.transform    = `translateX(${-dir * winW}px)`;
      prevEl.style.pointerEvents = 'none';
    }

    // After animation, reposition ALL non-active tabs relative to new active.
    // This ensures any tab is always ready to slide in from the correct side.
    setTimeout(() => {
      tabRefs.current.forEach((el, id) => {
        if (id === newTab) return;
        const relativeOffset = (TAB_IDX[id] - TAB_IDX[newTab]) * winW;
        el.style.transition = 'none';
        el.style.transform  = `translateX(${relativeOffset}px)`;
      });
    }, DUR + 16);
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
      {TAB_LIST.map(t => (
        <div
          key={t}
          ref={el => { if (el) tabRefs.current.set(t, el); }}
          className="absolute inset-0 will-change-transform"
        >
          {t === 'grammar'  && <NavigationStack ref={el => { if (el) navHandles.current.set('grammar', el); }}  initialPage={<Home />} />}
          {t === 'sos'      && <NavigationStack ref={el => { if (el) navHandles.current.set('sos', el); }}      initialPage={<SOSHome />} />}
          {t === 'settings' && <NavigationStack ref={el => { if (el) navHandles.current.set('settings', el); }} initialPage={<SettingsView onSignOut={signOut} />} />}
        </div>
      ))}

      <TabBar<Tab> tabs={TABS} activeTab={activeTab} onChange={switchTab} />
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
