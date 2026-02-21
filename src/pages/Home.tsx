import { Page, PageContent, useNavigation } from '../lib/ui';
import { LessonCard } from '../components/LessonCard';
import { CURRICULUM } from '../data/curriculum';
import { LessonView } from './LessonView';
import { ParticlesView } from './ParticlesView';

const MODULE_LABELS: Record<number, string> = {
  0:  'Primitives',
  1:  'Particle Type System',
  2:  'Verb System',
  3:  'Adjectives',
  4:  'Extended Particles',
  5:  'Clauses & Nominalization',
  6:  'Relative Clauses',
  7:  'て-Auxiliaries',
  8:  'Potential & Passive',
  9:  'Giving & Receiving',
  10: 'Causative',
  11: 'Conditionals',
  12: 'Sentence-Final Particles',
};

const JLPT_GROUPS = [
  {
    level: 'N5', desc: 'Core building blocks',
    modules: [0, 1, 2, 3],
    pill: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    line: 'bg-emerald-100',
  },
  {
    level: 'N4', desc: 'Expanding structure',
    modules: [4, 5, 6, 7, 8, 9],
    pill: 'bg-blue-100 text-blue-700 border-blue-200',
    line: 'bg-blue-100',
  },
  {
    level: 'N3', desc: 'Complex grammar',
    modules: [10, 11, 12],
    pill: 'bg-purple-100 text-purple-700 border-purple-200',
    line: 'bg-purple-100',
  },
];

export function Home() {
  const { push } = useNavigation();

  return (
    <Page>
      {/* Safe area fill — paper color behind status bar, no chrome */}
      <div
        className="shrink-0 bg-[var(--color-paper)]"
        style={{ height: 'env(safe-area-inset-top)' }}
      />

      <PageContent>
        <div className="max-w-lg mx-auto px-4 space-y-10">

          {/* iOS 26 large title — left-aligned, scrolls with content */}
          <div className="pt-6 pb-2">
            <h1 className="text-[42px] font-black text-[var(--color-ink)] tracking-tight leading-none">
              一から
            </h1>
            <p className="text-sm text-gray-400 font-mono mt-1.5">from scratch</p>
          </div>

          {/* Particle system shortcut */}
          <button
            onClick={() => push(<ParticlesView />)}
            className={[
              'w-full text-left rounded-3xl p-6',
              'bg-[var(--color-ink)]',
              'shadow-[0_4px_24px_rgba(26,26,46,0.18)]',
              'active:scale-[0.97] active:opacity-90',
              'transition-all duration-150 ease-out select-none',
            ].join(' ')}
          >
            <p className="text-[11px] font-mono text-white/50 mb-1.5 uppercase tracking-widest">
              Core Reference
            </p>
            <h2 className="text-[19px] font-bold text-white leading-snug">
              Particle Type System
            </h2>
            <p className="text-[13px] text-white/60 mt-1.5">
              は　が　を　に　で　の — the skeleton of every sentence
            </p>
          </button>

          {/* Curriculum grouped by JLPT */}
          {JLPT_GROUPS.map(({ level, desc, modules, pill, line }) => {
            const hasLessons = modules.some(mod => CURRICULUM.some(l => l.module === mod));
            if (!hasLessons) return null;
            return (
              <div key={level} className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className={`flex-1 h-px ${line}`} />
                  <div className="flex flex-col items-center">
                    <span className={`text-[11px] font-mono font-bold px-3 py-1 rounded-full border ${pill}`}>
                      JLPT {level}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono mt-0.5">{desc}</span>
                  </div>
                  <div className={`flex-1 h-px ${line}`} />
                </div>
                {modules.map(mod => {
                  const lessons = CURRICULUM.filter(l => l.module === mod);
                  if (lessons.length === 0) return null;
                  return (
                    <div key={mod} className="space-y-3">
                      <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                        Module {mod} — {MODULE_LABELS[mod]}
                      </p>
                      {lessons.map(lesson => (
                        <LessonCard
                          key={lesson.id}
                          lesson={lesson}
                          onClick={() => push(<LessonView lessonId={lesson.id} />)}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            );
          })}

          <p className="text-xs text-center text-gray-300 font-mono">一から — from scratch</p>
        </div>
      </PageContent>
    </Page>
  );
}
