import { Navbar, Page, PageContent } from '../lib/ui';
import { ConceptHero } from '../components/ConceptHero';
import { CURRICULUM } from '../data/curriculum';

interface LessonViewProps {
  lessonId: string;
}

export function LessonView({ lessonId }: LessonViewProps) {
  const lesson = CURRICULUM.find((l) => l.id === lessonId);
  if (!lesson) return null;

  return (
    <Page>
      <Navbar title={`Module ${lesson.module}`} />

      <PageContent>
        {/* Big hero */}
        <ConceptHero
          japanese={lesson.sample.japanese}
          highlightedTerm={lesson.sample.highlightedTerm}
          literal={lesson.sample.literal}
          natural={lesson.sample.natural}
        />

        <div className="max-w-lg mx-auto px-4 pb-16 space-y-6">

          {/* Title */}
          <div>
            <h1 className="text-2xl font-black text-[var(--color-ink)] mb-0.5">{lesson.title}</h1>
            <p className="text-gray-500 text-sm">{lesson.subtitle}</p>
          </div>

          {/* Structural concept */}
          <div>
            <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">
              Structural Concept
            </p>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <p className="text-gray-700 text-sm leading-relaxed">{lesson.concept}</p>
            </div>
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
              <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">Key Points</p>
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
      </PageContent>
    </Page>
  );
}
