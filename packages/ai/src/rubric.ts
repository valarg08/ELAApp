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

/** `introduction.essay`: essay introductions (Essay Unit 12 on, DESIGN.md §9.12). */
export const INTRODUCTION_RUBRIC: Rubric = {
  key: 'introduction.essay',
  name: 'Essay introduction',
  maxScore: 100,
  criteria: [
    {
      key: 'hook',
      label: 'Hook',
      description:
        'The opening grabs the reader: a question, a surprising fact, a quote, a short story or a bold statement.',
      weight: 0.3,
      levels: levels(
        'No hook, or an announcement (“In this essay…”).',
        'A hook is there, but it is plain or does not fit the topic.',
        'A hook that grabs the reader and fits the topic.',
        'A vivid, well-chosen hook that leads naturally into the topic.',
      ),
    },
    {
      key: 'background',
      label: 'Background',
      description: 'One or two sentences give the reader what they need to know before the thesis.',
      weight: 0.2,
      levels: levels(
        'No background: the hook jumps straight to the thesis.',
        'Some background, but it is vague or off the topic.',
        'Clear background that bridges the hook and the thesis.',
        'Smooth, specific background that makes the thesis feel inevitable.',
      ),
    },
    {
      key: 'thesis',
      label: 'Thesis or focus',
      description:
        'The introduction ends with one clear sentence the essay will prove, explain or show.',
      weight: 0.35,
      levels: levels(
        'No thesis, or a fact, a taste or an announcement.',
        'A thesis is there, but it is vague or not at the end.',
        'A clear thesis that fits the kind of essay, at the end of the introduction.',
        'A sharp, specific thesis that maps out the essay.',
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

/** `body.essay`: essay body paragraphs (Essay Unit 13 on, DESIGN.md §9.12). */
export const BODY_RUBRIC: Rubric = {
  key: 'body.essay',
  name: 'Essay body paragraph',
  maxScore: 100,
  criteria: [
    {
      key: 'topic',
      label: 'Topic sentence and link',
      description: 'Each paragraph opens with a topic sentence that links back to the thesis.',
      weight: 0.25,
      levels: levels(
        'No topic sentence, or it has nothing to do with the thesis.',
        'A topic sentence, but its link to the thesis is unclear.',
        'A clear topic sentence that uses a key idea from the thesis.',
        'A sharp topic sentence that names exactly which part of the thesis it proves.',
      ),
    },
    {
      key: 'evidence',
      label: 'Evidence',
      description:
        'A fact or number, an example or a quote backs up the topic sentence (narratives: details in time order).',
      weight: 0.3,
      levels: levels(
        'No evidence: just opinions or repeats of the topic sentence.',
        'Some evidence, but it is vague or does not fit the point.',
        'Specific evidence that fits the point.',
        'Strong, well-chosen evidence, introduced smoothly (with its source for a quote).',
      ),
    },
    {
      key: 'explanation',
      label: 'Explanation',
      description: 'The writer explains how the evidence proves the point, not just drops it in.',
      weight: 0.25,
      levels: levels(
        'No explanation after the evidence.',
        'Some explanation, but it repeats the evidence.',
        'Explains what the evidence shows and why it matters.',
        'Explains clearly and ties the point back to the thesis.',
      ),
    },
    {
      key: 'conventions',
      label: 'Grammar and conventions',
      description: 'Complete sentences, capitals, punctuation and spelling help the reader.',
      weight: 0.2,
      levels: levels(
        'Errors often get in the way of meaning.',
        'Some errors that sometimes distract.',
        'Mostly correct; errors rarely distract.',
        'Correct throughout, with varied sentences.',
      ),
    },
  ],
};

/** `conclusion.essay`: essay conclusions (Essay Unit 14 on, DESIGN.md §9.12). */
export const CONCLUSION_RUBRIC: Rubric = {
  key: 'conclusion.essay',
  name: 'Essay conclusion',
  maxScore: 100,
  criteria: [
    {
      key: 'restatement',
      label: 'Restated thesis',
      description: 'The conclusion opens by restating the thesis (or focus) in new words.',
      weight: 0.35,
      levels: levels(
        'No restatement, or the thesis copied word for word.',
        'The thesis is there, but almost copied or only hinted at.',
        'The thesis restated clearly in new words.',
        'A fresh, confident restatement that shows how the essay proved it.',
      ),
    },
    {
      key: 'summary',
      label: 'Summary of main points',
      description: 'A sentence or two sum up the main points (narratives: what happened).',
      weight: 0.2,
      levels: levels(
        'No summary: the conclusion jumps straight to the end.',
        'A summary that lists too much or misses a main point.',
        'A short summary of the main points.',
        'A smooth summary that ties the points together.',
      ),
    },
    {
      key: 'finalThought',
      label: 'Final thought',
      description:
        'The conclusion ends with a call to act, a look ahead, a question or (narratives) a reflection.',
      weight: 0.3,
      levels: levels(
        'No final thought: the essay just stops.',
        'A final thought that is vague or repeats the thesis.',
        'A clear final thought that leaves the reader thinking.',
        'A memorable final thought that fits the essay perfectly.',
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

/** The criteria every full-essay rubric shares (Essay Unit 14 on). */
const essayShared = (organization: number, language: number, conventions: number) => [
  {
    key: 'organization',
    label: 'Organization',
    description:
      'Introduction, body paragraphs and conclusion in a logical order, linked with transitions.',
    weight: organization,
    levels: levels(
      'Parts are missing or out of order.',
      'All the parts are there, but the order or links are weak.',
      'A clear introduction, body and conclusion, linked with transitions.',
      'Smooth, purposeful order; every paragraph leads to the next.',
    ),
  },
  {
    key: 'language',
    label: 'Language and style',
    description: 'Precise words, varied sentences and a tone that fits the essay.',
    weight: language,
    levels: levels(
      'Vague words and repeated sentence patterns.',
      'Some precise words; sentences are often alike.',
      'Precise words and varied sentences in a fitting tone.',
      'Vivid, exact language and a confident, consistent voice.',
    ),
  },
  {
    key: 'conventions',
    label: 'Grammar and conventions',
    description: 'Complete sentences, capitals, punctuation and spelling help the reader.',
    weight: conventions,
    levels: levels(
      'Errors often get in the way of meaning.',
      'Some errors that sometimes distract.',
      'Mostly correct; errors rarely distract.',
      'Correct throughout, with varied sentences.',
    ),
  },
];

/** `argumentative.essay`: a whole argumentative essay. */
export const ARGUMENTATIVE_ESSAY_RUBRIC: Rubric = {
  key: 'argumentative.essay',
  name: 'Argumentative essay',
  maxScore: 100,
  criteria: [
    {
      key: 'thesis',
      label: 'Claim and thesis',
      description: 'A hook leads to a clear, arguable thesis with reasons.',
      weight: 0.2,
      levels: levels(
        'No clear claim.',
        'A claim, but vague or without reasons.',
        'A clear claim with reasons, at the end of the introduction.',
        'A sharp claim that maps out the whole essay.',
      ),
    },
    {
      key: 'evidence',
      label: 'Evidence and reasoning',
      description: 'Each reason is backed by facts, examples or quotes and explained.',
      weight: 0.25,
      levels: levels(
        'Opinions with no evidence.',
        'Some evidence, but thin or unexplained.',
        'Relevant evidence for each reason, explained.',
        'Strong, varied evidence with explanations that build the argument.',
      ),
    },
    {
      key: 'counterclaim',
      label: 'Counterclaim and rebuttal',
      description: 'The other side is stated fairly and answered with evidence.',
      weight: 0.15,
      levels: levels(
        'No counterclaim.',
        'A counterclaim with a weak or missing rebuttal.',
        'A fair counterclaim answered with a reason.',
        'A strong counterclaim answered convincingly with evidence.',
      ),
    },
    ...essayShared(0.2, 0.1, 0.1),
  ],
};

/** `informative.essay`: a whole informative essay. */
export const INFORMATIVE_ESSAY_RUBRIC: Rubric = {
  key: 'informative.essay',
  name: 'Informative essay',
  maxScore: 100,
  criteria: [
    {
      key: 'thesis',
      label: 'Thesis and focus',
      description: 'The thesis names the topic and the parts the essay explains.',
      weight: 0.2,
      levels: levels(
        'No clear topic or thesis.',
        'A topic, but the parts are unclear.',
        'A clear thesis that names the topic and its parts.',
        'A precise thesis that previews every body paragraph.',
      ),
    },
    {
      key: 'evidence',
      label: 'Explanation and evidence',
      description: 'Each part is explained with accurate facts, examples and details.',
      weight: 0.3,
      levels: levels(
        'Little explanation or few facts.',
        'Some facts, but thin or not explained.',
        'Each part explained with accurate facts and examples.',
        'Rich, well-chosen facts and examples, clearly explained.',
      ),
    },
    ...essayShared(0.25, 0.15, 0.1),
  ],
};

/** `narrative.essay`: a whole narrative (personal) essay. */
export const NARRATIVE_ESSAY_RUBRIC: Rubric = {
  key: 'narrative.essay',
  name: 'Narrative essay',
  maxScore: 100,
  criteria: [
    {
      key: 'thesis',
      label: 'Focus and meaning',
      description:
        'The essay shows what the experience taught or changed, and reflects on it at the end.',
      weight: 0.2,
      levels: levels(
        'No clear focus: just a list of events.',
        'A focus, but the story drifts from it.',
        'A clear focus the events lead toward, with a reflection.',
        'A thoughtful focus and a reflection that gives the story real meaning.',
      ),
    },
    {
      key: 'evidence',
      label: 'Events and details',
      description:
        'Events in order with time words, and details of what the writer saw, heard and felt.',
      weight: 0.3,
      levels: levels(
        'Events are confusing or have no details.',
        'Events in order, but few details.',
        'Clear events in order with sensory details and time words.',
        'Vivid, well-paced events that pull the reader in.',
      ),
    },
    ...essayShared(0.25, 0.15, 0.1),
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
