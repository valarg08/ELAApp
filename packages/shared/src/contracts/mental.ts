import { z } from 'zod';
import { MentalLevelsFile } from '../curriculum/math-content.js';
import { MasteryLevel } from './math.js';

export const MENTAL_REVIEW_SIZE = 6;
export const MENTAL_SPRINT_SIZE = 10;
export const MENTAL_SPRINT_SECONDS = 180;
/** Problems a sprint needs to choose from (from finished lessons). */
export const MENTAL_SPRINT_MIN = 5;
export const MENTAL_PLACEMENT_PER_LEVEL = 3;
export const MENTAL_LEVEL_CHECK_SIZE = 10;
/** Right answers out of MENTAL_LEVEL_CHECK_SIZE to pass a level check (and earn its badge). */
export const MENTAL_LEVEL_PASS = 9;

/** A level check card: it opens when every unit of the level is finished. */
export const MentalLevelCheck = z.object({
  level: z.number(),
  title: z.string(),
  unlocked: z.boolean(),
  lockedReason: z.string().nullable(),
  passed: z.boolean(),
  /** The best score so far (right answers). */
  best: z.number().nullable(),
  openAttemptId: z.string().nullable(),
  lastAttemptId: z.string().nullable(),
});
export type MentalLevelCheck = z.infer<typeof MentalLevelCheck>;

/** A student's Mental Math practice: the daily review, sprints, placement and level checks. */
export const MentalPractice = z.object({
  review: z.object({ due: z.number(), doneToday: z.boolean(), streak: z.number() }),
  sprint: z.object({
    /** Problems from finished lessons a sprint can use (needs MENTAL_SPRINT_MIN). */
    available: z.number(),
    /** The personal best: most right, then the fastest. */
    best: z.object({ correct: z.number(), seconds: z.number() }).nullable(),
    lastAttemptId: z.string().nullable(),
  }),
  placement: z.object({
    level: z.number().nullable(),
    startUnit: z.number().nullable(),
    openAttemptId: z.string().nullable(),
    lastAttemptId: z.string().nullable(),
  }),
  levelChecks: z.array(MentalLevelCheck),
});
export type MentalPractice = z.infer<typeof MentalPractice>;

/**
 * The Mental Math home (mental-math-design.md): the four age levels with their planned units, the
 * cheat sheets there are, and the pattern tips of the published units (the page picks one a day).
 * The units' progress comes from /units?track=MENTAL.
 */
export const MentalHome = z.object({
  levels: MentalLevelsFile,
  cheatSheets: z.array(z.object({ unitNumber: z.number(), unitTitle: z.string() })),
  tips: z.array(z.object({ unitNumber: z.number(), tip: z.string() })),
  /** Students only (null for teachers). */
  practice: MentalPractice.nullable(),
});
export type MentalHome = z.infer<typeof MentalHome>;

/** Mastery per Mental Math skill, by unit, with the streak, the sprint best and level badges. */
export const MentalProgress = z.object({
  streak: z.number(),
  sprintBest: z.object({ correct: z.number(), seconds: z.number() }).nullable(),
  /** Levels whose check is passed. */
  badges: z.array(z.number()),
  units: z.array(
    z.object({
      number: z.number(),
      title: z.string(),
      skills: z.array(
        z.object({
          skill: z.string(),
          label: z.string(),
          level: MasteryLevel,
          accuracy: z.number().nullable(),
          answered: z.number(),
        }),
      ),
    }),
  ),
});
export type MentalProgress = z.infer<typeof MentalProgress>;
