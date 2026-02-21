import { useState } from 'react';
import type { Particle } from '../data/particles';
import { SentenceParser } from './SentenceParser';

interface ParticleCardProps {
  particle: Particle;
  onClick?: () => void;
  expanded?: boolean;
}

export function ParticleCard({ particle, onClick, expanded = false }: ParticleCardProps) {
  const [showExample, setShowExample] = useState(false);

  return (
    <div
      className={`
        bg-[var(--surface-solid)] rounded-2xl border border-[var(--surface-border)] shadow-sm overflow-hidden
        transition-all cursor-pointer
        ${expanded ? 'shadow-md' : 'hover:shadow-md'}
      `}
      onClick={onClick}
    >
      {/* Header */}
      <div className="p-5 flex items-center gap-4">
        <span className="text-5xl font-bold text-[var(--color-ink)]">{particle.kana}</span>
        <div>
          <p className="text-sm font-mono text-gray-500 dark:text-gray-400">{particle.label}</p>
          <p className="text-xs text-gray-400 uppercase tracking-widest mt-0.5">
            {particle.type}
          </p>
        </div>
      </div>

      {/* Structural explanation */}
      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-[var(--surface-border)] pt-4">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {particle.structural}
          </p>

          {/* Example toggle */}
          <button
            className="text-sm font-medium text-[var(--color-accent)] hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              setShowExample(!showExample);
            }}
          >
            {showExample ? 'Hide example' : 'See it in a sentence →'}
          </button>

          {showExample && (
            <div className="bg-[var(--color-paper)] rounded-xl p-4">
              <SentenceParser
                sentence={particle.example.sentence}
                parts={particle.example.breakdown}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
