import { z } from 'zod';
import { MathFigure } from '../curriculum/math.js';
import { SatModuleKey, isSatDate } from '../curriculum/sat.js';

/** The SAT Math weekly test as the API and the page see it (sat-design.md). */

/** A question as the student sees it: never the answer or the solution. */
export const SatQuestionPublic = z.object({
  id: z.string(),
  kind: z.enum(['choice', 'typed']),
  prompt: z.string(),
  figure: MathFigure.optional(),
  /** The four choices A–D, for a multiple-choice question. */
  choices: z.array(z.string()).optional(),
});
export type SatQuestionPublic = z.infer<typeof SatQuestionPublic>;

/** A module being taken: its questions, the clock and what has been answered so far. */
export const SatModuleView = z.object({
  phase: z.literal('module'),
  id: z.string(),
  week: z.number().int(),
  title: z.string(),
  /** 1 or 2. */
  module: z.union([z.literal(1), z.literal(2)]),
  minutes: z.number().int(),
  /** ISO times; the clock runs from the server's, so a wrong device clock changes nothing. */
  deadline: z.string(),
  serverNow: z.string(),
  questions: z.array(SatQuestionPublic),
  answers: z.record(z.string(), z.string()),
  marked: z.array(z.string()),
  /** Choices crossed out, per question: letters A–D. */
  struck: z.record(z.string(), z.array(z.string())),
});
export type SatModuleView = z.infer<typeof SatModuleView>;

/** The autosave: everything the student has done in the open module. */
export const SaveSatRequest = z.object({
  answers: z.record(z.string(), z.string().max(40)),
  marked: z.array(z.string()).max(30),
  struck: z.record(z.string(), z.array(z.enum(['A', 'B', 'C', 'D'])).max(4)),
});
export type SaveSatRequest = z.infer<typeof SaveSatRequest>;

/** One question in the review after the test. */
export const SatReviewItem = z.object({
  id: z.string(),
  module: z.union([z.literal(1), z.literal(2)]),
  /** Its number in its module. */
  number: z.number().int(),
  kind: z.enum(['choice', 'typed']),
  prompt: z.string(),
  figure: MathFigure.optional(),
  choices: z.array(z.string()).optional(),
  yourAnswer: z.string().nullable(),
  /** The right choice letter or the accepted answer. */
  correctAnswer: z.string(),
  correct: z.boolean(),
  solution: z.string(),
  skill: z.string(),
  difficulty: z.number().int(),
});
export type SatReviewItem = z.infer<typeof SatReviewItem>;

/** Right answers out of the questions asked, for a content area or a skill. */
export const SatBreakdown = z.object({
  id: z.string(),
  label: z.string(),
  correct: z.number().int(),
  total: z.number().int(),
});
export type SatBreakdown = z.infer<typeof SatBreakdown>;

/** The finished test. */
export const SatResult = z.object({
  phase: z.literal('done'),
  id: z.string(),
  week: z.number().int(),
  title: z.string(),
  correct: z.number().int(),
  total: z.number().int(),
  /** Right answers and questions in each module, and which module 2 the student got. */
  modules: z.array(z.object({ correct: z.number().int(), total: z.number().int() })),
  variant: z.enum(['easy', 'hard']),
  submittedAt: z.string(),
  /** The estimated Math score (200–800) with the band it probably lies in. */
  score: z.object({ estimate: z.number().int(), low: z.number().int(), high: z.number().int() }),
  /** Right answers by content area and by skill, for the questions asked. */
  areas: z.array(SatBreakdown),
  skills: z.array(SatBreakdown.extend({ domain: z.string() })),
  review: z.array(SatReviewItem),
});
export type SatResult = z.infer<typeof SatResult>;

export const SatAttemptView = z.discriminatedUnion('phase', [SatModuleView, SatResult]);
export type SatAttemptView = z.infer<typeof SatAttemptView>;

/** One week on the SAT page. */
export const SatWeekSummary = z.object({
  week: z.number().int(),
  title: z.string(),
  sample: z.boolean(),
  questions: z.number().int(),
  minutes: z.number().int(),
  status: z.enum(['new', 'in-progress', 'done']),
  attemptId: z.string().nullable(),
  correct: z.number().int().nullable(),
  total: z.number().int().nullable(),
  score: z.number().int().nullable(),
  /** The day the week opens for the student's class (null when the class has no schedule). */
  opens: z.string().nullable(),
  /** Not open yet (a test already started stays open). */
  locked: z.boolean(),
  /** The newest week that is open: the one to take now. */
  current: z.boolean(),
});
export type SatWeekSummary = z.infer<typeof SatWeekSummary>;

/** What is stored for an attempt (a Json column, checked with Zod before every write). */
export const SatStoredModule = z.object({
  key: SatModuleKey,
  ids: z.array(z.string()),
  startedAt: z.string(),
  deadline: z.string(),
  submittedAt: z.string().nullable(),
  correct: z.number().int().nullable(),
  answers: z.record(z.string(), z.string()),
  marked: z.array(z.string()),
  struck: z.record(z.string(), z.array(z.string())),
});
export type SatStoredModule = z.infer<typeof SatStoredModule>;

export const SatStoredState = z.object({ modules: z.array(SatStoredModule).min(1).max(2) });
export type SatStoredState = z.infer<typeof SatStoredState>;

/** A question the student got wrong or left blank, from a finished test. */
export const SatMistake = z.object({
  id: z.string(),
  week: z.number().int(),
  title: z.string(),
  skill: z.string(),
  skillLabel: z.string(),
  domain: z.string(),
  domainLabel: z.string(),
  difficulty: z.number().int(),
  prompt: z.string(),
  figure: MathFigure.optional(),
  choices: z.array(z.string()).optional(),
  yourAnswer: z.string().nullable(),
  correctAnswer: z.string(),
  solution: z.string(),
});
export type SatMistake = z.infer<typeof SatMistake>;
export const SatMistakes = z.array(SatMistake);

// ───────── Adaptive practice (sat-design.md §7) ─────────

/** A practice question: like a test question, with its skill and the level it is at. */
export const SatPracticeQuestion = SatQuestionPublic.extend({
  /** 1-based number in the set. */
  number: z.number().int(),
  skill: z.string(),
  skillLabel: z.string(),
  /** 1 (easier) to 3 (harder). */
  level: z.number().int(),
});
export type SatPracticeQuestion = z.infer<typeof SatPracticeQuestion>;

export const SatPracticeSummary = z.object({
  right: z.number().int(),
  total: z.number().int(),
  skills: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      right: z.number().int(),
      total: z.number().int(),
    }),
  ),
});
export type SatPracticeSummary = z.infer<typeof SatPracticeSummary>;

/** A practice set: the question to answer now, or the summary once it is over. */
export const SatPracticeView = z.object({
  id: z.string(),
  size: z.number().int(),
  answered: z.number().int(),
  question: SatPracticeQuestion.nullable(),
  summary: SatPracticeSummary.nullable(),
});
export type SatPracticeView = z.infer<typeof SatPracticeView>;

export const SatPracticeAnswerRequest = z.object({
  questionId: z.string().max(80),
  answer: z.string().max(40),
});
export type SatPracticeAnswerRequest = z.infer<typeof SatPracticeAnswerRequest>;

/** The answer's result and the set moved on to its next question. */
export const SatPracticeResponse = z.object({
  correct: z.boolean(),
  correctAnswer: z.string(),
  solution: z.string(),
  next: SatPracticeView,
});
export type SatPracticeResponse = z.infer<typeof SatPracticeResponse>;

/** A skill's standing, for the practice page: weakest first. */
export const SatSkillStanding = z.object({
  id: z.string(),
  label: z.string(),
  domain: z.string(),
  domainLabel: z.string(),
  /** Share of the latest answers right (0–100), or null when never tried. */
  accuracy: z.number().int().nullable(),
  answered: z.number().int(),
  /** The level practice starts this skill at. */
  level: z.number().int(),
});
export type SatSkillStanding = z.infer<typeof SatSkillStanding>;
export const SatSkillStandings = z.array(SatSkillStanding);

// ───────── The class schedule (teacher) ─────────

/** A calendar day like 2026-11-02. */
export const SatDate = z.string().refine(isSatDate, 'Use a real date like 2026-11-02');

export const SetSatScheduleRequest = z.object({ startDate: SatDate.nullable() });
export type SetSatScheduleRequest = z.infer<typeof SetSatScheduleRequest>;

/** A class's SAT schedule: week 1 opens on the start date, then one week every 7 days. */
export const SatSchedule = z.object({
  startDate: SatDate.nullable(),
  timezone: z.string(),
  today: SatDate,
  weeks: z.array(
    z.object({ week: z.number().int(), title: z.string(), opens: SatDate.nullable() }),
  ),
});
export type SatSchedule = z.infer<typeof SatSchedule>;
