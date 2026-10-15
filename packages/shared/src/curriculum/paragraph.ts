import { z } from 'zod/v4';

/**
 * The paragraph builder (Essay Unit 10, DESIGN.md §9.12): one box per part of a paragraph (topic
 * sentence, one or two pieces of evidence each with its explanation, closing sentence), sentence
 * starters for each, and a button that puts the built paragraph in the writing box. The draft is
 * still what gets checked and handed in; the plan is saved so the boxes keep their words.
 */
export const PARAGRAPH_PARTS = [
  'topic',
  'evidence1',
  'explain1',
  'evidence2',
  'explain2',
  'closing',
] as const;
export type ParagraphPart = (typeof PARAGRAPH_PARTS)[number];

export const PARAGRAPH_PART_INFO: Record<
  ParagraphPart,
  { label: string; help: string; starters: readonly string[] }
> = {
  topic: {
    label: 'Topic sentence',
    help: 'Your main idea in one sentence.',
    starters: ['Students should …', 'Our school needs …', 'It is important to …'],
  },
  evidence1: {
    label: 'Evidence 1',
    help: 'A fact, example or quote that supports your topic sentence.',
    starters: ['For example, …', 'According to …', 'One study found that …'],
  },
  explain1: {
    label: 'Explanation 1',
    help: 'What the evidence shows and why it matters.',
    starters: ['This shows that …', 'This means …', 'As a result, …'],
  },
  evidence2: {
    label: 'Evidence 2',
    help: 'Another fact, example or quote.',
    starters: ['In addition, …', 'For instance, …', 'Another example is …'],
  },
  explain2: {
    label: 'Explanation 2',
    help: 'What this second piece of evidence shows.',
    starters: ['This proves that …', 'Because of this, …', 'In other words, …'],
  },
  closing: {
    label: 'Closing sentence',
    help: 'Sum up your main idea in new words.',
    starters: ['For these reasons, …', 'Overall, …', 'That is why …'],
  },
};

const part = z.string().trim().max(400).default('');
/** The words in each box of the builder. */
export const ParagraphPlan = z.object({
  topic: part,
  evidence1: part,
  explain1: part,
  evidence2: part,
  explain2: part,
  closing: part,
});
export type ParagraphPlan = z.infer<typeof ParagraphPlan>;

export const emptyParagraphPlan = (): ParagraphPlan => ParagraphPlan.parse({});

/** The builder config on a writing activity: one or two pieces of evidence. */
export const ParagraphBuilder = z.object({
  label: z.string().trim().min(1).max(120),
  points: z.union([z.literal(1), z.literal(2)]).default(2),
});
export type ParagraphBuilder = z.infer<typeof ParagraphBuilder>;

/** The parts a builder shows, in order. */
export const paragraphParts = (points: 1 | 2): ParagraphPart[] =>
  points === 1
    ? ['topic', 'evidence1', 'explain1', 'closing']
    : ['topic', 'evidence1', 'explain1', 'evidence2', 'explain2', 'closing'];

/** The built paragraph: the filled parts in order, joined by spaces. */
export const buildParagraph = (plan: ParagraphPlan, points: 1 | 2): string =>
  paragraphParts(points)
    .map((p) => plan[p].trim())
    .filter((s) => s.length > 0)
    .join(' ');

/** Every part of the builder has words. */
export const paragraphPlanComplete = (plan: ParagraphPlan, points: 1 | 2) =>
  paragraphParts(points).every((p) => plan[p].trim().length > 0);
