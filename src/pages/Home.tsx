import {
  Block,
  BlockTitle,
  List,
  ListItem,
  Navbar,
  NavbarBackLink,
  Page,
} from 'konsta/react';
import { CURRICULUM } from '../data/curriculum';

interface HomeProps {
  onSelectLesson: (id: string) => void;
  onGoToParticles: () => void;
  onSignOut: () => void;
}

const MODULE_LABELS: Record<number, string> = {
  0: 'Primitives',
  1: 'Particle Type System',
  2: 'Verb System',
  3: 'Adjectives',
  4: 'Extended Particles',
  5: 'Clauses & Nominalization',
};

export function Home({ onSelectLesson, onGoToParticles, onSignOut }: HomeProps) {
  const modules = [0, 1, 2, 3, 4, 5];

  return (
    <Page>
      <Navbar
        title="一から"
        right={
          <NavbarBackLink
            text="Sign out"
            onClick={onSignOut}
          />
        }
      />

      {/* Core reference shortcut */}
      <Block>
        <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-1">
          Core Reference
        </p>
        <button
          onClick={onGoToParticles}
          className="w-full bg-[var(--color-ink)] text-white rounded-2xl p-5 text-left active:opacity-80 transition-opacity"
        >
          <h2 className="text-lg font-bold">Particle Type System</h2>
          <p className="text-sm opacity-70 mt-0.5">
            は　が　を　に　で　の — the skeleton of every sentence
          </p>
        </button>
      </Block>

      {/* Curriculum modules */}
      {modules.map((mod) => {
        const lessons = CURRICULUM.filter((l) => l.module === mod);
        if (lessons.length === 0) return null;
        return (
          <div key={mod}>
            <BlockTitle>
              Module {mod} — {MODULE_LABELS[mod]}
            </BlockTitle>
            <List>
              {lessons.map((lesson) => (
                <ListItem
                  key={lesson.id}
                  chevron
                  link
                  title={lesson.title}
                  subtitle={lesson.subtitle}
                  onClick={() => onSelectLesson(lesson.id)}
                />
              ))}
            </List>
          </div>
        );
      })}

      <Block>
        <p className="text-xs text-center text-gray-300 font-mono pb-4">一から — from scratch</p>
      </Block>
    </Page>
  );
}
