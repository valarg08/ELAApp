import { Injectable } from '@nestjs/common';
import {
  ActivityContent,
  type ClassProgress,
  ErrorCode,
  INACTIVE_DAYS,
  LOW_CONFIDENCE,
  type LessonCell,
  LessonSteps,
  ReflectResponse,
  StepId,
  type StudentProgressDetail,
  type Track,
} from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { ClassAccessService } from '../classes/class-access.service.js';
import { notFound } from '../common/app-error.js';
import { DatabaseService } from '../database/database.service.js';
import { ProgressService } from './progress.service.js';

const DAY = 24 * 60 * 60 * 1000;
const READY = { in: ['READY', 'RELEASED'] as ('READY' | 'RELEASED')[] };

type LessonRow = { id: string; order: number; title: string; steps: unknown };
type UnitRow = { id: string; number: number; title: string; lessons: LessonRow[] };

const percent = (score: number, max: number) => Math.round((score / max) * 100);
const stepsOf = (value: unknown) =>
  StepId.array()
    .catch([])
    .parse(value ?? []);
/** The confidence a student gave in a lesson's reflection, if any. */
const confidenceOf = (responses: unknown): number | null =>
  typeof responses === 'object' && responses !== null && 'reflect' in responses
    ? (ReflectResponse.safeParse(responses.reflect).data?.confidence ?? null)
    : null;
const latest = (...dates: (Date | null | undefined)[]) =>
  dates.reduce<Date | null>((a, b) => (b && (!a || b > a) ? b : a), null);

/**
 * Teacher progress views (DESIGN.md §11.3): the class heatmap with this week's numbers, and one
 * student's profile. Only the teacher's own classes and the students enrolled in them (404
 * otherwise). Never includes student writing.
 */
@Injectable()
export class TeacherProgressService {
  constructor(
    private readonly db: DatabaseService,
    private readonly access: ClassAccessService,
    private readonly progress: ProgressService,
  ) {}

  async classProgress(
    teacher: AuthUser,
    classId: string,
    track: Track,
    unitNumber?: number,
  ): Promise<ClassProgress> {
    await this.access.ownedClass(teacher, classId);
    const now = Date.now();
    const weekAgo = new Date(now - 7 * DAY);
    const enrollments = await this.db.client.enrollment.findMany({
      where: { classId, student: { deletedAt: null } },
      include: { student: { select: { id: true, displayName: true } } },
      orderBy: { student: { displayName: 'asc' } },
    });
    const studentIds = enrollments.map((e) => e.studentId);
    const units: UnitRow[] = await this.db.client.unit.findMany({
      where: { track, published: true },
      orderBy: { number: 'asc' },
      include: { lessons: { orderBy: { order: 'asc' } } },
    });
    const trackLessonIds = new Set(units.flatMap((u) => u.lessons.map((l) => l.id)));
    const unitOfLesson = new Map(units.flatMap((u) => u.lessons.map((l) => [l.id, u.number])));

    const progressRows = await this.db.client.lessonProgress.findMany({
      where: { studentId: { in: studentIds } },
    });
    const trackRows = progressRows.filter((p) => trackLessonIds.has(p.lessonId));
    const progressOf = new Map(trackRows.map((p) => [`${p.studentId}|${p.lessonId}`, p]));

    // Last activity: any lesson step, writing in this class, or quiz try.
    const [submissionTimes, quizTimes] = await Promise.all([
      this.db.client.submission.groupBy({
        by: ['studentId'],
        where: { classId, studentId: { in: studentIds } },
        _max: { updatedAt: true },
      }),
      this.db.client.quizAttempt.groupBy({
        by: ['studentId'],
        where: { studentId: { in: studentIds } },
        _max: { startedAt: true },
      }),
    ]);
    const lastActive = new Map(
      studentIds.map((id) => [
        id,
        latest(
          ...progressRows.filter((p) => p.studentId === id).map((p) => p.updatedAt),
          submissionTimes.find((s) => s.studentId === id)?._max.updatedAt,
          quizTimes.find((q) => q.studentId === id)?._max.startedAt,
        ),
      ]),
    );

    // The unit to show: the one asked for, else the unit most students are working in.
    const current = (studentId: string) => {
      const numbers = trackRows
        .filter((p) => p.studentId === studentId)
        .map((p) => unitOfLesson.get(p.lessonId) ?? 0);
      return numbers.length ? Math.max(...numbers) : (units[0]?.number ?? 0);
    };
    const counts = new Map<number, number>();
    for (const id of studentIds) counts.set(current(id), (counts.get(current(id)) ?? 0) + 1);
    const busiest = [...counts.entries()].toSorted((a, b) => b[1] - a[1] || a[0] - b[0])[0]?.[0];
    const unit =
      units.find((u) => u.number === unitNumber) ??
      units.find((u) => u.number === busiest) ??
      units[0];

    const cellsOf = unit ? await this.unitCells(unit, classId, studentIds, progressOf) : null;

    const week = await this.week(classId, studentIds, weekAgo);
    return {
      track,
      units: units.map((u) => ({
        id: u.id,
        number: u.number,
        title: u.title,
        lessonCount: u.lessons.length,
      })),
      trackLessons: trackLessonIds.size,
      unit: unit
        ? {
            id: unit.id,
            number: unit.number,
            title: unit.title,
            lessons: unit.lessons.map((l) => ({
              id: l.id,
              order: l.order,
              title: l.title,
              completed: studentIds.filter((s) => progressOf.get(`${s}|${l.id}`)?.completedAt)
                .length,
            })),
          }
        : null,
      week: {
        ...week,
        activeStudents: studentIds.filter((id) => (lastActive.get(id) ?? 0) >= weekAgo).length,
        totalStudents: studentIds.length,
      },
      students: enrollments.map(({ student }) => {
        const at = lastActive.get(student.id) ?? null;
        const cells = cellsOf?.get(student.id) ?? [];
        return {
          id: student.id,
          displayName: student.displayName,
          lastActiveAt: at?.toISOString() ?? null,
          inactive: !at || now - at.getTime() > INACTIVE_DAYS * DAY,
          needsHelp: cells.some(
            (c) =>
              (c.confidence !== null && c.confidence <= LOW_CONFIDENCE) ||
              (c.quizPercent !== null && !c.quizPassed),
          ),
          trackCompletedLessons: trackRows.filter(
            (p) => p.studentId === student.id && p.completedAt,
          ).length,
          cells,
        };
      }),
    };
  }

  /** Each student's squares for one unit: lesson state, quiz, challenge writing, confidence. */
  private async unitCells(
    unit: UnitRow,
    classId: string,
    studentIds: string[],
    progressOf: Map<
      string,
      { completedAt: Date | null; completedSteps: unknown; responses: unknown }
    >,
  ): Promise<Map<string, LessonCell[]>> {
    const activities = await this.db.client.activity.findMany({ where: { unitId: unit.id } });
    const quizKeys = new Set(
      activities
        .filter((a) => ActivityContent.safeParse(a.config).data?.type === 'QUIZ')
        .map((a) => a.key),
    );
    const idByKey = new Map(activities.map((a) => [a.key, a.id]));
    const keys = new Map(
      unit.lessons.map((l) => {
        const [, , practice, challenge] = LessonSteps.parse(l.steps);
        return [
          l.id,
          {
            quiz: practice.activityKeys.find((k) => quizKeys.has(k)) ?? null,
            challengeId: idByKey.get(challenge.activityKey) ?? null,
          },
        ];
      }),
    );
    const [attempts, submissions, rubrics] = await Promise.all([
      this.db.client.quizAttempt.findMany({
        where: {
          studentId: { in: studentIds },
          lessonId: { in: unit.lessons.map((l) => l.id) },
          submittedAt: { not: null },
        },
      }),
      this.db.client.submission.findMany({
        where: {
          classId,
          studentId: { in: studentIds },
          activityId: { in: activities.map((a) => a.id) },
          version: { gte: 1 },
        },
        include: {
          feedback: { where: { status: READY }, orderBy: { createdAt: 'desc' }, take: 1 },
        },
      }),
      this.rubricMax(),
    ]);

    return new Map(
      studentIds.map((studentId) => [
        studentId,
        unit.lessons.map((lesson) => {
          const p = progressOf.get(`${studentId}|${lesson.id}`);
          const k = keys.get(lesson.id);
          const tries = k?.quiz
            ? attempts.filter(
                (a) =>
                  a.studentId === studentId && a.lessonId === lesson.id && a.activityKey === k.quiz,
              )
            : [];
          const submission = submissions.find(
            (s) => s.studentId === studentId && s.activityId === k?.challengeId,
          );
          const feedback = submission?.feedback[0];
          const max = feedback?.rubricId ? rubrics.get(feedback.rubricId) : undefined;
          const steps = stepsOf(p?.completedSteps).length;
          return {
            lessonId: lesson.id,
            state: p?.completedAt ? 'done' : steps > 0 ? 'in_progress' : 'not_started',
            completedSteps: steps,
            quizPercent: tries.length
              ? Math.max(...tries.map((a) => percent(a.score ?? 0, a.total)))
              : null,
            quizPassed: tries.length ? tries.some((a) => a.passed) : null,
            submitted: !!submission,
            scorePercent:
              feedback?.totalScore != null && max ? percent(feedback.totalScore, max) : null,
            confidence: confidenceOf(p?.responses),
          } satisfies LessonCell;
        }),
      ]),
    );
  }

  /** This week in the class: lessons finished, writing handed in and its average score. */
  private async week(classId: string, studentIds: string[], since: Date) {
    const [lessonsCompleted, handedIn, feedback, rubrics] = await Promise.all([
      this.db.client.lessonProgress.count({
        where: { studentId: { in: studentIds }, completedAt: { gte: since } },
      }),
      this.db.client.submission.aggregate({
        where: { classId, studentId: { in: studentIds }, submittedAt: { gte: since } },
        _count: true,
        _sum: { wordCount: true },
      }),
      this.db.client.feedback.findMany({
        where: {
          status: READY,
          createdAt: { gte: since },
          totalScore: { not: null },
          rubricId: { not: null },
          submission: { classId, studentId: { in: studentIds } },
        },
        select: { totalScore: true, rubricId: true },
      }),
      this.rubricMax(),
    ]);
    const scores = feedback
      .map((f) => {
        const max = f.rubricId ? rubrics.get(f.rubricId) : undefined;
        return max && f.totalScore != null ? (f.totalScore / max) * 100 : null;
      })
      .filter((s): s is number => s !== null);
    return {
      lessonsCompleted,
      submissions: handedIn._count,
      wordsSubmitted: handedIn._sum.wordCount ?? 0,
      averageScorePercent: scores.length
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : null,
    };
  }

  async studentProgress(
    teacher: AuthUser,
    classId: string,
    studentId: string,
    track: Track,
  ): Promise<StudentProgressDetail> {
    await this.access.ownedClass(teacher, classId);
    const enrollment = await this.db.client.enrollment.findFirst({
      where: { classId, studentId, student: { deletedAt: null } },
      include: { student: true },
    });
    if (!enrollment) throw notFound(ErrorCode.STUDENT_NOT_FOUND, 'Student not found.');
    const { student } = enrollment;
    // The tracker exactly as the student sees it in this class.
    const progress = await this.progress.trackProgress(
      { id: student.id, role: 'STUDENT' },
      track,
      classId,
    );

    const units = await this.db.client.unit.findMany({
      where: { track },
      include: { lessons: { select: { id: true, title: true } } },
    });
    const lessonInfo = new Map(
      units.flatMap((u) => u.lessons.map((l) => [l.id, { unit: u.number, title: l.title }])),
    );
    const lessonIds = [...lessonInfo.keys()];
    const [rows, attempts, submissions, rubrics] = await Promise.all([
      this.db.client.lessonProgress.findMany({
        where: { studentId, lessonId: { in: lessonIds } },
        orderBy: { updatedAt: 'desc' },
      }),
      this.db.client.quizAttempt.findMany({
        where: { studentId, lessonId: { in: lessonIds }, submittedAt: { not: null } },
        orderBy: { submittedAt: 'desc' },
        take: 15,
      }),
      this.db.client.submission.findMany({
        where: {
          studentId,
          classId,
          version: { gte: 1 },
          activity: { unitId: { in: units.map((u) => u.id) } },
        },
        orderBy: { submittedAt: 'desc' },
        take: 15,
        include: {
          activity: { select: { title: true, unit: { select: { number: true } } } },
          feedback: { where: { status: READY }, orderBy: { createdAt: 'desc' }, take: 1 },
        },
      }),
      this.rubricMax(),
    ]);

    const recent: StudentProgressDetail['recent'] = [
      ...rows.slice(0, 15).map((p) => {
        const steps = stepsOf(p.completedSteps).length;
        return {
          kind: 'lesson' as const,
          at: (p.completedAt ?? p.updatedAt).toISOString(),
          unitNumber: lessonInfo.get(p.lessonId)?.unit ?? 0,
          title: lessonInfo.get(p.lessonId)?.title ?? 'Lesson',
          detail: p.completedAt ? 'Finished the lesson' : `${steps} of 5 steps`,
        };
      }),
      ...attempts.map((a) => ({
        kind: 'quiz' as const,
        at: (a.submittedAt ?? a.startedAt).toISOString(),
        unitNumber: lessonInfo.get(a.lessonId)?.unit ?? 0,
        title: `${lessonInfo.get(a.lessonId)?.title ?? 'Lesson'} quiz`,
        detail: `${percent(a.score ?? 0, a.total)}% · ${a.passed ? 'passed' : 'not passed'}`,
      })),
      ...submissions.map((s) => {
        const f = s.feedback[0];
        const max = f?.rubricId ? rubrics.get(f.rubricId) : undefined;
        const score = f?.totalScore != null && max ? ` · ${Math.round(f.totalScore)}/${max}` : '';
        return {
          kind: 'writing' as const,
          at: (s.submittedAt ?? s.updatedAt).toISOString(),
          unitNumber: s.activity.unit.number,
          title: s.activity.title,
          detail: `${s.wordCount} words${score}`,
        };
      }),
    ]
      .toSorted((a, b) => b.at.localeCompare(a.at))
      .slice(0, 15);

    const confidence = rows.flatMap((p) => {
      const c = confidenceOf(p.responses);
      const info = lessonInfo.get(p.lessonId);
      return c !== null && info
        ? [
            {
              lessonId: p.lessonId,
              unitNumber: info.unit,
              lessonTitle: info.title,
              confidence: c,
              at: p.updatedAt.toISOString(),
            },
          ]
        : [];
    });

    const lastActive = latest(
      rows[0]?.updatedAt,
      attempts[0]?.startedAt,
      submissions[0]?.updatedAt,
    );
    return {
      student: {
        id: student.id,
        displayName: student.displayName,
        username: student.username,
        lastActiveAt: lastActive?.toISOString() ?? null,
      },
      progress,
      recent,
      confidence,
    };
  }

  private async rubricMax(): Promise<Map<string, number>> {
    return new Map((await this.db.client.rubric.findMany()).map((r) => [r.id, r.maxScore]));
  }
}
