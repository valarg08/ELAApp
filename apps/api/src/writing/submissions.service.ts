import { HttpStatus, Injectable } from '@nestjs/common';
import {
  type Activity,
  type DraftVersion,
  type Lesson,
  Prisma,
  type Submission,
} from '@storyforge/db';
import {
  ActivityContent,
  type DiffResponse,
  ErrorCode,
  type LessonProgressView,
  type OpenSubmissionRequest,
  type RestoreRequest,
  type SaveDraftRequest,
  type SaveDraftResponse,
  SubmissionChoices,
  type SubmissionDetail,
  type SubmissionFeedback,
  type SubmitResponse,
  type VersionDetail,
  type VersionSummary,
  type WritingActivity,
  checkConstraints,
  constraintsWithTraits,
  countWords,
  describeProblem,
  diffStats,
  diffWords,
  isWritingActivity,
  submissionChoices,
  validMoods,
  validTraits,
} from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { AppError, notFound } from '../common/app-error.js';
import { CurriculumService } from '../curriculum/curriculum.service.js';
import { DatabaseService } from '../database/database.service.js';
import { FeedbackService } from '../feedback/feedback.service.js';
import { shouldSnapshot } from './snapshot-policy.js';

type LoadedSubmission = Submission & { activity: Activity & { lesson: Lesson | null } };

/** Newest versions returned by the history list. */
const VERSION_LIST_LIMIT = 200;

const conflict = () =>
  new AppError(
    HttpStatus.CONFLICT,
    ErrorCode.SUBMISSION_REVISION_CONFLICT,
    'Draft changed in another tab',
    'This writing was changed somewhere else (another tab or device).',
  );

const submissionNotFound = () => notFound(ErrorCode.SUBMISSION_NOT_FOUND, 'Writing not found.');

/** Editing a submission moves it out of "submitted" until it is submitted again. */
const statusAfterEdit = (s: Submission['status']) =>
  s === 'SUBMITTED' || s === 'RETURNED' ? 'REVISING' : s;

/**
 * The writing workspace (DESIGN.md §2.4, §5.4): one working copy per activity per student, plain-text
 * autosave guarded by `draftRevision`, snapshots, restore, diff and submit.
 * Never log student text.
 */
@Injectable()
export class SubmissionsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly curriculum: CurriculumService,
    private readonly feedback: FeedbackService,
  ) {}

  /** Create the student's working copy for a writing activity, or return the existing one. */
  async open(user: AuthUser, { activityId, classId }: OpenSubmissionRequest) {
    const activity = await this.db.client.activity.findUnique({
      where: { id: activityId },
      include: { unit: true },
    });
    if (!activity || !isWritingActivity(ActivityContent.parse(activity.config))) {
      throw notFound(ErrorCode.ACTIVITY_NOT_FOUND, 'Writing activity not found.');
    }
    if (!activity.unit.published) {
      throw notFound(ErrorCode.ACTIVITY_NOT_FOUND, 'Writing activity not found.');
    }
    const resolvedClassId = await this.curriculum.studentClassForUnit(user, activity.unit, classId);
    const key = { activityId, studentId: user.id, classId: resolvedClassId };
    const include = { activity: { include: { lesson: true } } } as const;
    try {
      const submission = await this.db.client.submission.upsert({
        where: { activityId_studentId_classId: key },
        create: { ...key, status: 'DRAFT', contentText: '' },
        update: {},
        include,
      });
      return this.detail(submission);
    } catch (e) {
      // Simultaneous opens (two tabs, React's dev double-render) can both try to create it.
      if (!(e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002')) throw e;
      return this.detail(
        await this.db.client.submission.findUniqueOrThrow({
          where: { activityId_studentId_classId: key },
          include,
        }),
      );
    }
  }

  async get(user: AuthUser, id: string): Promise<SubmissionDetail> {
    return this.detail(await this.readable(user, id));
  }

  /** AI feedback for the latest submitted version (scores and status for the teacher only). */
  async getFeedback(user: AuthUser, id: string): Promise<SubmissionFeedback> {
    const submission = await this.readable(user, id);
    return this.feedback.view(submission, user.role === 'TEACHER');
  }

  /** Autosave. Rejects a stale `baseRevision` with 409 unless the text already matches. */
  async saveDraft(
    user: AuthUser,
    id: string,
    { text, baseRevision }: SaveDraftRequest,
  ): Promise<SaveDraftResponse> {
    const current = await this.editable(user, id);
    const wordCount = countWords(text);
    const now = new Date();

    return this.db.client.$transaction(async (tx) => {
      const updated = await tx.submission.updateMany({
        where: { id, draftRevision: baseRevision },
        data: {
          contentText: text,
          wordCount,
          draftRevision: { increment: 1 },
          status: statusAfterEdit(current.status),
        },
      });
      if (updated.count === 0) {
        // A retried request whose first attempt already landed is not a conflict.
        const latest = await tx.submission.findUniqueOrThrow({ where: { id } });
        if (latest.contentText !== text) throw conflict();
        return {
          draftRevision: latest.draftRevision,
          savedAt: latest.updatedAt.toISOString(),
          wordCount,
          snapshotCreated: false,
        };
      }

      const revision = baseRevision + 1;
      const last = await this.lastVersion(tx, id);
      const snapshotCreated = shouldSnapshot(last, text, now);
      if (snapshotCreated) {
        await this.snapshot(tx, { ...current, contentText: text, wordCount }, revision, 'AUTOSAVE');
      }
      return { draftRevision: revision, savedAt: now.toISOString(), wordCount, snapshotCreated };
    });
  }

  /** Save the traits picked for the activity's trait picker (unknown traits are dropped). */
  async setTraits(user: AuthUser, id: string, traits: string[]): Promise<SubmissionDetail> {
    const current = await this.editable(user, id);
    const activity = writingActivity(current.activity);
    if (!activity.traitPicker) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        ErrorCode.VALIDATION_FAILED,
        'No traits here',
        'This activity doesn’t ask you to pick traits.',
      );
    }
    const choices: SubmissionChoices = {
      ...choicesOf(current),
      traits: validTraits(activity, traits),
    };
    const updated = await this.db.client.submission.update({
      where: { id },
      data: { choices: SubmissionChoices.parse(choices) },
      include: { activity: { include: { lesson: true } } },
    });
    return this.detail(updated);
  }

  /** Save the moods chosen for the activity's mood picker (one per scale; unknown moods are dropped). */
  async setMood(user: AuthUser, id: string, mood: string[]): Promise<SubmissionDetail> {
    const current = await this.editable(user, id);
    const activity = writingActivity(current.activity);
    if (!activity.moodPicker) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        ErrorCode.VALIDATION_FAILED,
        'No mood here',
        'This activity doesn’t ask you to choose a mood.',
      );
    }
    const choices: SubmissionChoices = { ...choicesOf(current), mood: validMoods(activity, mood) };
    const updated = await this.db.client.submission.update({
      where: { id },
      data: { choices: SubmissionChoices.parse(choices) },
      include: { activity: { include: { lesson: true } } },
    });
    return this.detail(updated);
  }

  /** "Save version": a snapshot the student asked for. */
  async saveVersion(user: AuthUser, id: string, baseRevision: number): Promise<VersionSummary> {
    const current = await this.editable(user, id);
    if (current.draftRevision !== baseRevision) throw conflict();
    const version = await this.snapshot(this.db.client, current, current.draftRevision, 'MANUAL');
    return versionSummary(version);
  }

  /**
   * Check the rules on the saved draft, then freeze it as a new submitted version. A lesson
   * challenge also completes its lesson step (when the earlier steps are done).
   */
  async submit(user: AuthUser, id: string, baseRevision: number): Promise<SubmitResponse> {
    const current = await this.editable(user, id);
    if (current.draftRevision !== baseRevision) throw conflict();
    const activity = writingActivity(current.activity);
    const { traits } = choicesOf(current);
    const picker = activity.traitPicker;
    if (picker && validTraits(activity, traits).length < picker.count) {
      const message =
        picker.count === 1
          ? 'Pick your character’s trait first.'
          : `Pick ${picker.count} traits first.`;
      throw new AppError(
        HttpStatus.UNPROCESSABLE_ENTITY,
        ErrorCode.CONSTRAINTS_NOT_MET,
        'Almost there',
        message,
        [message],
      );
    }
    const moodPicker = activity.moodPicker;
    if (
      moodPicker &&
      validMoods(activity, choicesOf(current).mood).length < moodPicker.axes.length
    ) {
      const message = 'Choose the mood of your setting first.';
      throw new AppError(
        HttpStatus.UNPROCESSABLE_ENTITY,
        ErrorCode.CONSTRAINTS_NOT_MET,
        'Almost there',
        message,
        [message],
      );
    }
    const constraints = constraintsWithTraits(activity, traits);
    const { wordCount, problems } = checkConstraints(current.contentText, constraints);
    if (wordCount === 0) {
      throw new AppError(
        HttpStatus.UNPROCESSABLE_ENTITY,
        ErrorCode.CONSTRAINTS_NOT_MET,
        'Almost there',
        'Write something first.',
        ['Write something first.'],
      );
    }
    if (constraints.enforcement === 'hard' && problems.length > 0) {
      throw new AppError(
        HttpStatus.UNPROCESSABLE_ENTITY,
        ErrorCode.CONSTRAINTS_NOT_MET,
        'Almost there',
        'Your writing doesn’t meet the challenge rules yet.',
        problems.map(describeProblem),
      );
    }

    const submitted = await this.db.client.$transaction(async (tx) => {
      const row = await tx.submission.update({
        where: { id },
        data: {
          status: 'SUBMITTED',
          version: { increment: 1 },
          submittedAt: new Date(),
          wordCount,
        },
        include: { activity: { include: { lesson: true } } },
      });
      await this.snapshot(tx, row, row.draftRevision, 'SUBMIT');
      return row;
    });

    await this.feedback.queueFor(submitted);
    return {
      submission: this.detail(submitted),
      lessonProgress: await this.completeLessonChallenge(user, submitted),
    };
  }

  async listVersions(user: AuthUser, id: string): Promise<VersionSummary[]> {
    await this.readable(user, id);
    const rows = await this.db.client.draftVersion.findMany({
      where: { submissionId: id },
      orderBy: [{ createdAt: 'desc' }, { revision: 'desc' }],
      take: VERSION_LIST_LIMIT,
    });
    return rows.map(versionSummary);
  }

  async getVersion(user: AuthUser, id: string, versionId: string): Promise<VersionDetail> {
    await this.readable(user, id);
    const version = await this.findVersion(id, versionId);
    return { ...versionSummary(version), text: version.contentText };
  }

  /**
   * Make an old version the current draft. The current text is snapshotted first if it isn't
   * already, so restoring never loses anything.
   */
  async restore(
    user: AuthUser,
    id: string,
    { versionId, baseRevision }: RestoreRequest,
  ): Promise<SubmissionDetail> {
    const current = await this.editable(user, id);
    if (current.draftRevision !== baseRevision) throw conflict();
    const version = await this.findVersion(id, versionId);

    const restored = await this.db.client.$transaction(async (tx) => {
      const last = await this.lastVersion(tx, id);
      if (last?.contentText !== current.contentText && current.contentText.trim()) {
        await this.snapshot(tx, current, current.draftRevision, 'AUTOSAVE');
      }
      const updated = await tx.submission.updateMany({
        where: { id, draftRevision: baseRevision },
        data: {
          contentText: version.contentText,
          wordCount: version.wordCount,
          draftRevision: { increment: 1 },
          status: statusAfterEdit(current.status),
        },
      });
      if (updated.count === 0) throw conflict();
      const row = await tx.submission.findUniqueOrThrow({
        where: { id },
        include: { activity: { include: { lesson: true } } },
      });
      await this.snapshot(tx, row, row.draftRevision, 'RESTORE');
      return row;
    });
    return this.detail(restored);
  }

  /** Word diff between two versions, or between a version and the current draft (`to` omitted). */
  async diff(user: AuthUser, id: string, fromId: string, toId?: string): Promise<DiffResponse> {
    const submission = await this.readable(user, id);
    const from = await this.findVersion(id, fromId);
    const toText = toId ? (await this.findVersion(id, toId)).contentText : submission.contentText;
    const segments = diffWords(from.contentText, toText);
    return { segments, ...diffStats(segments) };
  }

  // ───────── access ─────────

  /** The owner (student) or the teacher of the submission's class may read it. Others get 404. */
  private async readable(user: AuthUser, id: string): Promise<LoadedSubmission> {
    const submission = await this.db.client.submission.findUnique({
      where: { id },
      include: { activity: { include: { lesson: true } } },
    });
    if (!submission) throw submissionNotFound();
    if (user.role === 'STUDENT' && submission.studentId === user.id) return submission;
    if (user.role === 'TEACHER') {
      const owned = await this.db.client.class.count({
        where: { id: submission.classId, teacherId: user.id },
      });
      if (owned > 0) return submission;
    }
    throw submissionNotFound();
  }

  /** Only the owner edits, and graded work is final. */
  private async editable(user: AuthUser, id: string): Promise<LoadedSubmission> {
    const submission = await this.readable(user, id);
    if (submission.studentId !== user.id) throw submissionNotFound();
    if (submission.status === 'GRADED') {
      throw new AppError(
        HttpStatus.CONFLICT,
        ErrorCode.SUBMISSION_LOCKED,
        'Already graded',
        'Your teacher has graded this writing, so it can’t be changed.',
      );
    }
    return submission;
  }

  // ───────── helpers ─────────

  private async findVersion(submissionId: string, versionId: string): Promise<DraftVersion> {
    const version = await this.db.client.draftVersion.findFirst({
      where: { id: versionId, submissionId },
    });
    if (!version) throw notFound(ErrorCode.VERSION_NOT_FOUND, 'Version not found.');
    return version;
  }

  private lastVersion(tx: Prisma.TransactionClient, submissionId: string) {
    return tx.draftVersion.findFirst({
      where: { submissionId },
      orderBy: [{ createdAt: 'desc' }, { revision: 'desc' }],
    });
  }

  private async snapshot(
    tx: Prisma.TransactionClient,
    s: Pick<Submission, 'id' | 'version' | 'contentText' | 'wordCount'>,
    revision: number,
    reason: DraftVersion['reason'],
  ): Promise<DraftVersion> {
    const version = await tx.draftVersion.create({
      data: {
        submissionId: s.id,
        version: s.version,
        revision,
        reason,
        contentText: s.contentText,
        wordCount: s.wordCount,
      },
    });
    await tx.submission.update({
      where: { id: s.id },
      data: { lastSnapshotAt: version.createdAt },
    });
    return version;
  }

  private async completeLessonChallenge(
    user: AuthUser,
    submission: LoadedSubmission,
  ): Promise<LessonProgressView | null> {
    const { lessonId } = submission.activity;
    if (!lessonId) return null;
    try {
      return await this.curriculum.completeStep(user, lessonId, 'challenge', {});
    } catch (e) {
      // Submitted before finishing the earlier steps or lessons (or the unit was locked since): the writing is
      // saved, and the step completes when the student gets there.
      if (
        e instanceof AppError &&
        (e.code === ErrorCode.STEP_LOCKED ||
          e.code === ErrorCode.UNIT_LOCKED ||
          e.code === ErrorCode.LESSON_LOCKED)
      ) {
        return null;
      }
      throw e;
    }
  }

  private detail(s: LoadedSubmission): SubmissionDetail {
    return {
      id: s.id,
      status: s.status,
      text: s.contentText,
      wordCount: s.wordCount,
      draftRevision: s.draftRevision,
      version: s.version,
      submittedAt: s.submittedAt?.toISOString() ?? null,
      updatedAt: s.updatedAt.toISOString(),
      activity: { id: s.activity.id, key: s.activity.key, content: writingActivity(s.activity) },
      lesson: s.activity.lesson
        ? {
            id: s.activity.lesson.id,
            title: s.activity.lesson.title,
            order: s.activity.lesson.order,
          }
        : null,
      traits: choicesOf(s).traits,
      mood: choicesOf(s).mood,
    };
  }
}

const choicesOf = (s: Pick<Submission, 'choices'>) => submissionChoices(s.choices);

function writingActivity(activity: Activity): WritingActivity {
  const content = ActivityContent.parse(activity.config);
  if (!isWritingActivity(content)) throw new Error(`Activity ${activity.key} is not writing`);
  return content;
}

function versionSummary(v: DraftVersion): VersionSummary {
  return {
    id: v.id,
    version: v.version,
    revision: v.revision,
    reason: v.reason,
    wordCount: v.wordCount,
    createdAt: v.createdAt.toISOString(),
  };
}
