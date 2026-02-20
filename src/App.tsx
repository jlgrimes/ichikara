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

// Pure slide — no opacity, no fade. Both pages move at the same time.
const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '100%' : '-30%',
  }),
  center: {
    x: 0,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? '-30%' : '100%',
  }),
};

const slideTransition = {
  type: 'tween' as const,
  ease: [0.25, 0.46, 0.45, 0.94] as unknown as 'easeOut',
  duration: 0.32,
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
    setDirection(routeDepth(next) >= routeDepth(route) ? 1 : -1);
    setRoute(next);
  };

  if (loading) {
    return (
      <div className="h-dvh bg-[var(--color-paper)] flex items-center justify-center">
        <p className="text-gray-400 text-sm font-mono">loading...</p>
      </div>
    );
  }

  if (!session) {
    return <AuthPage />;
  }

  return (
    // Full-height flex column — header is fixed size, slide area fills the rest
    <div className="h-dvh flex flex-col bg-[var(--color-paper)] overflow-hidden">
      {/* Header — fixed at top */}
      <header className="z-20 shrink-0 bg-[var(--color-paper)]/90 backdrop-blur border-b border-gray-100 px-4 py-3 flex items-center justify-between">
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

      {/* Slide area — relative + overflow-hidden clips the animation */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="sync">
          <motion.div
            key={routeKey(route)}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            // absolute + inset-0 so both entering/exiting pages sit on top of each other
            // overflow-y-auto gives each page its own independent scroll
            className="absolute inset-0 overflow-y-auto"
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
