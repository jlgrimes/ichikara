import { AnimatePresence, motion } from 'framer-motion';
import { KonstaProvider } from 'konsta/react';
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
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-30%' }),
  center: { x: 0 },
  exit: (dir: number) => ({ x: dir > 0 ? '-30%' : '100%' }),
};

const slideTransition = {
  type: 'tween' as const,
  ease: 'easeInOut' as const,
  duration: 0.3,
};

function routeKey(r: Route) {
  return r.page === 'lesson' ? `lesson-${r.id}` : r.page;
}
function routeDepth(r: Route) {
  return r.page === 'home' ? 0 : 1;
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

  if (!session) return <AuthPage />;

  return (
    // h-dvh + overflow-hidden = viewport-locked, clips slide animation
    <div className="h-dvh overflow-hidden relative">
      <AnimatePresence initial={false} custom={direction} mode="sync">
        <motion.div
          key={routeKey(route)}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={slideTransition}
          className="absolute inset-0"
        >
          {route.page === 'home' && (
            <Home
              onSelectLesson={(id) => navigate({ page: 'lesson', id })}
              onGoToParticles={() => navigate({ page: 'particles' })}
              onSignOut={signOut}
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
  );
}

export default function App() {
  return (
    <KonstaProvider theme="ios">
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </KonstaProvider>
  );
}
