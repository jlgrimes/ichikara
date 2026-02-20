import { CURRICULUM } from '../data/curriculum';
import { ConceptHero } from '../components/ConceptHero';

interface LessonViewProps {
  lessonId: string;
  onBack: () => void;
}

export function LessonView({ lessonId, onBack }: LessonViewProps) {
  const lesson = CURRICULUM.find((l) => l.id === lessonId);
  if (!lesson) return null;

  return (
    <div className="max-w-lg mx-auto">
      {/* Back */}
      <div className="px-4 pt-6">
        <button
          onClick={onBack}
          className="text-sm text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors"
        >
          ← back
        </button>
      </div>

      {/* Concept hero — big centered Japanese + translation */}
      <ConceptHero
        japanese={lesson.sample.japanese}
        highlightedTerm={lesson.sample.highlightedTerm}
        literal={lesson.sample.literal}
        natural={lesson.sample.natural}
      />

      <div className="px-4 pb-10">
        {/* Module badge + title */}
        <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-1">
          Module {lesson.module}
        </p>
        <h1 className="text-2xl font-black text-[var(--color-ink)] mb-1">{lesson.title}</h1>
        <p className="text-gray-500 mb-8">{lesson.subtitle}</p>

        {/* Structural concept */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">
            Structural Concept
          </p>
          <p className="text-gray-800 leading-relaxed text-sm">{lesson.concept}</p>
        </div>

        {/* Sections (with mini-hero headers) OR flat key points */}
        {lesson.sections && lesson.sections.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {lesson.sections.map((section, i) => (
              <div key={i}>
                <ConceptHero
                  japanese={section.sample.japanese}
                  highlightedTerm={section.sample.highlightedTerm}
                  literal={section.sample.literal}
                  natural={section.sample.natural}
                  size="section"
                />
                <ul className="space-y-3 pb-6">
                  {section.points.map((point, j) => (
                    <li key={j} className="flex gap-3 items-start">
                      <span className="text-[var(--color-accent)] font-bold mt-0.5">→</span>
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
                  <span className="text-[var(--color-accent)] font-bold mt-0.5">→</span>
                  <span className="text-gray-700 text-sm leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
