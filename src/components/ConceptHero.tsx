interface ConceptHeroProps {
  japanese: string;
  highlightedTerm: string;
  literal: string;
  natural: string;
}

export function ConceptHero({ japanese, highlightedTerm, literal, natural }: ConceptHeroProps) {
  const idx = japanese.indexOf(highlightedTerm);
  const before = idx >= 0 ? japanese.slice(0, idx) : japanese;
  const after = idx >= 0 ? japanese.slice(idx + highlightedTerm.length) : '';
  const found = idx >= 0;

  return (
    <div className="text-center py-12 px-6">
      {/* Big Japanese sentence */}
      <p className="text-6xl font-black text-[var(--color-ink)] leading-tight mb-8 tracking-wide">
        {before}
        {found && (
          <span className="text-[var(--color-accent)] relative">
            {highlightedTerm}
            <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-[var(--color-accent)] opacity-40 rounded-full" />
          </span>
        )}
        {after}
      </p>

      {/* Translation line */}
      <div className="flex items-baseline justify-center gap-3 flex-wrap">
        <span className="text-base text-[var(--color-ink)] font-mono font-medium">
          {literal}
        </span>
        <span className="text-gray-300 font-light">—</span>
        <span className="text-base text-gray-400 italic">
          {natural}
        </span>
      </div>
    </div>
  );
}
