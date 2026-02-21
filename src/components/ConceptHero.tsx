interface ConceptHeroProps {
  target: string;
  highlightedTerm: string;
  literal: string;
  natural: string;
  size?: 'hero' | 'section'; // hero = large centered, section = small left-aligned
}

export function ConceptHero({
  target,
  highlightedTerm,
  literal,
  natural,
  size = 'hero',
}: ConceptHeroProps) {
  const idx = target.indexOf(highlightedTerm);
  const before = idx >= 0 ? target.slice(0, idx) : target;
  const after = idx >= 0 ? target.slice(idx + highlightedTerm.length) : '';
  const found = idx >= 0;

  const Highlighted = () => (
    <>
      {before}
      {found && (
        <span className="text-[var(--color-accent)] relative">
          {highlightedTerm}
          <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-[var(--color-accent)] opacity-40 rounded-full" />
        </span>
      )}
      {after}
    </>
  );

  if (size === 'section') {
    return (
      <div className="py-5">
        <p className="text-3xl font-black text-[var(--color-ink)] leading-tight mb-2 tracking-wide">
          <Highlighted />
        </p>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-sm font-mono font-medium text-[var(--color-ink)]">
            {literal}
          </span>
          <span className="text-gray-300">—</span>
          <span className="text-sm text-gray-400 dark:text-gray-500 italic">{natural}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-12 px-6">
      <p className="text-6xl font-black text-[var(--color-ink)] leading-tight mb-8 tracking-wide">
        <Highlighted />
      </p>
      <div className="flex items-baseline justify-center gap-3 flex-wrap">
        <span className="text-base text-[var(--color-ink)] font-mono font-medium">
          {literal}
        </span>
        <span className="text-gray-300 font-light">—</span>
        <span className="text-base text-gray-400 dark:text-gray-500 italic">{natural}</span>
      </div>
    </div>
  );
}
