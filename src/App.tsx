import { AuthProvider, useAuth } from './context/AuthContext';
import { NavigationStack } from './lib/ui';
import { AuthPage } from './pages/AuthPage';
import { Home } from './pages/Home';

function AppShell() {
  const { session, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="h-dvh bg-[var(--color-paper)] flex items-center justify-center">
        <p className="text-gray-400 text-sm font-mono">loading...</p>
      </div>
    );
  }

  if (!session) return <AuthPage />;

  return <NavigationStack initialPage={<Home onSignOut={signOut} />} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
