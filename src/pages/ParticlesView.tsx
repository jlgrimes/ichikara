import { useState } from 'react';
import { ParticleCard } from '../components/ParticleCard';
import { PARTICLES } from '../data/particles';
import { useSwipeBack } from '../hooks/useSwipeBack';

interface ParticlesViewProps {
  onBack: () => void;
}

export function ParticlesView({ onBack }: ParticlesViewProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const pageRef = useSwipeBack(onBack);

  return (
    <div ref={pageRef} className="h-full flex flex-col">
      {/* Header */}
      <header className="shrink-0 bg-[var(--color-paper)]/90 backdrop-blur border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-[var(--color-accent)] font-medium text-sm flex items-center gap-1"
        >
          ‹ Back
        </button>
        <span className="text-sm font-bold text-[var(--color-ink)]">Particle Type System</span>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-8">
          <p className="text-sm text-gray-500 mb-6">
            Particles determine the role of every noun. Master these and the skeleton of Japanese is yours.
          </p>
          <div className="space-y-3">
            {Object.entries(PARTICLES).map(([key, particle]) => (
              <ParticleCard
                key={key}
                particle={particle}
                expanded={activeKey === key}
                onClick={() => setActiveKey(activeKey === key ? null : key)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
