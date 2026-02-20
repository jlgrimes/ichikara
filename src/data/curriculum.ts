export interface SampleSentence {
  japanese: string;        // full sentence/phrase in Japanese
  highlightedTerm: string; // the new concept to highlight (substring of japanese)
  literal: string;         // literal breakdown, e.g. "Me (← owner of) dog"
  natural: string;         // natural English, e.g. "My dog"
}

export interface ConceptSection {
  sample: SampleSentence;  // left-aligned section header
  points: string[];        // explanation bullets under this section
}

export interface Lesson {
  id: string;
  module: number;
  title: string;
  subtitle: string;
  sample: SampleSentence;   // big hero at top
  concept: string;          // structural explanation paragraph
  sections?: ConceptSection[]; // grouped content with mini-hero headers
  keyPoints: string[];      // fallback flat list if no sections
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
    sample: {
      japanese: 'ねこ',
      highlightedTerm: 'ねこ',
      literal: 'cat (no role until a particle follows)',
      natural: 'cat / a cat / the cats — same word',
    },
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
    sample: {
      japanese: 'これはねこだ',
      highlightedTerm: 'だ',
      literal: 'this (topic) cat (=)',
      natural: 'This is a cat',
    },
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
    sample: {
      japanese: 'ねこはさかなをたべる',
      highlightedTerm: 'は',
      literal: 'cat (as for...) fish (obj) eats',
      natural: "The cat eats fish",
    },
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
    sample: {
      japanese: 'ねこがたべる',
      highlightedTerm: 'が',
      literal: 'cat (← doer) eats',
      natural: "The cat eats",
    },
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
    sample: {
      japanese: 'ねこをみる',
      highlightedTerm: 'を',
      literal: 'cat (← receives action) see',
      natural: "See the cat / I see the cat",
    },
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
    sample: {
      japanese: 'がっこうにいく',
      highlightedTerm: 'に',
      literal: 'school (← pin: destination) go',
      natural: "Go to school",
    },
    concept:
      'に pins an action to a specific point — a destination in space, a moment in time, or a recipient. Think of に as placing a pin on a map or timeline. It answers "where to?" or "when?" or "to whom?"',
    sections: [
      {
        sample: {
          japanese: 'がっこうにいく',
          highlightedTerm: 'に',
          literal: 'school (← pin: destination) go',
          natural: 'Go to school',
        },
        points: [
          'Destination: に marks where motion ends — the pin you arrive at',
          'The verb must express motion: いく (go), くる (come), かえる (return)',
          'Contrast: がっこうで (at school — stage for action) vs がっこうに (to school — destination)',
        ],
      },
      {
        sample: {
          japanese: 'さんじにおきる',
          highlightedTerm: 'に',
          literal: '3-oclock (← pin: time) wake-up',
          natural: 'Wake up at 3',
        },
        points: [
          'Time: に pins an action to a specific moment on the clock or calendar',
          'Used with clock times (三時に), days (月曜日に), dates (三月に)',
          'NOT used with relative time words: 今日, 明日, 毎朝 — those take no particle',
        ],
      },
      {
        sample: {
          japanese: 'ともだちにいう',
          highlightedTerm: 'に',
          literal: 'friend (← pin: recipient) say',
          natural: 'Say to a friend',
        },
        points: [
          'Recipient: に marks who receives the action or communication',
          'Common with: あげる, 言う, 送る, 教える (give, say, send, teach)',
          'Compare: ともだちと話す (talk WITH — mutual) vs ともだちに言う (say TO — directed)',
        ],
      },
      {
        sample: {
          japanese: 'こうえんにいる',
          highlightedTerm: 'に',
          literal: 'park (← pin: existence location) be',
          natural: 'Is in the park',
        },
        points: [
          'Existence location: に marks where something IS, used with いる or ある',
          'This is the only static-location use of に — the verb must be いる/ある',
          'Active verbs use で: 公園で遊ぶ (play IN park — active stage, not existence pin)',
        ],
      },
    ],
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
    sample: {
      japanese: 'こうえんであそぶ',
      highlightedTerm: 'で',
      literal: 'park (← stage) play',
      natural: "Play at the park",
    },
    concept:
      'で marks where an action occurs or the means by which it is done. Unlike に (a point), で marks the arena or tool. "公園で遊ぶ" — the park is not a destination, it is the stage the playing happens on.',
    sections: [
      {
        sample: {
          japanese: 'こうえんであそぶ',
          highlightedTerm: 'で',
          literal: 'park (← stage) play',
          natural: 'Play at the park',
        },
        points: [
          'Location of action: で marks the stage where something happens',
          'The location is the arena for the verb, not a destination',
          'Contrast: 公園にいる (exist AT park — static, に) vs 公園で遊ぶ (play IN park — active, で)',
        ],
      },
      {
        sample: {
          japanese: 'バスでいく',
          highlightedTerm: 'で',
          literal: 'bus (← means) go',
          natural: 'Go by bus',
        },
        points: [
          'Means/method: で marks the tool, vehicle, or method used',
          'バスで (by bus), 日本語で (in Japanese), 手で (by hand)',
          'The noun before で is the instrument, not the destination',
        ],
      },
      {
        sample: {
          japanese: 'きでつくる',
          highlightedTerm: 'で',
          literal: 'wood (← material) make',
          natural: 'Make from wood',
        },
        points: [
          'Material: で marks what something is made from or with',
          '木で作る (make with wood), 小麦粉でパン (bread from flour)',
          'Subtle: から can also mark material but implies transformation; で implies composition',
        ],
      },
    ],
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
    sample: {
      japanese: 'わたしのいぬ',
      highlightedTerm: 'の',
      literal: 'Me (← owner of) dog',
      natural: "My dog",
    },
    concept:
      'の links two nouns. The noun before の modifies or belongs to the noun after it. It is not just possession — it expresses any relationship between two nouns where the first categorizes or qualifies the second.',
    sections: [
      {
        sample: {
          japanese: 'わたしのいぬ',
          highlightedTerm: 'の',
          literal: 'Me (← owner of) dog',
          natural: 'My dog',
        },
        points: [
          'Possession: the noun before の owns or is associated with the noun after',
          'Not limited to physical ownership — any association counts',
          "猫の足 = the cat's foot, 会社の人 = a company person (associated, not owned)",
        ],
      },
      {
        sample: {
          japanese: 'にほんのくるま',
          highlightedTerm: 'の',
          literal: 'Japan (← category of) car',
          natural: 'A Japanese car',
        },
        points: [
          'Categorization: the first noun classifies the second by origin, type, or domain',
          '日本の車 = a car in the Japan category = a Japanese car',
          'This is not possession — Japan does not own the car',
        ],
      },
      {
        sample: {
          japanese: 'ともだちのたなかさん',
          highlightedTerm: 'の',
          literal: 'friend (← apposition) Tanaka-san',
          natural: 'My friend Tanaka',
        },
        points: [
          'Apposition: the first noun describes the relationship to the second',
          '友達の田中さん = Tanaka-san, who is my friend',
          'Chains freely: 日本の会社の人 = a person at a Japanese company',
        ],
      },
    ],
    keyPoints: [
      'Possession: 猫の足 (the cat\'s foot)',
      'Categorization: 日本の車 (a car OF Japan = a Japanese car)',
      'Apposition: 友達の田中さん (my friend Tanaka)',
      'Can chain: 日本の猫の足 = the foot of Japan\'s cat',
    ],
    practiceItems: [],
  },

  // ─── Module 2: Verb System ────────────────────────────────────────────────

  {
    id: 'verb-groups',
    module: 2,
    title: '動詞グループ — Verb Groups',
    subtitle: 'The conjugation classes',
    sample: {
      japanese: 'たべる',
      highlightedTerm: 'たべる',
      literal: 'eat (Group 2: る-verb — drop る to conjugate)',
      natural: "to eat",
    },
    concept:
      'Japanese verbs fall into three conjugation classes. Group 1 (う-verbs): dictionary form ends in a non-る vowel sound, or ends in る with an /a/, /u/, or /o/ vowel before it. Group 2 (る-verbs): dictionary form ends in る with an /i/ or /e/ vowel before it. Group 3: only する and くる — fully irregular. Identifying the group is the prerequisite to every conjugation.',
    keyPoints: [
      'Group 1 (う-verbs): 書く, 飲む, 話す, 帰る* — stem changes at conjugation boundary',
      'Group 2 (る-verbs): 食べる, 見る, 起きる — drop る, add ending directly',
      'Group 3 (irregulars): する → し | くる → き — memorize, no rule',
      '*帰る looks like Group 2 but is Group 1 — /a/ vowel before る',
      'When in doubt: if you can drop る and the stem ends in /i/ or /e/, it\'s Group 2',
    ],
    practiceItems: [],
  },
  {
    id: 'dictionary-form',
    module: 2,
    title: '辞書形 — Dictionary Form',
    subtitle: 'The base',
    sample: {
      japanese: 'まいにちたべる',
      highlightedTerm: 'たべる',
      literal: 'every-day eat (← plain non-past)',
      natural: "I eat every day / I will eat every day",
    },
    concept:
      'The dictionary form (辞書形) is the citation form — the form verbs appear in when listed. It always ends in an /u/ vowel sound: く, す, つ, ぬ, ぶ, む, る, ぐ, う. It is also the plain non-past affirmative form — it expresses either present habit or future intent depending on context. There is no separate "present tense" form.',
    keyPoints: [
      'All verbs in dictionary form end in an /u/-row kana',
      'Non-past: covers both habitual present and future (context disambiguates)',
      'Plain register — casual speech, embedded clauses, before nouns',
      'Before です in polite embedded contexts: 食べる + です ≠ standard; use ます-form instead',
      'Used directly before nouns as a modifier: 食べる人 = a person who eats',
    ],
    practiceItems: [],
  },
  {
    id: 'masu-form',
    module: 2,
    title: 'ます形 — Polite Form',
    subtitle: 'Register switch',
    sample: {
      japanese: 'まいにちたべます',
      highlightedTerm: 'ます',
      literal: 'every-day eat (← polite non-past)',
      natural: "I eat every day (polite)",
    },
    concept:
      'The ます-form is the polite non-past affirmative. It is not a separate tense — it is the same non-past meaning as the dictionary form, but at polite register. Formed by taking the verb stem and appending ます. The stem is derived differently per group: Group 1 shifts the final vowel to /i/; Group 2 drops る; Group 3 is irregular.',
    keyPoints: [
      'Group 1 stem: shift final /u/ → /i/ (書く → 書き、飲む → 飲み)',
      'Group 2 stem: drop る (食べる → 食べ、見る → 見)',
      'Group 3: する → し + ます、くる → き + ます',
      'ます itself conjugates: ます (non-past) | ました (past) | ません (negative) | ませんでした (past negative)',
      'ます-form stem is also used for て-form, た-form, and other derived forms',
    ],
    practiceItems: [],
  },
  {
    id: 'te-form',
    module: 2,
    title: 'て形 — Connector Form',
    subtitle: 'The joint',
    sample: {
      japanese: 'たべてねる',
      highlightedTerm: 'て',
      literal: 'eat (← connector) sleep',
      natural: "Eat and then sleep",
    },
    concept:
      'The て-form is a non-finite connector. It does not express tense on its own — it borrows tense from whatever follows it. Its primary function is chaining: A-て B means A and then B, or A while doing B, or A therefore B — the exact relationship is inferred from context and verb semantics. It is also the base for requests (てください), progressive aspect (ている), and many auxiliary constructions.',
    keyPoints: [
      'Group 2: drop る + て (食べる → 食べて)',
      'Group 1 phonological rules: く→いて, ぐ→いで, す→して, つ/ぬ/ぶ/む→って/んで, る/う/つ→って',
      'Group 3: する → して、くる → きて',
      'Chaining: 起きて、シャワーを浴びて、朝ごはんを食べた — sequence of morning actions',
      'Request: てください = please do [verb] (polite imperative)',
      'Progressive: ている = [verb]-ing / resultant state (context determines which)',
    ],
    practiceItems: [],
  },
  {
    id: 'ta-form',
    module: 2,
    title: 'た形 — Past Form',
    subtitle: 'Completed or prior',
    sample: {
      japanese: 'ごはんをたべた',
      highlightedTerm: 'た',
      literal: 'meal (obj) eat (← completed)',
      natural: "I ate / I have eaten",
    },
    concept:
      'た-form is the plain past/perfective. It marks an event as completed or as prior to the reference time. Formation follows the same phonological rules as て-form — just swap て/で for た/だ. In plain register, this is the sentence-final past. In embedded clauses, it marks relative past (prior to whatever the main clause time is).',
    keyPoints: [
      'Formation mirrors て-form: 食べて → 食べた, 書いて → 書いた, 飲んで → 飲んだ',
      'Group 3: した, きた',
      'Plain past affirmative: 食べた = ate / have eaten',
      'Polite past: ました (from the ます-form conjugation)',
      'Embedded relative past: 食べた人 = a person who ate / the person who ate',
      'Not purely "past tense" — marks completion or anteriority, not just clock time',
    ],
    practiceItems: [],
  },
  {
    id: 'nai-form',
    module: 2,
    title: 'ない形 — Negative Form',
    subtitle: 'Absence of action',
    sample: {
      japanese: 'たべない',
      highlightedTerm: 'ない',
      literal: 'eat (← absent)',
      natural: "Don't eat / I don't eat",
    },
    concept:
      'The plain negative is formed with ない. For Group 1 verbs, the final /u/ vowel shifts to /a/ before ない (書く → 書か + ない). For Group 2, drop る + ない. Group 3: しない, こない. The one exception: う (the verb "to exist/do") → わない (not うない). ない itself is an い-adjective and conjugates accordingly: なかった (past negative).',
    keyPoints: [
      'Group 1: shift final /u/ → /a/ + ない (書く → 書かない, 飲む → 飲まない)',
      'Group 2: drop る + ない (食べる → 食べない)',
      'Group 3: する → しない、くる → こない',
      'Exception: う → わない (not うない)',
      'ない is an い-adjective: ない (non-past neg) | なかった (past neg)',
      'Polite negative: ません / ませんでした',
    ],
    practiceItems: [],
  },

  // ─── Module 3: Adjectives ────────────────────────────────────────────────

  {
    id: 'i-adjectives',
    module: 3,
    title: 'い形容詞 — い-Adjectives',
    subtitle: 'Self-conjugating descriptors',
    sample: {
      japanese: 'たかいやま',
      highlightedTerm: 'たかい',
      literal: 'high/expensive (self-conjugating) mountain',
      natural: "A tall mountain",
    },
    concept:
      'い-adjectives are a closed word class that conjugate directly — they carry tense and polarity in their own ending without needing an auxiliary. Every い-adjective ends in い in its citation form. To conjugate: drop the final い and add the appropriate suffix. They can directly precede a noun (attributive position) or end a clause (predicative position) without any connector.',
    keyPoints: [
      'Citation form ends in い: 高い, 大きい, 新しい, 難しい',
      'Non-past affirmative: 高い (plain) | 高いです (polite)',
      'Past affirmative: 高かった (plain) | 高かったです (polite)',
      'Non-past negative: 高くない (plain) | 高くないです / 高くありません (polite)',
      'Past negative: 高くなかった (plain) | 高くなかったです / 高くありませんでした (polite)',
      'Adverbial form: drop い + く (高い → 高く = in a high manner / at a high [level])',
      'いい (good) is irregular — conjugates as よい: よかった, よくない',
    ],
    practiceItems: [],
  },
  {
    id: 'na-adjectives',
    module: 3,
    title: 'な形容詞 — な-Adjectives',
    subtitle: 'Noun-like descriptors',
    sample: {
      japanese: 'しずかなまち',
      highlightedTerm: 'な',
      literal: 'quiet (← copula-connector) town',
      natural: "A quiet town",
    },
    concept:
      'な-adjectives are structurally nouns — they cannot conjugate on their own. They borrow the copula (だ/です) to express tense and polarity. In attributive position (before a noun), they use な as a connector instead of の. This な is not a particle — it is a modified copula form specific to this position.',
    keyPoints: [
      'Predicative: 静かだ / 静かです (plain/polite non-past)',
      'Past: 静かだった / 静かでした',
      'Negative: 静かじゃない / 静かじゃありません (colloquial) | 静かではない (formal)',
      'Past negative: 静かじゃなかった / 静かじゃありませんでした',
      'Attributive (before noun): 静かな町 — な replaces だ in this position',
      'Adverbial: 静かに — に replaces だ to modify a verb',
      'Structurally: な-adj + noun = [noun]-like noun modifying another noun',
    ],
    practiceItems: [],
  },
  {
    id: 'adj-comparison',
    module: 3,
    title: '比較 — Comparison',
    subtitle: 'More, less, most',
    sample: {
      japanese: 'ねこはいぬよりちいさい',
      highlightedTerm: 'より',
      literal: 'cat (topic) dog (← standard of comparison) small',
      natural: "Cats are smaller than dogs",
    },
    concept:
      'Japanese has no inflected comparative or superlative forms — adjectives do not change shape for degree. Instead, comparison is expressed structurally: より marks the standard of comparison ("more than"); の中で...一番 marks the superlative domain ("the most among..."). The adjective itself stays in its plain form.',
    keyPoints: [
      'Comparative: AはBより[adj] — A is [adj]-er than B',
      'より = "than" / "compared to" — attaches to the standard (B)',
      'Superlative: [domain]の中で一番[adj] — most [adj] within [domain]',
      '一番 = number one / the most — precedes the adjective',
      'No "-er" / "-est" endings — the adjective form never changes for degree',
      'Degree adverbs: もっと (more), あまり～ない (not very), とても (very), かなり (quite)',
    ],
    practiceItems: [],
  },
];


// ─── Module 4: Extended Particles + Module 5: Clauses ──────────────────────

CURRICULUM.push(
  {
    id: 'mo',
    module: 4,
    title: 'も — Also / Even',
    subtitle: 'The additive',
    sample: {
      japanese: 'わたしもいく',
      highlightedTerm: 'も',
      literal: 'me (← also) go',
      natural: 'I\'m going too',
    },
    concept:
      'も replaces は or が to mean "also" or "even." It stacks a new item onto whatever was already established. When も appears on multiple nouns, it reads as "both... and..." When the noun is unexpected or extreme, も carries the nuance of "even."',
    sections: [
      {
        sample: {
          japanese: 'わたしもいく',
          highlightedTerm: 'も',
          literal: 'me (← also) go',
          natural: 'I\'m going too',
        },
        points: [
          'も replaces は or が — never stacks on top of them',
          'Implies something else is already in context: someone else is going',
          'The topic/subject is added to an already-established predicate',
        ],
      },
      {
        sample: {
          japanese: 'ねこもいぬもすきだ',
          highlightedTerm: 'も',
          literal: 'cat (← also) dog (← also) liked (=)',
          natural: 'I like both cats and dogs',
        },
        points: [
          'Double も = "both A and B" — stresses each item individually',
          'Each noun gets its own も — they do not share one particle',
          'Contrast with と: ねこといぬ is a list; ねこもいぬも stresses both',
        ],
      },
      {
        sample: {
          japanese: 'こどももわかる',
          highlightedTerm: 'も',
          literal: 'child (← even) understands',
          natural: 'Even a child understands',
        },
        points: [
          'も with an extreme or unexpected noun = "even"',
          'The surprise comes from the choice of noun, not from も itself',
          'More extreme or unexpected the noun → stronger the "even" reading',
        ],
      },
    ],
    keyPoints: [],
    practiceItems: [],
  },
  {
    id: 'to',
    module: 4,
    title: 'と — And / With / Quotation',
    subtitle: 'The connector with three jobs',
    sample: {
      japanese: 'ねことあそぶ',
      highlightedTerm: 'と',
      literal: 'cat (← together with) play',
      natural: 'Play with a cat',
    },
    concept:
      'と has three distinct roles: (1) listing nouns exhaustively — A and B and nothing else; (2) marking a co-participant — do the verb together WITH someone; (3) quoting or framing a thought — [content] と言う means say that [content]. The listing と is always between nouns; the co-participant と attaches to a person doing the action alongside you; the quotation と marks the edge of quoted material.',
    sections: [
      {
        sample: {
          japanese: 'ねことひつじ',
          highlightedTerm: 'と',
          literal: 'cat (← and, exhaustive) sheep',
          natural: 'A cat and a sheep',
        },
        points: [
          'Exhaustive "and" — implies this is the complete list',
          'Only connects nouns (use て-form to chain clauses)',
          'Contrast with や (ya): や = "and, among others" (non-exhaustive)',
        ],
      },
      {
        sample: {
          japanese: 'ともだちとたべる',
          highlightedTerm: 'と',
          literal: 'friend (← together with) eat',
          natural: 'Eat with a friend',
        },
        points: [
          'Co-participant: the marked noun does the verb alongside you',
          'Different from に: に marks a recipient, と marks a companion',
          'Both parties do the same action — it is mutual',
        ],
      },
      {
        sample: {
          japanese: 'いくといった',
          highlightedTerm: 'と',
          literal: '(go) (← quote boundary) said',
          natural: 'Said they\'d go',
        },
        points: [
          'Quotation と: marks the exact boundary of what was said or thought',
          'Content before と is the quoted material — not paraphrased',
          'Common pattern: [clause] と言う / と思う / と聞く',
        ],
      },
    ],
    keyPoints: [],
    practiceItems: [],
  },
  {
    id: 'kara',
    module: 4,
    title: 'から — From / Because',
    subtitle: 'Origin and reason',
    sample: {
      japanese: 'がっこうからかえる',
      highlightedTerm: 'から',
      literal: 'school (← origin: from) return',
      natural: 'Return from school',
    },
    concept:
      'から marks a starting point — spatial, temporal, or causal. As a particle: "from [place/time]." As a clausal connector: "[clause A] から [clause B]" = because A, B. The reason use is more assertive than ので — used when the speaker is confident or the reason is self-evident.',
    sections: [
      {
        sample: {
          japanese: 'とうきょうからきた',
          highlightedTerm: 'から',
          literal: 'Tokyo (← origin: from) came',
          natural: 'Came from Tokyo',
        },
        points: [
          'Spatial starting point: from [place]',
          'Temporal starting point: から marks when something begins',
          'Pairs with まで: から〜まで = from〜until/to (space or time)',
        ],
      },
      {
        sample: {
          japanese: 'たかいからかわない',
          highlightedTerm: 'から',
          literal: '(expensive) (← because) not-buy',
          natural: 'Not buying it because it\'s expensive',
        },
        points: [
          'Reason: [plain-form clause] から [result clause]',
          'Direct and assertive — the speaker presents the reason confidently',
          'Cause always comes BEFORE から (Japanese: cause → effect, not effect ← cause)',
          'Softer alternative: ので — used in polite or considerate contexts',
        ],
      },
    ],
    keyPoints: [],
    practiceItems: [],
  },
  {
    id: 'made',
    module: 4,
    title: 'まで — Until / Up To',
    subtitle: 'The endpoint',
    sample: {
      japanese: 'えきまであるく',
      highlightedTerm: 'まで',
      literal: 'station (← endpoint: up to) walk',
      natural: 'Walk to the station',
    },
    concept:
      'まで marks an endpoint — in space, time, or degree. It answers "how far?" or "until when?" It does NOT imply motion to a destination (that is に\'s job) — it specifies the outer boundary of a span.',
    sections: [
      {
        sample: {
          japanese: 'えきまであるく',
          highlightedTerm: 'まで',
          literal: 'station (← spatial endpoint) walk',
          natural: 'Walk as far as the station',
        },
        points: [
          'Spatial limit: marks how far something extends',
          'Contrast with に: えきにいく = go TO (destination); えきまであるく = walk UP TO (boundary)',
          'Pairs with から: うちからえきまで = from home to the station',
        ],
      },
      {
        sample: {
          japanese: 'しちじまでしごとだ',
          highlightedTerm: 'まで',
          literal: '7-oclock (← temporal endpoint) work (=)',
          natural: 'Work until 7',
        },
        points: [
          'Temporal limit: the action continues up to this point, then stops',
          'Does not say what happens after — just where it ends',
          'Common pattern: [time]から[time]まで = from [time] until [time]',
        ],
      },
    ],
    keyPoints: [],
    practiceItems: [],
  },
  {
    id: 'koto',
    module: 5,
    title: 'こと — Nominalization',
    subtitle: 'Turning verbs into nouns',
    sample: {
      japanese: 'たべることがすきだ',
      highlightedTerm: 'こと',
      literal: 'eat (← act-of) (subject) liked (=)',
      natural: 'I like eating',
    },
    concept:
      'こと (事) converts a verb clause into a noun — it wraps the action into "the act of doing." Without こと, a verb cannot be a subject or object; with こと, it can. Japanese has two nominalizers: こと and の. こと tends toward abstract or formal contexts; の toward concrete, immediate, or perceptual ones.',
    sections: [
      {
        sample: {
          japanese: 'はしることができる',
          highlightedTerm: 'こと',
          literal: 'run (← act-of) (subject) can-do',
          natural: 'I can run',
        },
        points: [
          '[dictionary form] + ことができる = can do / is able to do',
          'Formal/standard expression of ability',
          'Informal alternative: potential verb form (走れる) — same meaning, shorter',
        ],
      },
      {
        sample: {
          japanese: 'たべることがすきだ',
          highlightedTerm: 'こと',
          literal: 'eat (← act-of) (subject) liked (=)',
          natural: 'I like eating',
        },
        points: [
          'すき, きらい, じょうず, へた all take the nominalized form as subject',
          'The thing you like/dislike must be a noun — こと makes the verb one',
          'が marks what is liked (not the person doing the liking)',
        ],
      },
      {
        sample: {
          japanese: 'にほんにいったことがある',
          highlightedTerm: 'こと',
          literal: 'Japan (dest.) went (← experience-of) (subj.) exists',
          natural: 'I\'ve been to Japan',
        },
        points: [
          '[ta-form] + ことがある = have the experience of doing (experiential perfect)',
          'Marks that the event happened at least once — not a specific time',
          'Negative: [ta-form] + ことがない = have never done',
        ],
      },
      {
        sample: {
          japanese: 'はなすことはむずかしい',
          highlightedTerm: 'こと',
          literal: 'speak (← act-of) (topic) difficult',
          natural: 'Speaking is difficult',
        },
        points: [
          'こと nominalizes entire clauses — any verb phrase becomes a noun',
          'Contrast こと vs の: の is warmer/immediate (perceptual); こと is abstract/general',
          'にほんごをはなすのがきこえた (I could HEAR her speaking — perceptual, の)',
        ],
      },
    ],
    keyPoints: [],
    practiceItems: [],
  },
  {
    id: 'te-iru',
    module: 5,
    title: 'ている — Progressive / State',
    subtitle: 'The two readings',
    sample: {
      japanese: 'たべている',
      highlightedTerm: 'ている',
      literal: 'eat (← and be: ongoing)',
      natural: 'Am eating',
    },
    concept:
      'ている attaches to the て-form and has two readings depending on verb semantics: (1) ongoing action — for activity verbs (eat, run, read), ている means in progress right now; (2) resultant state — for change-of-state verbs (die, marry, arrive), ている describes the state resulting from the change.',
    sections: [
      {
        sample: {
          japanese: 'ほんをよんでいる',
          highlightedTerm: 'いる',
          literal: 'book (obj) read (← and) be',
          natural: 'Is reading a book',
        },
        points: [
          'Activity verbs (read, eat, run, talk): ている = in-progress action',
          'Rough equivalent of English "-ing"',
          'The action is happening continuously at the reference time',
        ],
      },
      {
        sample: {
          japanese: 'しんでいる',
          highlightedTerm: 'いる',
          literal: 'die (← and) be (resultant state)',
          natural: 'Is dead',
        },
        points: [
          'Change-of-state verbs (die, arrive, marry, open): ている = resultant state',
          '"Is dead" not "is dying" — the state that resulted from the change',
          '結婚している (is married), 知っている (knows = has come to know)',
          'This is why 知る is almost never used without ている',
        ],
      },
    ],
    keyPoints: [],
    practiceItems: [],
  },
  {
    id: 'node',
    module: 5,
    title: 'ので — Because (soft)',
    subtitle: 'Reason with consideration',
    sample: {
      japanese: 'たかいのでかわない',
      highlightedTerm: 'ので',
      literal: '(expensive) (← soft-reason) not-buy',
      natural: 'Not buying it — it\'s expensive',
    },
    concept:
      'ので connects a reason clause to a result, like から, but with a softer register. Where から presents the reason assertively, ので presents it as an observed or shared fact. ので is preferred in polite speech and when explaining to superiors.',
    sections: [
      {
        sample: {
          japanese: 'いそがしいのでいけない',
          highlightedTerm: 'ので',
          literal: '(busy) (← soft-reason) cannot-go',
          natural: 'Being busy, I can\'t go',
        },
        points: [
          '[plain-form clause] + ので + [result clause]',
          'Softer than から — treats the reason as an objective circumstance',
          'Preferred when you want to sound considerate or formal',
        ],
      },
      {
        sample: {
          japanese: 'しずかなのでよめる',
          highlightedTerm: 'ので',
          literal: '(quiet) (← soft-reason) can-read',
          natural: 'Because it\'s quiet, I can read',
        },
        points: [
          'な-adjective before ので: [adj stem] + な + ので (静かなので)',
          'Noun before ので: [noun] + な + ので (学生なので)',
          'This な is the copula — not the attributive connector',
          'たかいから (assertive) vs たかいので (considerate) — same logic, different register',
        ],
      },
    ],
    keyPoints: [],
    practiceItems: [],
  },
);
