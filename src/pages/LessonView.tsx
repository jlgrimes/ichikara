import { ConceptHero } from '../components/ConceptHero';
import { CURRICULUM } from '../data/curriculum';
import { useSwipeBack } from '../hooks/useSwipeBack';

interface LessonViewProps {
  lessonId: string;
  onBack: () => void;
}

export function LessonView({ lessonId, onBack }: LessonViewProps) {
  const lesson = CURRICULUM.find((l) => l.id === lessonId);
  const pageRef = useSwipeBack(onBack);

  if (!lesson) return null;

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
        <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">
          Module {lesson.module}
        </span>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero */}
        <ConceptHero
          japanese={lesson.sample.japanese}
          highlightedTerm={lesson.sample.highlightedTerm}
          literal={lesson.sample.literal}
          natural={lesson.sample.natural}
        />

        <div className="max-w-lg mx-auto px-4 pb-12 space-y-8">
          {/* Title */}
          <div>
            <h1 className="text-2xl font-black text-[var(--color-ink)] mb-0.5">{lesson.title}</h1>
            <p className="text-gray-500 text-sm">{lesson.subtitle}</p>
          </div>

          {/* Structural concept */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">
              Structural Concept
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">{lesson.concept}</p>
          </div>

          {/* Sections with mini-heroes OR flat key points */}
          {lesson.sections && lesson.sections.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {lesson.sections.map((section, i) => (
                <div key={i} className={i > 0 ? 'pt-6' : ''}>
                  <ConceptHero
                    japanese={section.sample.japanese}
                    highlightedTerm={section.sample.highlightedTerm}
                    literal={section.sample.literal}
                    natural={section.sample.natural}
                    size="section"
                  />
                  <ul className="space-y-2 mt-2">
                    {section.points.map((point, j) => (
                      <li key={j} className="flex gap-3 items-start">
                        <span className="text-[var(--color-accent)] font-bold mt-0.5 shrink-0">→</span>
                        <span className="text-gray-700 text-sm leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">
                Key Points
              </p>
              <ul className="space-y-3">
                {lesson.keyPoints.map((point, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="text-[var(--color-accent)] font-bold mt-0.5 shrink-0">→</span>
                    <span className="text-gray-700 text-sm leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
