import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NavigationStack, TabBar } from './lib/ui';
import { AuthPage } from './pages/AuthPage';
import { Home } from './pages/Home';
import { SOSHome } from './pages/SOSHome';

type Tab = 'grammar' | 'sos';

const TABS = [
  { id: 'grammar', icon: '文', label: 'Grammar' },
  { id: 'sos',     icon: '助', label: 'SOS'     },
];

function AppShell() {
  const { session, loading, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>('grammar');

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
      {/* Grammar tab — keeps its own navigation stack mounted */}
      <div className={tab === 'grammar' ? 'absolute inset-0' : 'hidden'}>
        <NavigationStack initialPage={<Home onSignOut={signOut} />} />
      </div>

      {/* SOS tab — separate navigation stack, also kept mounted */}
      <div className={tab === 'sos' ? 'absolute inset-0' : 'hidden'}>
        <NavigationStack initialPage={<SOSHome />} />
      </div>

      {/* Floating iOS 26 tab bar — sits over both stacks */}
      <TabBar<Tab>
        tabs={TABS}
        activeTab={tab}
        onChange={setTab}
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
