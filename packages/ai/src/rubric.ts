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

/** `paragraph.essay`: Essay Writing paragraphs (Unit 10 on, DESIGN.md §9.12). */
export const PARAGRAPH_RUBRIC: Rubric = {
  key: 'paragraph.essay',
  name: 'Essay paragraph',
  maxScore: 100,
  criteria: [
    {
      key: 'topic',
      label: 'Topic sentence',
      description: 'The paragraph opens with one clear main idea that answers the prompt.',
      weight: 0.25,
      levels: levels(
        'No clear main idea, or it does not answer the prompt.',
        'A main idea is there, but it is vague or buried.',
        'A clear topic sentence that answers the prompt.',
        'A sharp, specific topic sentence that sets up everything after it.',
      ),
    },
    {
      key: 'support',
      label: 'Evidence and explanation',
      description: 'Facts, examples or quotes support the main idea, and each one is explained.',
      weight: 0.35,
      levels: levels(
        'No evidence, or evidence that does not fit.',
        'Some evidence, but it is thin or not explained.',
        'Relevant evidence, and most of it is explained.',
        'Strong, specific evidence, each piece clearly explained and tied to the main idea.',
      ),
    },
    {
      key: 'organization',
      label: 'Organization and transitions',
      description:
        'Sentences follow a clear order, transitions link them, and a closing sentence sums up.',
      weight: 0.25,
      levels: levels(
        'Ideas jump around; no closing sentence.',
        'Some order, few transitions, or a weak closing.',
        'A clear order with transitions and a closing sentence.',
        'Smooth, logical order; well-chosen transitions; a closing that lands.',
      ),
    },
    {
      key: 'conventions',
      label: 'Grammar and conventions',
      description: 'Complete sentences, capitals, punctuation and spelling help the reader.',
      weight: 0.15,
      levels: levels(
        'Errors often get in the way of meaning.',
        'Some errors that sometimes distract.',
        'Mostly correct; errors rarely distract.',
        'Correct throughout, with varied sentences.',
      ),
    },
  ],
};

/** `outline.essay`: essay outlines (Essay Unit 11 on, DESIGN.md §9.12). */
export const OUTLINE_RUBRIC: Rubric = {
  key: 'outline.essay',
  name: 'Essay outline',
  maxScore: 100,
  criteria: [
    {
      key: 'thesis',
      label: 'Thesis or focus',
      description:
        'One clear sentence the essay will prove (a claim), explain (a focus) or show (a narrative focus).',
      weight: 0.3,
      levels: levels(
        'No thesis, or a fact, a taste or an announcement.',
        'A thesis is there, but it is vague or hard to prove.',
        'A clear thesis that fits the kind of essay.',
        'A sharp, specific thesis that maps out the body points.',
      ),
    },
    {
      key: 'points',
      label: 'Body points and evidence',
      description: 'Each body point supports the thesis and has its own evidence or details.',
      weight: 0.35,
      levels: levels(
        'Points are missing or off the topic.',
        'Some points fit, but evidence is thin or missing.',
        'Each point fits the thesis and has evidence.',
        'Distinct, well-chosen points, each with strong, specific evidence.',
      ),
    },
    {
      key: 'order',
      label: 'Order and completeness',
      description:
        'Hook, thesis, body points, any counterclaim and rebuttal, and a conclusion, in a sensible order.',
      weight: 0.2,
      levels: levels(
        'Several parts are missing.',
        'Most parts are there, but one is missing or out of order.',
        'Every part is there in a sensible order.',
        'Every part is there, in an order that builds to the strongest point.',
      ),
    },
    {
      key: 'clarity',
      label: 'Clear notes',
      description: 'Each line is clear and specific enough to write a paragraph from.',
      weight: 0.15,
      levels: levels(
        'Lines are too short or unclear to use.',
        'Some lines are clear; others are vague.',
        'Lines are clear and specific.',
        'Every line is precise and ready to write from.',
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
