/** Rubric model (DESIGN.md §8.5). */
export interface RubricCriterion {
  key: string;
  label: string;
  /** What good looks like. */
  description: string;
  /** Weights sum to 1. */
  weight: number;
  levels: { score: 1 | 2 | 3 | 4; descriptor: string }[];
}

export interface Rubric {
  key: string;
  name: string;
  maxScore: number;
  criteria: RubricCriterion[];
}

const levels = (l1: string, l2: string, l3: string, l4: string): RubricCriterion['levels'] => [
  { score: 1, descriptor: l1 },
  { score: 2, descriptor: l2 },
  { score: 3, descriptor: l3 },
  { score: 4, descriptor: l4 },
];

/** `default.narrative`: the five categories from the brief, Grade 6–8 descriptors. */
export const DEFAULT_RUBRIC: Rubric = {
  key: 'default.narrative',
  name: 'Narrative writing',
  maxScore: 100,
  criteria: [
    {
      key: 'creativity',
      label: 'Creativity',
      description:
        'Original ideas, a fresh angle, and choices that surprise or delight the reader.',
      weight: 0.2,
      levels: levels(
        'Ideas are copied or very predictable.',
        'Some original touches, but mostly familiar.',
        'A clear original idea with some fresh details.',
        'Surprising, original ideas and memorable choices throughout.',
      ),
    },
    {
      key: 'clarity',
      label: 'Clarity',
      description: 'The reader can follow what happens and who is involved.',
      weight: 0.2,
      levels: levels(
        'Hard to follow; events or people are unclear.',
        'Mostly understandable, with some confusing parts.',
        'Clear and easy to follow.',
        'Crystal clear, with precise words that make every moment vivid.',
      ),
    },
    {
      key: 'structure',
      label: 'Structure',
      description: 'A shape that fits the task: a strong opening, a clear middle, and an ending.',
      weight: 0.2,
      levels: levels(
        'No clear beginning, middle or end.',
        'Some shape, but parts feel missing or rushed.',
        'A clear beginning, middle and end that fit the task.',
        'Purposeful structure: the opening hooks and the ending lands.',
      ),
    },
    {
      key: 'sensory',
      label: 'Sensory detail',
      description: 'Details that let the reader see, hear, smell, taste or feel the scene.',
      weight: 0.2,
      levels: levels(
        'Few or no sensory details.',
        'Some details, mostly sight.',
        'Several senses used to bring scenes to life.',
        'Rich, well-chosen details across senses that create a mood.',
      ),
    },
    {
      key: 'grammar',
      label: 'Grammar and conventions',
      description: 'Sentences, punctuation and paragraphs help the reader.',
      weight: 0.2,
      levels: levels(
        'Errors often get in the way of meaning.',
        'Some errors that sometimes distract.',
        'Mostly correct; errors rarely distract.',
        'Controlled and correct, with varied sentences used on purpose.',
      ),
    },
  ],
};

/** `grammar.practice`: Essay Writing grammar sentences and paragraphs (DESIGN.md §9.12). */
export const GRAMMAR_RUBRIC: Rubric = {
  key: 'grammar.practice',
  name: 'Grammar practice',
  maxScore: 100,
  criteria: [
    {
      key: 'focus',
      label: 'Lesson skill',
      description: 'Uses the grammar this lesson teaches, correctly, and does what each task asks.',
      weight: 0.4,
      levels: levels(
        'The lesson skill is missing or mostly wrong.',
        'Tries the lesson skill, with several mistakes or tasks not done.',
        'Uses the lesson skill correctly in most places; most tasks done.',
        'Uses the lesson skill correctly every time, and every task is done.',
      ),
    },
    {
      key: 'conventions',
      label: 'Capitals, punctuation and spelling',
      description:
        'Sentences start with capitals and end with punctuation; words are spelled right.',
      weight: 0.25,
      levels: levels(
        'Errors often get in the way of meaning.',
        'Some errors that sometimes distract.',
        'Mostly correct; errors rarely distract.',
        'Correct throughout.',
      ),
    },
    {
      key: 'clarity',
      label: 'Complete, clear sentences',
      description: 'Each sentence is complete and makes sense on its own.',
      weight: 0.2,
      levels: levels(
        'Many sentences are incomplete or confusing.',
        'Some sentences are incomplete or hard to follow.',
        'Sentences are complete and clear.',
        'Sentences are complete, clear and well built.',
      ),
    },
    {
      key: 'wordChoice',
      label: 'Word choice',
      description: 'Precise, interesting words that make each sentence worth reading.',
      weight: 0.15,
      levels: levels(
        'Words are vague or repeated.',
        'Some precise words, mostly plain.',
        'Precise words that fit.',
        'Vivid, precise words chosen with care.',
      ),
    },
  ],
};

/** total = Σ level × weight, scaled to maxScore (level 4 everywhere = maxScore). */
export function totalScore(rubric: Rubric, levelsByKey: Record<string, number>): number {
  const weighted = rubric.criteria.reduce(
    (sum, c) => sum + (levelsByKey[c.key] ?? 1) * c.weight,
    0,
  );
  return Math.round((weighted / 4) * rubric.maxScore * 10) / 10;
}

export function describeRubric(rubric: Rubric): string {
  return rubric.criteria
    .map(
      (c) =>
        `- ${c.key} (${c.label}): ${c.description}\n${c.levels.map((l) => `    ${l.score}: ${l.descriptor}`).join('\n')}`,
    )
    .join('\n');
}
