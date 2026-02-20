import { useState } from 'react';
import { Home } from './pages/Home';
import { LessonView } from './pages/LessonView';
import { ParticlesView } from './pages/ParticlesView';

type Route =
  | { page: 'home' }
  | { page: 'lesson'; id: string }
  | { page: 'particles' };

export default function App() {
  const [route, setRoute] = useState<Route>({ page: 'home' });

  return (
    <div className="min-h-screen bg-[var(--color-paper)]">
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
