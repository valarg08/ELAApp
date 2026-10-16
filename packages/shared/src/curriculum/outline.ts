import { ESSAY_PART_TASKS, ESSAY_TYPES, type EssayType } from '@storyforge/writing-analysis';
import { z } from 'zod/v4';

/**
 * The essay outline builder (Essay Units 11–15, DESIGN.md §9.12): one box per part of an essay
 * (hook, thesis, two or three body points each with its evidence, an optional counterclaim and
 * rebuttal, the conclusion), with sentence starters that suit the kind of essay. In an outline
 * activity it writes labelled lines ("Thesis: …") into the writing box; in an essay activity it
 * starts the essay: one paragraph per part. The plan is saved so the boxes keep their words.
 */

/** The kind of essay an activity asks for, and whether it must answer the other side. */
export const EssayConfig = z.object({
  type: z.enum(ESSAY_TYPES),
  counterclaim: z.boolean().default(false),
  /** `ESSAY_PART` activities: the one part of an essay the student writes. */
  part: z.enum(ESSAY_PART_TASKS).optional(),
});
export type EssayConfig = z.infer<typeof EssayConfig>;

export const OUTLINE_FIELDS = [
  'hook',
  'thesis',
  'body1',
  'evidence1',
  'body2',
  'evidence2',
  'body3',
  'evidence3',
  'counterclaim',
  'rebuttal',
  'conclusion',
] as const;
export type OutlineField = (typeof OUTLINE_FIELDS)[number];

interface FieldInfo {
  label: string;
  /** The label written into an outline ("Body 1"). */
  line: string;
  help: string;
  starters: readonly string[];
}

const body = (n: 1 | 2 | 3, type: EssayType): FieldInfo =>
  type === 'narrative'
    ? {
        label: `Event ${n}`,
        line: `Body ${n}`,
        help: [
          'What happens first: set the scene.',
          'The problem or turning point.',
          'How it ends.',
        ][n - 1]!,
        starters: [
          ['It was …', 'At first, …', 'That morning, …'],
          ['Suddenly, …', 'Then …', 'Everything changed when …'],
          ['In the end, …', 'Finally, …', 'By the time …'],
        ][n - 1]!,
      }
    : {
        label: `Body point ${n}`,
        line: `Body ${n}`,
        help:
          type === 'argumentative'
            ? 'One reason your thesis is right, as a topic sentence.'
            : 'One part of your topic, as a topic sentence.',
        starters:
          type === 'argumentative'
            ? [
                ['First, …', 'The main reason is …', 'One reason is …'],
                ['Second, …', 'Another reason is …', 'In addition, …'],
                ['Finally, …', 'Most importantly, …', 'A third reason is …'],
              ][n - 1]!
            : [
                ['First, …', 'One way is …', 'The first step is …'],
                ['Second, …', 'Another way is …', 'Next, …'],
                ['Finally, …', 'A third way is …', 'Last, …'],
              ][n - 1]!,
      };

const evidence = (n: 1 | 2 | 3, type: EssayType): FieldInfo =>
  type === 'narrative'
    ? {
        label: `Details for event ${n}`,
        line: 'Details',
        help: 'What you saw, heard and felt.',
        starters: ['I could see …', 'I heard …', 'I felt …'],
      }
    : {
        label: `Evidence for point ${n}`,
        line: 'Evidence',
        help: 'A fact, example or quote that proves this point.',
        starters: ['For example, …', 'According to …', 'One study found that …'],
      };

/** Labels, help and sentence starters for each box, by kind of essay. */
export function outlineFieldInfo(field: OutlineField, type: EssayType): FieldInfo {
  switch (field) {
    case 'hook':
      return {
        label: 'Hook',
        line: 'Hook',
        help: 'An opening that grabs the reader: a question, a surprising fact, a quote or a short story.',
        starters:
          type === 'narrative'
            ? ['I still remember …', 'It was the day …', 'Have you ever …?']
            : ['Have you ever …?', 'Imagine …', 'Every year, …'],
      };
    case 'thesis':
      return type === 'narrative'
        ? {
            label: 'Focus',
            line: 'Focus',
            help: 'What this story is really about: what it taught you or how it changed you.',
            starters: ['That day taught me …', 'I learned that …', 'It was the day I realized …'],
          }
        : {
            label: 'Thesis',
            line: 'Thesis',
            help:
              type === 'argumentative'
                ? 'Your claim and your reasons in one sentence: something someone could disagree with.'
                : 'Your topic and the parts you will explain, in one sentence.',
            starters:
              type === 'argumentative'
                ? ['Schools should … because …', '… should … because …', 'Every student needs …']
                : ['… affects … in three ways.', 'There are three main …', '… works by …'],
          };
    case 'body1':
      return body(1, type);
    case 'body2':
      return body(2, type);
    case 'body3':
      return body(3, type);
    case 'evidence1':
      return evidence(1, type);
    case 'evidence2':
      return evidence(2, type);
    case 'evidence3':
      return evidence(3, type);
    case 'counterclaim':
      return {
        label: 'Counterclaim',
        line: 'Counterclaim',
        help: 'What the other side says, in fair words.',
        starters: ['Some people argue that …', 'Others say …', 'It is true that …'],
      };
    case 'rebuttal':
      return {
        label: 'Rebuttal',
        line: 'Rebuttal',
        help: 'Your answer: why your side is still stronger.',
        starters: ['However, …', 'Even so, …', 'This ignores …'],
      };
    // The conclusion.
    default:
      return type === 'narrative'
        ? {
            label: 'Reflection',
            line: 'Conclusion',
            help: 'What the experience taught you, and how you think or act now.',
            starters: ['Ever since, …', 'Now I know …', 'I will always …'],
          }
        : {
            label: 'Conclusion',
            line: 'Conclusion',
            help: 'Your thesis in new words, then a final thought: a call to act or a look ahead.',
            starters: ['In conclusion, …', 'Clearly, …', 'Next time you …'],
          };
  }
}

const field = z.string().trim().max(400).default('');
/** The words in each box of the outline builder. */
export const OutlinePlan = z.object({
  hook: field,
  thesis: field,
  body1: field,
  evidence1: field,
  body2: field,
  evidence2: field,
  body3: field,
  evidence3: field,
  counterclaim: field,
  rebuttal: field,
  conclusion: field,
});
export type OutlinePlan = z.infer<typeof OutlinePlan>;

export const emptyOutlinePlan = (): OutlinePlan => OutlinePlan.parse({});

/** The builder config on a writing activity: two or three body points, and a counterclaim. */
export const OutlineBuilder = z.object({
  label: z.string().trim().min(1).max(120),
  bodies: z.union([z.literal(2), z.literal(3)]).default(3),
  counterclaim: z.boolean().default(false),
});
export type OutlineBuilder = z.infer<typeof OutlineBuilder>;

/** The boxes a builder shows, in order. */
export function outlineFields(
  builder: Pick<OutlineBuilder, 'bodies' | 'counterclaim'>,
): OutlineField[] {
  const out: OutlineField[] = ['hook', 'thesis', 'body1', 'evidence1', 'body2', 'evidence2'];
  if (builder.bodies === 3) out.push('body3', 'evidence3');
  if (builder.counterclaim) out.push('counterclaim', 'rebuttal');
  out.push('conclusion');
  return out;
}

/** The outline as labelled lines ("Hook: …", "Thesis: …", "Body 1: …", "Evidence: …"). */
export function buildOutline(plan: OutlinePlan, builder: OutlineBuilder, type: EssayType): string {
  return outlineFields(builder)
    .filter((f) => plan[f].trim() !== '')
    .map((f) => `${outlineFieldInfo(f, type).line}: ${plan[f].trim()}`)
    .join('\n');
}

/**
 * The start of an essay: the introduction (hook + thesis), a paragraph per body point with its
 * evidence, a counterclaim paragraph, and the conclusion, each on its own line.
 */
export function buildEssayStart(plan: OutlinePlan, builder: OutlineBuilder): string {
  const join = (...fields: OutlineField[]) =>
    fields
      .map((f) => plan[f].trim())
      .filter((s) => s !== '')
      .join(' ');
  const paras = [
    join('hook', 'thesis'),
    join('body1', 'evidence1'),
    join('body2', 'evidence2'),
    ...(builder.bodies === 3 ? [join('body3', 'evidence3')] : []),
    ...(builder.counterclaim ? [join('counterclaim', 'rebuttal')] : []),
    join('conclusion'),
  ];
  return paras.filter((p) => p !== '').join('\n\n');
}

/** Every box of the builder has words. */
export const outlinePlanComplete = (plan: OutlinePlan, builder: OutlineBuilder) =>
  outlineFields(builder).every((f) => plan[f].trim().length > 0);
