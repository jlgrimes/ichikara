export interface Lesson {
  id: string;
  module: number;
  title: string;
  subtitle: string;
  concept: string; // structural concept, no translation gloss
  keyPoints: string[];
  practiceItems: PracticeItem[];
}

export interface PracticeItem {
  type: 'identify' | 'build' | 'read';
  prompt: string;
  content: string;
}

export const CURRICULUM: Lesson[] = [
  {
    id: 'nouns',
    module: 0,
    title: '名詞 — Nouns',
    subtitle: 'The raw material',
    concept:
      'Nouns in Japanese carry no inherent role. A noun is just a thing — inert, untyped. Its role in a sentence is determined entirely by the particle that follows it. This is fundamentally different from English, where word order determines role.',
    keyPoints: [
      'No gender (unlike French, Spanish)',
      'No plural form (猫 = one cat, many cats, the cats)',
      'No articles (no "a" or "the")',
      'Role is determined by particle, not position',
    ],
    practiceItems: [],
  },
  {
    id: 'copula',
    module: 0,
    title: 'だ / です — The Copula',
    subtitle: 'The equals sign',
    concept:
      'だ and です are the copula — they connect a subject to what it is. Think of them as the = operator. "猫だ" means [thing] = [cat]. です is the polite register; だ is plain. Neither is "more correct" — they are the same statement at different register levels.',
    keyPoints: [
      'だ = plain register (casual)',
      'です = polite register (formal contexts)',
      'Not a verb — it does not express action',
      'Can be omitted in casual speech',
    ],
    practiceItems: [],
  },
  {
    id: 'wa',
    module: 1,
    title: 'は — Topic Marker',
    subtitle: 'Setting context',
    concept:
      'は does not mean "subject". It sets the topic — the thing the sentence comments on. Everything after は is a statement about that topic. A sentence can have a topic (は) and a separate subject (が) at the same time.',
    keyPoints: [
      'は marks the topic, not the subject',
      '"猫は" = "As for the cat..." or "Speaking of the cat..."',
      'Topic can be anything — time, place, object',
      'Contrast with が: は = "here is what we are talking about", が = "here is who does it"',
    ],
    practiceItems: [],
  },
  {
    id: 'ga',
    module: 1,
    title: 'が — Subject Marker',
    subtitle: 'The doer',
    concept:
      'が identifies the grammatical subject — specifically the entity performing or experiencing the predicate. Unlike は, が answers the question "which one?" It introduces new information or makes a specific identification.',
    keyPoints: [
      'が marks the doer or experiencer',
      'Used when identifying specifically who/what',
      'New information vs は which is known/established context',
      'Some verbs (like 好き, わかる) take が instead of を for their "object"',
    ],
    practiceItems: [],
  },
  {
    id: 'wo',
    module: 1,
    title: 'を — Object Marker',
    subtitle: 'The receiver',
    concept:
      'を marks the direct object — the thing the verb acts upon. It has one job. In "[A]が[B]を[VERB]", を tells you B is the thing being verbed.',
    keyPoints: [
      'を marks the thing receiving the action',
      'Only attaches to nouns',
      'Always comes before the verb',
      'No equivalent in English — word order does this job in English',
    ],
    practiceItems: [],
  },
  {
    id: 'ni',
    module: 1,
    title: 'に — Target / Point',
    subtitle: 'The pin',
    concept:
      'に pins an action to a specific point — a destination in space, a moment in time, or a recipient. Think of に as placing a pin on a map or timeline. It answers "where to?" or "when?" or "to whom?"',
    keyPoints: [
      'Destination: 学校に行く (go TO school)',
      'Time: 三時に (AT 3 o\'clock)',
      'Recipient: 友達に言う (say TO a friend)',
      'Existence location: 公園にいる (exist AT the park)',
    ],
    practiceItems: [],
  },
  {
    id: 'de',
    module: 1,
    title: 'で — Context / Means',
    subtitle: 'The stage',
    concept:
      'で marks where an action occurs or the means by which it is done. Unlike に (a point), で marks the arena or tool. "公園で遊ぶ" — the park is not a destination, it is the stage the playing happens on.',
    keyPoints: [
      'Location of action: 図書館で読む (read AT/IN the library)',
      'Means: バスで行く (go BY bus)',
      'Material: 木で作る (make FROM/WITH wood)',
      'Contrast with に: に = destination/point, で = stage/means',
    ],
    practiceItems: [],
  },
  {
    id: 'no',
    module: 1,
    title: 'の — Noun Linker',
    subtitle: 'The modifier chain',
    concept:
      'の links two nouns. The noun before の modifies or belongs to the noun after it. It is not just possession — it expresses any relationship between two nouns where the first categorizes or qualifies the second.',
    keyPoints: [
      'Possession: 猫の足 (the cat\'s foot)',
      'Categorization: 日本の車 (a car OF Japan = a Japanese car)',
      'Apposition: 友達の田中さん (my friend Tanaka)',
      'Can chain: 日本の猫の足 = the foot of Japan\'s cat',
    ],
    practiceItems: [],
  },
];
