import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { Home } from './pages/Home';
import { LessonView } from './pages/LessonView';
import { ParticlesView } from './pages/ParticlesView';

type Route =
  | { page: 'home' }
  | { page: 'lesson'; id: string }
  | { page: 'particles' };

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '100%' : '-25%',
    opacity: dir > 0 ? 1 : 0.6,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? '-25%' : '100%',
    opacity: dir > 0 ? 0.6 : 1,
  }),
};

const slideTransition = {
  type: 'tween' as const,
  ease: 'easeInOut' as const,
  duration: 0.3,
};

function routeKey(r: Route) {
  if (r.page === 'lesson') return `lesson-${r.id}`;
  return r.page;
}

function routeDepth(r: Route) {
  if (r.page === 'home') return 0;
  return 1;
}

function AppShell() {
  const { session, loading, signOut } = useAuth();
  const [route, setRoute] = useState<Route>({ page: 'home' });
  const [direction, setDirection] = useState(1);

  const navigate = (next: Route) => {
    const dir = routeDepth(next) >= routeDepth(route) ? 1 : -1;
    setDirection(dir);
    setRoute(next);
  };

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
    <div className="min-h-screen bg-[var(--color-paper)] overflow-hidden">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-[var(--color-paper)]/90 backdrop-blur border-b border-gray-100 px-4 py-3 flex items-center justify-between max-w-lg mx-auto">
        <button
          onClick={() => navigate({ page: 'home' })}
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

      {/* Slide container — clips the slide animation */}
      <div className="relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={routeKey(route)}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            className="w-full"
          >
            {route.page === 'home' && (
              <Home
                onSelectLesson={(id) => navigate({ page: 'lesson', id })}
                onGoToParticles={() => navigate({ page: 'particles' })}
              />
            )}
            {route.page === 'lesson' && (
              <LessonView
                lessonId={route.id}
                onBack={() => navigate({ page: 'home' })}
              />
            )}
            {route.page === 'particles' && (
              <ParticlesView onBack={() => navigate({ page: 'home' })} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
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
