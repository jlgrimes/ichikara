import { useState } from 'react';
import type { SentencePart, PartType } from '../data/particles';

interface SentenceParserProps {
  parts: SentencePart[];
  sentence: string;
}

const TYPE_COLORS: Record<PartType, string> = {
  noun:      'bg-emerald-100 border-emerald-500 text-emerald-900',
  topic:     'bg-yellow-100 border-yellow-500 text-yellow-900',
  subject:   'bg-blue-100 border-blue-500 text-blue-900',
  object:    'bg-orange-100 border-orange-500 text-orange-900',
  verb:      'bg-red-100 border-red-700 text-red-900',
  target:    'bg-purple-100 border-purple-500 text-purple-900',
  location:  'bg-teal-100 border-teal-500 text-teal-900',
  possession:'bg-pink-100 border-pink-500 text-pink-900',
  copula:    'bg-gray-100 border-gray-500 text-gray-900',
  unknown:   'bg-gray-100 border-gray-300 text-gray-700',
};

const LABEL_COLORS: Record<PartType, string> = {
  noun:      'text-emerald-600',
  topic:     'text-yellow-600',
  subject:   'text-blue-600',
  object:    'text-orange-600',
  verb:      'text-red-700',
  target:    'text-purple-600',
  location:  'text-teal-600',
  possession:'text-pink-600',
  copula:    'text-gray-600',
  unknown:   'text-gray-500',
};

export function SentenceParser({ parts, sentence }: SentenceParserProps) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="w-full">
      {/* Full sentence */}
      <p className="text-center text-3xl font-bold tracking-widest mb-8 text-[var(--color-ink)]">
        {sentence}
      </p>

      {/* Parsed parts */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        {parts.map((part, i) => (
          <button
            key={i}
            onClick={() => setActive(active === i ? null : i)}
            className={`
              flex flex-col items-center px-4 py-3 rounded-xl border-2 transition-all
              ${TYPE_COLORS[part.type]}
              ${active === i ? 'scale-105 shadow-lg' : 'hover:scale-102 hover:shadow-md'}
            `}
          >
            <span className="text-2xl font-bold">{part.text}</span>
            <span className={`text-xs font-mono mt-1 ${LABEL_COLORS[part.type]}`}>
              {part.label}
            </span>
          </button>
        ))}
      </div>

      {/* Structural explanation panel */}
      {active !== null && (
        <div className={`
          rounded-2xl border-2 p-5 transition-all
          ${TYPE_COLORS[parts[active].type]}
        `}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl font-bold">{parts[active].text}</span>
            <span className={`text-sm font-mono font-semibold ${LABEL_COLORS[parts[active].type]}`}>
              {parts[active].label}
            </span>
          </div>
          <p className="text-sm leading-relaxed opacity-90">
            {parts[active].structural}
          </p>
        </div>
      )}
    </div>
  );
}
