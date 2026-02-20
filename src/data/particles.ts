export type PartType =
  | 'noun'
  | 'topic'
  | 'subject'
  | 'object'
  | 'verb'
  | 'target'
  | 'location'
  | 'possession'
  | 'copula'
  | 'unknown';

export interface Particle {
  kana: string;
  label: string;
  type: PartType;
  structural: string; // no English gloss — structural explanation
  example: {
    sentence: string;
    breakdown: SentencePart[];
  };
}

export interface SentencePart {
  text: string;
  type: PartType;
  label: string;
  structural: string;
}

export const PARTICLES: Record<string, Particle> = {
  は: {
    kana: 'は',
    label: 'は (wa)',
    type: 'topic',
    structural:
      'Sets the topic of the sentence — what the sentence is about. Does NOT mean "subject". Everything after は comments on the topic. Think of it as: "As for X..."',
    example: {
      sentence: '猫は魚を食べる',
      breakdown: [
        { text: '猫', type: 'noun', label: 'NOUN', structural: 'A thing. Carries no role until a particle attaches.' },
        { text: 'は', type: 'topic', label: 'TOPIC', structural: 'Sets 猫 as what we are talking about.' },
        { text: '魚', type: 'noun', label: 'NOUN', structural: 'Another thing.' },
        { text: 'を', type: 'object', label: 'OBJECT', structural: 'Marks 魚 as the thing receiving the action.' },
        { text: '食べる', type: 'verb', label: 'VERB', structural: 'The action. Always comes last.' },
      ],
    },
  },
  が: {
    kana: 'が',
    label: 'が (ga)',
    type: 'subject',
    structural:
      'Marks the grammatical subject — the thing doing or being. Unlike は, が identifies WHICH thing is doing the action, not just what the sentence is about.',
    example: {
      sentence: '猫が来た',
      breakdown: [
        { text: '猫', type: 'noun', label: 'NOUN', structural: 'A thing.' },
        { text: 'が', type: 'subject', label: 'SUBJECT', structural: 'Identifies 猫 as the doer of the action.' },
        { text: '来た', type: 'verb', label: 'VERB (past)', structural: 'Completed action.' },
      ],
    },
  },
  を: {
    kana: 'を',
    label: 'を (wo)',
    type: 'object',
    structural:
      'Marks the direct object — the thing the verb acts upon. In "A eats B", を marks B. Always attaches to the thing receiving the action.',
    example: {
      sentence: '水を飲む',
      breakdown: [
        { text: '水', type: 'noun', label: 'NOUN', structural: 'A thing.' },
        { text: 'を', type: 'object', label: 'OBJECT', structural: 'Marks 水 as the thing being drunk.' },
        { text: '飲む', type: 'verb', label: 'VERB', structural: 'The action.' },
      ],
    },
  },
  に: {
    kana: 'に',
    label: 'に (ni)',
    type: 'target',
    structural:
      'Marks a point in space, time, or direction — a destination, target, or moment. Think of it as a pin: it pins an action to a specific point.',
    example: {
      sentence: '学校に行く',
      breakdown: [
        { text: '学校', type: 'noun', label: 'NOUN', structural: 'A thing (school).' },
        { text: 'に', type: 'target', label: 'TARGET', structural: 'Pins the action to 学校 as its destination.' },
        { text: '行く', type: 'verb', label: 'VERB', structural: 'The action (to go).' },
      ],
    },
  },
  で: {
    kana: 'で',
    label: 'で (de)',
    type: 'location',
    structural:
      'Marks where an action takes place, or what tool/means is used. Unlike に (destination), で marks the context in which action happens.',
    example: {
      sentence: '公園で走る',
      breakdown: [
        { text: '公園', type: 'noun', label: 'NOUN', structural: 'A thing (park).' },
        { text: 'で', type: 'location', label: 'CONTEXT', structural: 'Marks 公園 as where the running happens.' },
        { text: '走る', type: 'verb', label: 'VERB', structural: 'The action.' },
      ],
    },
  },
  の: {
    kana: 'の',
    label: 'の (no)',
    type: 'possession',
    structural:
      'Links two nouns. The noun before の modifies the noun after it. Used for possession, belonging, or categorization. Like a → in a type annotation.',
    example: {
      sentence: '猫の足',
      breakdown: [
        { text: '猫', type: 'noun', label: 'NOUN', structural: 'The possessor.' },
        { text: 'の', type: 'possession', label: 'LINK', structural: 'Links 猫 to 足 — 猫 modifies 足.' },
        { text: '足', type: 'noun', label: 'NOUN', structural: 'The thing being modified.' },
      ],
    },
  },
};
