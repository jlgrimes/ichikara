import { useState } from 'react';
import { Navbar, Page, PageContent } from '../lib/ui';
import { ParticleCard } from '../components/ParticleCard';
import { PARTICLES } from '../data/particles';

export function ParticlesView() {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  return (
    <Page>
      <Navbar title="Particle Type System" />

      <PageContent>
        <div className="max-w-2xl mx-auto px-4 py-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
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
      </PageContent>
    </Page>
  );
}
