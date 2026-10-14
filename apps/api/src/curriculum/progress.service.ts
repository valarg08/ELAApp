import { Injectable } from '@nestjs/common';
import {
  ActivityContent,
  LessonSteps,
  STEP_IDS,
  StepId,
  type Track,
  type TrackProgress,
} from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { DatabaseService } from '../database/database.service.js';
import { CurriculumService } from './curriculum.service.js';

/**
 * The progress tracker (DESIGN.md §9.12): every unit and lesson of one track with the student's
 * status, best quiz scores and the latest feedback score on each challenge.
 */
@Injectable()
export class ProgressService {
  constructor(
    private readonly db: DatabaseService,
    private readonly curriculum: CurriculumService,
  ) {}

  async trackProgress(user: AuthUser, track: Track): Promise<TrackProgress> {
    const summaries = await this.curriculum.listUnits(user, undefined, track);
    const units = await this.db.client.unit.findMany({
      where: { track },
      orderBy: { number: 'asc' },
      include: { lessons: { orderBy: { order: 'asc' } } },
    });
    const lessonIds = units.flatMap((u) => u.lessons.map((l) => l.id));
    const progress = new Map(
      (
        await this.db.client.lessonProgress.findMany({
          where: { studentId: user.id, lessonId: { in: lessonIds } },
        })
      ).map((p) => [p.lessonId, p]),
    );

    // The activities each lesson uses: its quizzes and its challenge.
    const keysOf = new Map(
      units.flatMap((u) =>
        u.lessons.map((l) => {
          const [, , practice, challenge] = LessonSteps.parse(l.steps);
          return [l.id, { practice: practice.activityKeys, challenge: challenge.activityKey }];
        }),
      ),
    );
    const activities = await this.db.client.activity.findMany({
      where: { unitId: { in: units.map((u) => u.id) } },
    });
    const quizKeys = new Set(
      activities
        .filter((a) => ActivityContent.safeParse(a.config).data?.type === 'QUIZ')
        .map((a) => a.key),
    );
    const activityIdByKey = new Map(activities.map((a) => [a.key, a.id]));

    const attempts = await this.db.client.quizAttempt.findMany({
      where: { studentId: user.id, lessonId: { in: lessonIds }, submittedAt: { not: null } },
    });
    const submissions = await this.db.client.submission.findMany({
      where: { studentId: user.id, activityId: { in: activities.map((a) => a.id) } },
      include: {
        feedback: {
          where: { status: { in: ['READY', 'RELEASED'] } },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
    const rubrics = new Map(
      (await this.db.client.rubric.findMany()).map((r) => [r.id, r.maxScore]),
    );

    let quizzes = 0;
    let quizzesPassed = 0;
    let writingSubmitted = 0;
    const rows = units.map((unit) => {
      const summary = summaries.find((s) => s.id === unit.id);
      const available = summary?.available ?? false;
      const lessons = available
        ? unit.lessons.map((lesson, i) => {
            const p = progress.get(lesson.id);
            const keys = keysOf.get(lesson.id);
            const quizKey = keys?.practice.find((k) => quizKeys.has(k));
            const tries = quizKey
              ? attempts.filter((a) => a.lessonId === lesson.id && a.activityKey === quizKey)
              : [];
            const quiz = quizKey
              ? {
                  attempts: tries.length,
                  bestPercent: tries.length
                    ? Math.max(...tries.map((a) => Math.round(((a.score ?? 0) / a.total) * 100)))
                    : null,
                  passed: tries.some((a) => a.passed),
                }
              : null;
            if (quiz) {
              quizzes += 1;
              if (quiz.passed) quizzesPassed += 1;
            }
            const challengeId = keys ? activityIdByKey.get(keys.challenge) : undefined;
            const submission = submissions.find(
              (s) => s.activityId === challengeId && s.version >= 1,
            );
            const feedback = submission?.feedback[0];
            if (submission) writingSubmitted += 1;
            const previous = unit.lessons[i - 1];
            return {
              id: lesson.id,
              order: lesson.order,
              title: lesson.title,
              completed: !!p?.completedAt,
              completedSteps: StepId.array()
                .catch([])
                .parse(p?.completedSteps ?? []).length,
              totalSteps: STEP_IDS.length,
              locked: !!previous && !progress.get(previous.id)?.completedAt,
              quiz,
              writing: {
                submitted: !!submission,
                score: feedback?.totalScore ?? null,
                maxScore: feedback?.rubricId ? (rubrics.get(feedback.rubricId) ?? null) : null,
              },
            };
          })
        : [];
      return {
        id: unit.id,
        number: unit.number,
        slug: unit.slug,
        title: unit.title,
        available,
        lockReason: summary?.lockReason ?? null,
        lessonCount: unit.lessons.length,
        completedLessons: unit.lessons.filter((l) => progress.get(l.id)?.completedAt).length,
        lessons,
      };
    });

    return {
      track,
      units: rows,
      totals: {
        lessons: rows.reduce((n, u) => n + u.lessonCount, 0),
        completedLessons: rows.reduce((n, u) => n + u.completedLessons, 0),
        quizzes,
        quizzesPassed,
        writingSubmitted,
      },
    };
  }
}
