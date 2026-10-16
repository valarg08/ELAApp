import { z } from 'zod';
import { ToneChoice, WritingActivity } from '../curriculum/content.js';
import { PlotPlan } from '../curriculum/plot.js';
import { ParagraphPlan } from '../curriculum/paragraph.js';
import { ChecklistTicks } from '../curriculum/checklist.js';
import { OutlinePlan } from '../curriculum/outline.js';
import { LessonProgressView } from './curriculum.js';

/** Writing workspace contracts (DESIGN.md §5.4). Drafts are plain text. */

/** Autosave timing (§2.4): save 1.5 s after typing stops, at least every 10 s while typing. */
export const AUTOSAVE_DEBOUNCE_MS = 1500;
export const AUTOSAVE_MAX_WAIT_MS = 10_000;
/** The server snapshots a version 2 minutes after the last one, or after 50 changed words. */
export const SNAPSHOT_INTERVAL_MS = 2 * 60_000;
export const SNAPSHOT_WORD_DELTA = 50;
/** Roughly 10,000 words: far beyond any assignment, small enough to store every snapshot. */
export const MAX_DRAFT_CHARS = 60_000;

export const SubmissionStatus = z.enum(['DRAFT', 'SUBMITTED', 'RETURNED', 'REVISING', 'GRADED']);
export type SubmissionStatus = z.infer<typeof SubmissionStatus>;
export const SnapshotReason = z.enum(['AUTOSAVE', 'SUBMIT', 'MANUAL', 'RESTORE']);
export type SnapshotReason = z.infer<typeof SnapshotReason>;

const DraftText = z.string().max(MAX_DRAFT_CHARS, 'Your writing is too long to save.');
const Revision = z.number().int().min(0);

export const OpenSubmissionRequest = z.object({
  activityId: z.string().min(1),
  /** Optional; defaults to the student's class where the activity's unit is open. */
  classId: z.string().min(1).optional(),
});
export type OpenSubmissionRequest = z.infer<typeof OpenSubmissionRequest>;

export const SubmissionDetail = z.object({
  id: z.string(),
  status: SubmissionStatus,
  text: z.string(),
  wordCount: z.number(),
  draftRevision: z.number(),
  /** How many times it has been submitted. */
  version: z.number(),
  submittedAt: z.iso.datetime().nullable(),
  updatedAt: z.iso.datetime(),
  activity: z.object({ id: z.string(), key: z.string(), content: WritingActivity }),
  /** The lesson whose challenge this is, if any. */
  lesson: z.object({ id: z.string(), title: z.string(), order: z.number() }).nullable(),
  /** Traits the student picked for the activity's trait picker (empty when it has none). */
  traits: z.array(z.string()).default([]),
  /** Moods chosen for the activity's mood picker (empty when it has none). */
  mood: z.array(z.string()).default([]),
  /** Conflict card chosen for the activity's conflict picker. */
  conflict: z.string().nullable().default(null),
  /** Story mountain plan for the activity's plot planner. */
  plot: PlotPlan.default(PlotPlan.parse({})),
  /** Tone aimed for on the activity's tone sliders. */
  tone: ToneChoice.default({}),
  /** The student's own syllable counts for words (poems). */
  syllables: z.record(z.string(), z.number()).default({}),
  /** The paragraph builder's boxes. */
  paragraph: ParagraphPlan.default(ParagraphPlan.parse({})),
  /** The outline builder's boxes. */
  outline: OutlinePlan.default(OutlinePlan.parse({})),
  /** The checklist items the student ticked. */
  checklist: ChecklistTicks.default([]),
});
export type SubmissionDetail = z.infer<typeof SubmissionDetail>;

/** What the student chose before writing, stored in `Submission.choices`. */
export const SubmissionChoices = z.object({
  traits: z.array(z.string().max(30)).max(3).default([]),
  mood: z.array(z.string().max(30)).max(3).default([]),
  conflict: z.string().max(40).nullable().default(null),
  plot: PlotPlan.default(PlotPlan.parse({})),
  tone: ToneChoice.default({}),
  syllables: z.record(z.string().max(30), z.number().int().min(1).max(9)).default({}),
  paragraph: ParagraphPlan.default(ParagraphPlan.parse({})),
  outline: OutlinePlan.default(OutlinePlan.parse({})),
  checklist: ChecklistTicks.default([]),
});
export type SubmissionChoices = z.infer<typeof SubmissionChoices>;

/** Read `Submission.choices`, tolerating rows written before the column existed. */
export function submissionChoices(json: unknown): SubmissionChoices {
  const parsed = SubmissionChoices.safeParse(json ?? {});
  return parsed.success ? parsed.data : SubmissionChoices.parse({});
}

export const SetTraitsRequest = z.object({
  traits: z.array(z.string().trim().toLowerCase().min(1).max(30)).max(3),
});
export type SetTraitsRequest = z.infer<typeof SetTraitsRequest>;

export const SetSyllablesRequest = z.object({
  overrides: z.record(z.string().max(30), z.number().int().min(1).max(9)),
});
export type SetSyllablesRequest = z.infer<typeof SetSyllablesRequest>;

export const SetToneRequest = z.object({ tone: ToneChoice });
export type SetToneRequest = z.infer<typeof SetToneRequest>;

export const SetMoodRequest = z.object({
  mood: z.array(z.string().trim().toLowerCase().min(1).max(30)).max(3),
});
export type SetMoodRequest = z.infer<typeof SetMoodRequest>;

export const SetConflictRequest = z.object({ conflict: z.string().trim().min(1).max(40) });
export type SetConflictRequest = z.infer<typeof SetConflictRequest>;

export const SetPlotRequest = z.object({ plot: PlotPlan });
export type SetPlotRequest = z.infer<typeof SetPlotRequest>;

export const SetParagraphRequest = z.object({ paragraph: ParagraphPlan });
export type SetParagraphRequest = z.infer<typeof SetParagraphRequest>;

export const SetOutlineRequest = z.object({ outline: OutlinePlan });
export type SetOutlineRequest = z.infer<typeof SetOutlineRequest>;

export const SetChecklistRequest = z.object({ ticked: ChecklistTicks });
export type SetChecklistRequest = z.infer<typeof SetChecklistRequest>;

export const SaveDraftRequest = z.object({ text: DraftText, baseRevision: Revision });
export type SaveDraftRequest = z.infer<typeof SaveDraftRequest>;

export const SaveDraftResponse = z.object({
  draftRevision: z.number(),
  savedAt: z.iso.datetime(),
  wordCount: z.number(),
  snapshotCreated: z.boolean(),
});
export type SaveDraftResponse = z.infer<typeof SaveDraftResponse>;

/** Submit, snapshot and restore all name the revision the student is looking at. */
export const RevisionRequest = z.object({ baseRevision: Revision });
export type RevisionRequest = z.infer<typeof RevisionRequest>;

export const RestoreRequest = z.object({ versionId: z.string().min(1), baseRevision: Revision });
export type RestoreRequest = z.infer<typeof RestoreRequest>;

export const SubmitResponse = z.object({
  submission: SubmissionDetail,
  /** Updated lesson progress when this was a lesson challenge and the step is now complete. */
  lessonProgress: LessonProgressView.nullable(),
});
export type SubmitResponse = z.infer<typeof SubmitResponse>;

export const VersionSummary = z.object({
  id: z.string(),
  version: z.number(),
  revision: z.number(),
  reason: SnapshotReason,
  wordCount: z.number(),
  createdAt: z.iso.datetime(),
});
export type VersionSummary = z.infer<typeof VersionSummary>;

export const VersionDetail = VersionSummary.extend({ text: z.string() });
export type VersionDetail = z.infer<typeof VersionDetail>;

export const DiffResponse = z.object({
  segments: z.array(z.object({ type: z.enum(['same', 'added', 'removed']), text: z.string() })),
  added: z.number(),
  removed: z.number(),
});
export type DiffResponse = z.infer<typeof DiffResponse>;

export const SNAPSHOT_LABELS: Record<SnapshotReason, string> = {
  AUTOSAVE: 'Autosaved',
  MANUAL: 'Saved by you',
  SUBMIT: 'Submitted',
  RESTORE: 'Restored',
};
