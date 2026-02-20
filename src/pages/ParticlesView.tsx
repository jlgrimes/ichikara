import { useState } from 'react';
import { PARTICLES } from '../data/particles';
import { ParticleCard } from '../components/ParticleCard';

interface ParticlesViewProps {
  onBack: () => void;
}

export function ParticlesView({ onBack }: ParticlesViewProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      {/* Back */}
      <button
        onClick={onBack}
        className="text-sm text-gray-400 hover:text-gray-700 mb-8 flex items-center gap-1 transition-colors"
      >
        ← back
      </button>

      <h1 className="text-3xl font-black text-[var(--color-ink)] mb-1">Particle Type System</h1>
      <p className="text-sm text-gray-500 mb-8">
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
  );
}
