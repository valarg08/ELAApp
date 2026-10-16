import { Injectable } from '@nestjs/common';
import {
  ActivityContent,
  ErrorCode,
  LessonSteps,
  type MathProblem,
  type ProblemSetActivity,
  type ProblemsActivity,
} from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { notFound } from '../common/app-error.js';
import { DatabaseService } from '../database/database.service.js';
import { CurriculumService } from '../curriculum/curriculum.service.js';

export type ProblemActivity = ProblemsActivity | ProblemSetActivity;

/** Finding Math problems (DESIGN.md §9.13) in lessons the student may open. */
@Injectable()
export class MathContentService {
  constructor(
    private readonly db: DatabaseService,
    private readonly curriculum: CurriculumService,
  ) {}

  /** A problem activity used by a lesson this user may open (practice or challenge step). */
  async lessonActivity(
    user: AuthUser,
    lessonId: string,
    key: string,
  ): Promise<{ activity: ProblemActivity; lessonTitle: string; unitNumber: number }> {
    const { lesson, unit } = await this.curriculum.openLesson(user, lessonId);
    const [, , practice, challenge] = LessonSteps.parse(lesson.steps);
    const used = practice.activityKeys.includes(key) || challenge.activityKey === key;
    const activity = used ? await this.activity(key) : null;
    if (!activity) throw notFound(ErrorCode.ACTIVITY_NOT_FOUND, 'Problems not found.');
    return { activity, lessonTitle: lesson.title, unitNumber: unit.number };
  }

  /** The problem activity with this key, or null. */
  async activity(key: string): Promise<ProblemActivity | null> {
    const row = await this.db.client.activity.findUnique({ where: { key } });
    const parsed = row ? ActivityContent.safeParse(row.config) : null;
    if (!parsed?.success) return null;
    const a = parsed.data;
    return a.type === 'PROBLEMS' || a.type === 'PROBLEM_SET' ? a : null;
  }

  problem(activity: ProblemActivity, problemId: string): MathProblem {
    const p = activity.problems.find((x) => x.id === problemId);
    if (!p) throw notFound(ErrorCode.NOT_FOUND, 'Problem not found.');
    return p;
  }
}
