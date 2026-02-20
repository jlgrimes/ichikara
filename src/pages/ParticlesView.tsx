import { Block, BlockTitle, Navbar, NavbarBackLink, Page } from 'konsta/react';
import { useState } from 'react';
import { ParticleCard } from '../components/ParticleCard';
import { PARTICLES } from '../data/particles';

interface ParticlesViewProps {
  onBack: () => void;
}

export function ParticlesView({ onBack }: ParticlesViewProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  return (
    <Page>
      <Navbar
        title="Particle Type System"
        left={<NavbarBackLink text="Back" onClick={onBack} />}
      />

      <Block>
        <p className="text-sm text-gray-500">
          Particles determine the role of every noun. Master these and the skeleton of Japanese is yours.
        </p>
      </Block>

      <BlockTitle>Core Particles</BlockTitle>
      <Block>
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
      </Block>
    </Page>
  );
}
