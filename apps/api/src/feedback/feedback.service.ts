import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import type { Feedback, Submission } from '@storyforge/db';
import { HOLDING_MESSAGE } from '@storyforge/ai';
import {
  CriterionScore,
  ErrorCode,
  FeedbackPoint,
  FeedbackStatus,
  type SubmissionFeedback,
} from '@storyforge/shared';
import { QueueService } from '../ai/queue.service.js';
import type { AuthUser } from '../auth/auth.types.js';
import { AppError, notFound } from '../common/app-error.js';
import { AuditService } from '../common/audit.service.js';
import { DatabaseService } from '../database/database.service.js';

const MESSAGES = {
  pending: 'Quill is reading your writing. Feedback usually takes under a minute.',
  awaiting: 'Quill has read your writing. Your teacher will look at the feedback first.',
  failed: 'Quill couldn’t read this one. Your teacher will give you feedback instead.',
} as const;

const meta = (f: Feedback): Record<string, unknown> =>
  typeof f.analyzers === 'object' && f.analyzers !== null && !Array.isArray(f.analyzers)
    ? { ...f.analyzers }
    : {};

/** Queues AI feedback on submit and shows it to students and teachers (DESIGN.md §8.1). */
@Injectable()
export class FeedbackService {
  private readonly logger = new Logger(FeedbackService.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly queue: QueueService,
    private readonly audit: AuditService,
  ) {}

  /** After a submit: one AI feedback per submitted version, unless the class has AI off. */
  async queueFor(submission: Submission): Promise<void> {
    const klass = await this.db.client.class.findUnique({ where: { id: submission.classId } });
    if (!klass || klass.aiFeedbackMode === 'OFF') return;
    const existing = await this.db.client.feedback.findFirst({
      where: {
        submissionId: submission.id,
        submissionVersion: submission.version,
        source: 'AI',
      },
    });
    if (existing) return;
    const feedback = await this.db.client.feedback.create({
      data: {
        submissionId: submission.id,
        submissionVersion: submission.version,
        source: 'AI',
        status: 'QUEUED',
      },
    });
    try {
      await this.queue.enqueueFeedback({ feedbackId: feedback.id });
    } catch (error) {
      // The submission itself succeeded; the teacher still gets the writing.
      this.logger.error(`Could not queue feedback ${feedback.id}: ${String(error)}`);
      await this.db.client.feedback.update({
        where: { id: feedback.id },
        data: { status: 'FAILED' },
      });
    }
  }

  /** Feedback for the latest submitted version. `asTeacher` adds scores and status. */
  async view(submission: Submission, asTeacher: boolean): Promise<SubmissionFeedback> {
    const empty: SubmissionFeedback = {
      state: 'none',
      version: null,
      message: null,
      summary: null,
      strengths: [],
      nextSteps: [],
      teacher: null,
    };
    const feedback = await this.db.client.feedback.findFirst({
      where: { submissionId: submission.id, source: 'AI' },
      orderBy: [{ submissionVersion: 'desc' }, { createdAt: 'desc' }],
    });
    if (!feedback) return empty;

    const info = meta(feedback);
    const openFlags = await this.db.client.safetyFlag.count({
      where: { submissionId: submission.id, status: 'OPEN', severity: { gte: 2 } },
    });
    const held = info.safetyHold === true || openFlags > 0;
    const content = {
      summary: feedback.summary,
      strengths: FeedbackPoint.array()
        .catch([])
        .parse(feedback.strengths ?? []),
      nextSteps: FeedbackPoint.array()
        .catch([])
        .parse(feedback.nextSteps ?? []),
    };
    const base = { ...empty, version: feedback.submissionVersion };

    if (asTeacher) {
      return {
        ...base,
        ...content,
        state: held ? 'held' : this.studentState(feedback),
        teacher: {
          feedbackId: feedback.id,
          status: FeedbackStatus.parse(feedback.status),
          scores: CriterionScore.array()
            .catch([])
            .parse(feedback.scores ?? []),
          totalScore: feedback.totalScore,
          needsTeacherAttention: info.needsTeacherAttention === true,
          declined: info.declined === true,
          model: feedback.model,
          openFlags,
        },
      };
    }

    if (held) return { ...base, state: 'held', message: HOLDING_MESSAGE };
    const state = this.studentState(feedback);
    if (state === 'ready') return { ...base, ...content, state };
    if (state === 'pending') return { ...base, state, message: MESSAGES.pending };
    if (state === 'awaiting-teacher') return { ...base, state, message: MESSAGES.awaiting };
    if (state === 'failed') return { ...base, state, message: MESSAGES.failed };
    return base;
  }

  private studentState(f: Feedback): SubmissionFeedback['state'] {
    switch (f.status) {
      case 'QUEUED':
        return 'pending';
      case 'READY':
      case 'RELEASED':
        return 'ready';
      case 'PENDING_REVIEW':
        return 'awaiting-teacher';
      case 'FAILED':
        return 'failed';
      case 'HIDDEN':
      case 'SUPERSEDED':
        return 'none';
    }
    return 'none';
  }

  /** Teacher approval mode: let the student see the AI feedback. */
  async release(teacher: AuthUser, feedbackId: string): Promise<void> {
    const feedback = await this.db.client.feedback.findUnique({
      where: { id: feedbackId },
      include: { submission: true },
    });
    const owned =
      feedback &&
      (await this.db.client.class.count({
        where: { id: feedback.submission.classId, teacherId: teacher.id },
      }));
    if (!feedback || !owned) throw notFound(ErrorCode.FEEDBACK_NOT_FOUND, 'Feedback not found.');
    if (feedback.status !== 'PENDING_REVIEW' || !feedback.summary) {
      throw new AppError(
        HttpStatus.CONFLICT,
        ErrorCode.VALIDATION_FAILED,
        'Nothing to release',
        'Only finished feedback waiting for review can be released.',
      );
    }
    await this.db.client.feedback.update({
      where: { id: feedbackId },
      data: { status: 'RELEASED', releasedAt: new Date() },
    });
    await this.audit.record(teacher.id, 'feedback.release', feedbackId);
  }
}
