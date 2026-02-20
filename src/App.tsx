import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { Home } from './pages/Home';
import { LessonView } from './pages/LessonView';
import { ParticlesView } from './pages/ParticlesView';
import { useState } from 'react';

type Route =
  | { page: 'home' }
  | { page: 'lesson'; id: string }
  | { page: 'particles' };

function AppShell() {
  const { session, loading, signOut } = useAuth();
  const [route, setRoute] = useState<Route>({ page: 'home' });

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-paper)] flex items-center justify-center">
        <p className="text-gray-400 text-sm font-mono">loading...</p>
      </div>
    );
  }

  if (!session) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-[var(--color-paper)]">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-[var(--color-paper)]/90 backdrop-blur border-b border-gray-100 px-4 py-3 flex items-center justify-between max-w-lg mx-auto">
        <button
          onClick={() => setRoute({ page: 'home' })}
          className="text-xl font-black text-[var(--color-ink)] tracking-tight"
        >
          一から
        </button>
        <button
          onClick={signOut}
          className="text-xs text-gray-400 hover:text-gray-700 transition font-mono"
        >
          sign out
        </button>
      </header>

      {route.page === 'home' && (
        <Home
          onSelectLesson={(id) => setRoute({ page: 'lesson', id })}
          onGoToParticles={() => setRoute({ page: 'particles' })}
        />
      )}
      {route.page === 'lesson' && (
        <LessonView
          lessonId={route.id}
          onBack={() => setRoute({ page: 'home' })}
        />
      )}
      {route.page === 'particles' && (
        <ParticlesView onBack={() => setRoute({ page: 'home' })} />
      )}
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
