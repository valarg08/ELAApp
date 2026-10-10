import { ANALYZER_IDS } from '@storyforge/writing-analysis';
import { z } from 'zod';
import { WritingConstraints } from './constraints.js';

/**
 * Curriculum content format (DESIGN.md §9). Units, lessons and activities live as JSON files in
 * /content/units/unit-XX and are validated against these schemas before they reach the database.
 */

const text = (max = 2000) => z.string().trim().min(1).max(max);
const id = z.string().regex(/^[a-z0-9][a-z0-9-]*$/, 'Use lowercase letters, numbers and dashes');

// ───────── Activities ─────────

export const ActivityKey = z
  .string()
  .regex(/^u\d{2}\.[a-z0-9][a-z0-9-]*$/, 'Activity keys look like "u01.sort-show-tell"');

const activityBase = {
  key: ActivityKey,
  title: text(120),
  xpReward: z.number().int().min(0).max(500).optional(),
};

export const MultipleChoiceActivity = z.object({
  ...activityBase,
  type: z.literal('MULTIPLE_CHOICE'),
  questions: z
    .array(
      z.object({
        id,
        prompt: text(500),
        options: z
          .array(z.object({ id, text: text(300) }))
          .min(2)
          .max(5),
        correctOptionId: id,
        explanation: text(500),
        hint: text(300).optional(),
      }),
    )
    .min(1)
    .max(5),
});

export const SortActivity = z.object({
  ...activityBase,
  type: z.literal('SORT'),
  instructions: text(500),
  buckets: z
    .array(z.object({ id, label: text(60) }))
    .min(2)
    .max(4),
  items: z
    .array(z.object({ id, text: text(300), bucketId: id }))
    .min(2)
    .max(12),
});

export const HighlightActivity = z.object({
  ...activityBase,
  type: z.literal('HIGHLIGHT'),
  instructions: text(500),
  text: text(1500),
  /** Single words in `text` the student should tap (matched without case or punctuation). */
  targets: z.array(z.string().trim().min(1)).min(1).max(10),
  explanation: text(500),
});

export const ReflectionActivity = z.object({
  ...activityBase,
  type: z.literal('REFLECTION'),
  prompts: z.array(text(300)).min(1).max(3),
});

export const WRITING_ACTIVITY_TYPES = [
  'QUICK_WRITE',
  'SIX_WORD_STORY',
  'SHOW_TELL_TRANSFORM',
  'DESCRIBE_WITHOUT_NAMING',
  'VIVID_REWRITE',
] as const;

export const WritingActivity = z.object({
  ...activityBase,
  type: z.enum(WRITING_ACTIVITY_TYPES),
  prompt: text(1000),
  /** Text for the student to transform or rewrite, shown above the box. */
  starter: text(1500).optional(),
  tips: z.array(text(300)).max(5).default([]),
  constraints: WritingConstraints,
  /** Checks shown in the Coach panel (default: telling, filter words, senses, sentence variety). */
  analyzers: z.array(z.enum(ANALYZER_IDS)).min(1).optional(),
});

export const ActivityContent = z.discriminatedUnion('type', [
  MultipleChoiceActivity,
  SortActivity,
  HighlightActivity,
  ReflectionActivity,
  WritingActivity,
]);
export type ActivityContent = z.infer<typeof ActivityContent>;
export type WritingActivity = z.infer<typeof WritingActivity>;
export type PracticeActivity = Exclude<ActivityContent, WritingActivity>;

export const PRACTICE_ACTIVITY_TYPES = [
  'MULTIPLE_CHOICE',
  'SORT',
  'HIGHLIGHT',
  'REFLECTION',
] as const;

export const isWritingActivity = (a: ActivityContent): a is WritingActivity =>
  (WRITING_ACTIVITY_TYPES as readonly string[]).includes(a.type);

export const ActivitiesFile = z.array(ActivityContent);

// ───────── Lesson steps (always these five, in this order) ─────────

export const STEP_IDS = ['hook', 'learn', 'practice', 'challenge', 'reflect'] as const;
export type StepId = (typeof STEP_IDS)[number];
export const StepId = z.enum(STEP_IDS);

export const STEP_LABELS: Record<StepId, string> = {
  hook: 'Hook',
  learn: 'Learn',
  practice: 'Practice',
  challenge: 'Challenge',
  reflect: 'Reflect',
};

export const HookStep = z.discriminatedUnion('variant', [
  z.object({
    id: z.literal('hook'),
    type: z.literal('hook'),
    variant: z.literal('story'),
    title: text(120),
    paragraphs: z.array(text(1000)).min(1).max(6),
  }),
  z.object({
    id: z.literal('hook'),
    type: z.literal('hook'),
    variant: z.literal('compare'),
    prompt: text(300),
    a: text(500),
    b: text(500),
    reveal: text(500),
  }),
  z.object({
    id: z.literal('hook'),
    type: z.literal('hook'),
    variant: z.literal('question'),
    prompt: text(300),
    placeholder: text(120).optional(),
  }),
]);

export const LessonCard = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('definition'), title: text(120), body: text(800) }),
  z.object({
    kind: z.literal('example'),
    title: text(120),
    text: text(800),
    note: text(500).optional(),
  }),
  z.object({
    kind: z.literal('compare'),
    title: text(120),
    telling: text(500),
    showing: text(500),
    note: text(500).optional(),
  }),
  z.object({
    kind: z.literal('clue-hunt'),
    title: text(120),
    prompt: text(300),
    text: text(800),
    clues: z.array(z.string().trim().min(1)).min(1).max(6),
  }),
]);
export type LessonCard = z.infer<typeof LessonCard>;

export const LearnStep = z.object({
  id: z.literal('learn'),
  type: z.literal('mini_lesson'),
  cards: z.array(LessonCard).min(3).max(6),
});

export const PracticeStep = z.object({
  id: z.literal('practice'),
  type: z.literal('guided_practice'),
  activityKeys: z.array(ActivityKey).min(1).max(5),
});

export const ChallengeStep = z.object({
  id: z.literal('challenge'),
  type: z.literal('challenge'),
  activityKey: ActivityKey,
});

export const ReflectStep = z.object({
  id: z.literal('reflect'),
  type: z.literal('reflection'),
  prompts: z.array(text(300)).min(1).max(3),
  confidenceCheck: z.boolean().default(true),
});

export const LessonSteps = z.tuple([HookStep, LearnStep, PracticeStep, ChallengeStep, ReflectStep]);
export type LessonSteps = z.infer<typeof LessonSteps>;

export const LessonContent = z.object({
  slug: id,
  order: z.number().int().min(1).max(20),
  title: text(120),
  estMinutes: z.number().int().min(5).max(120),
  focusSkills: z.array(id).max(5).default([]),
  steps: LessonSteps,
});
export type LessonContent = z.infer<typeof LessonContent>;

// ───────── Units ─────────

export const UnitContent = z.object({
  number: z.number().int().min(1).max(12),
  slug: id,
  title: text(120),
  summary: text(500),
  bigIdeas: z.array(text(200)).max(6).default([]),
  published: z.boolean(),
  projectSpec: z
    .object({
      title: text(120),
      description: text(1000),
      minWords: z.number().int().positive(),
      maxWords: z.number().int().positive(),
    })
    .optional(),
});
export type UnitContent = z.infer<typeof UnitContent>;

export interface UnitBundle {
  unit: UnitContent;
  lessons: LessonContent[];
  activities: ActivityContent[];
}

// ───────── Cross-reference checks (things a schema alone can't express) ─────────

/** Lowercase word tokens with punctuation stripped, for highlight/clue matching. */
export function tokenize(passage: string): string[] {
  return passage.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)?.map((w) => w.toLowerCase()) ?? [];
}

export function validateUnitBundle({ unit, lessons, activities }: UnitBundle): string[] {
  const errors: string[] = [];
  const prefix = `u${String(unit.number).padStart(2, '0')}.`;
  const byKey = new Map<string, ActivityContent>();

  for (const a of activities) {
    if (byKey.has(a.key)) errors.push(`Duplicate activity key "${a.key}"`);
    byKey.set(a.key, a);
    if (!a.key.startsWith(prefix)) errors.push(`Activity "${a.key}" must start with "${prefix}"`);

    if (a.type === 'MULTIPLE_CHOICE') {
      for (const q of a.questions) {
        const ids = q.options.map((o) => o.id);
        if (new Set(ids).size !== ids.length) errors.push(`${a.key}/${q.id}: duplicate option ids`);
        if (!ids.includes(q.correctOptionId))
          errors.push(`${a.key}/${q.id}: correctOptionId "${q.correctOptionId}" is not an option`);
      }
    }
    if (a.type === 'SORT') {
      const buckets = new Set(a.buckets.map((b) => b.id));
      for (const item of a.items) {
        if (!buckets.has(item.bucketId))
          errors.push(`${a.key}/${item.id}: unknown bucket "${item.bucketId}"`);
      }
      for (const b of buckets) {
        if (!a.items.some((i) => i.bucketId === b))
          errors.push(`${a.key}: bucket "${b}" has no items`);
      }
    }
    if (a.type === 'HIGHLIGHT') {
      const tokens = new Set(tokenize(a.text));
      for (const t of a.targets) {
        if (!tokens.has(t.toLowerCase()))
          errors.push(`${a.key}: target "${t}" is not a word in the text`);
      }
    }
  }

  const orders = new Set<number>();
  const slugs = new Set<string>();
  for (const lesson of lessons) {
    const where = `lesson "${lesson.slug}"`;
    if (orders.has(lesson.order)) errors.push(`${where}: duplicate order ${lesson.order}`);
    if (slugs.has(lesson.slug)) errors.push(`${where}: duplicate slug`);
    orders.add(lesson.order);
    slugs.add(lesson.slug);

    const [, learn, practice, challenge] = lesson.steps;
    for (const card of learn.cards) {
      if (card.kind === 'clue-hunt') {
        const tokens = new Set(tokenize(card.text));
        for (const clue of card.clues) {
          if (!tokens.has(clue.toLowerCase()))
            errors.push(`${where}: clue "${clue}" is not a word in the card text`);
        }
      }
    }
    for (const key of practice.activityKeys) {
      const a = byKey.get(key);
      if (!a) errors.push(`${where}: practice activity "${key}" does not exist`);
      else if (isWritingActivity(a))
        errors.push(`${where}: practice activity "${key}" must not be a writing activity`);
    }
    const c = byKey.get(challenge.activityKey);
    if (!c) errors.push(`${where}: challenge activity "${challenge.activityKey}" does not exist`);
    else if (!isWritingActivity(c))
      errors.push(
        `${where}: challenge activity "${challenge.activityKey}" must be a writing activity`,
      );
  }

  const sorted = [...orders].toSorted((a, b) => a - b);
  if (sorted.some((o, i) => o !== i + 1))
    errors.push(`Lesson orders must be 1, 2, 3, … without gaps (got ${sorted.join(', ')})`);
  if (unit.published && lessons.length === 0)
    errors.push('A published unit needs at least one lesson');
  return errors;
}
