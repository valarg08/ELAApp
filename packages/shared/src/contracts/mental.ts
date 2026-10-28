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
/** The timed test after each unit: 20 problems in 25 minutes. */
export const MENTAL_UNIT_TEST_SIZE = 20;
export const MENTAL_UNIT_TEST_SECONDS = 25 * 60;

/** "mental-unit-5" → 5. */
export const mentalUnitOf = (key: string) => {
  const m = /^mental-unit-(\d{1,2})$/.exec(key);
  return m ? Number(m[1]) : null;
};

/** A unit test card: it opens when every lesson of the unit is finished. */
export const MentalUnitTest = z.object({
  unit: z.number(),
  title: z.string(),
  unlocked: z.boolean(),
  /** The best score so far (right answers out of MENTAL_UNIT_TEST_SIZE). */
  best: z.number().nullable(),
  openAttemptId: z.string().nullable(),
  lastAttemptId: z.string().nullable(),
});
export type MentalUnitTest = z.infer<typeof MentalUnitTest>;

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
  /** One per published unit, in unit order. */
  unitTests: z.array(MentalUnitTest),
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

/** The teacher's Mental Math skills view: practice per student, then skills × students. */
export const ClassMentalSkills = z.object({
  classId: z.string(),
  /** Skills someone in the class has answered, in unit order. */
  skills: z.array(z.object({ skill: z.string(), label: z.string(), unit: z.number() })),
  students: z.array(
    z.object({
      studentId: z.string(),
      displayName: z.string(),
      levels: z.record(z.string(), MasteryLevel),
      /** The placement check's starting level (null: not taken). */
      startLevel: z.number().nullable(),
      /** Levels whose check is passed. */
      badges: z.array(z.number()),
      streak: z.number(),
      sprintBest: z.object({ correct: z.number(), seconds: z.number() }).nullable(),
      /** The last Mental Math answer (null: none yet). */
      lastPracticeAt: z.string().nullable(),
    }),
  ),
  /** The class's five weakest skills (most students at Learning, with answers). */
  weakest: z.array(z.object({ skill: z.string(), label: z.string(), struggling: z.number() })),
});
export type ClassMentalSkills = z.infer<typeof ClassMentalSkills>;
