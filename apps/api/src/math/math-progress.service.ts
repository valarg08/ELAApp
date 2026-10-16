import { Injectable } from '@nestjs/common';
import {
  AMC_SECONDS_PER_PROBLEM,
  type ClassMathSkills,
  type DangerZone,
  ErrorCode,
  type FactSheetView,
  MATH_TEST_KEYS,
  type MathHome,
  MathTestAnswer,
  type MathSkillsView,
  POSITION_BANDS,
  type PositionRow,
  REVIEW_SIZE,
  type SimilarProblemResponse,
  type StageView,
  type TestCard,
  type TrapProblems,
  LessonSteps,
  bandOf,
  problemVariant,
  calibrationOf,
  median,
  stageOf,
} from '@storyforge/shared';
import { z } from 'zod';
import type { AuthUser } from '../auth/auth.types.js';
import { forbidden, notFound } from '../common/app-error.js';
import { ClassAccessService } from '../classes/class-access.service.js';
import { CurriculumService } from '../curriculum/curriculum.service.js';
import { DatabaseService } from '../database/database.service.js';
import { MasteryService } from './mastery.service.js';
import { MathContentService } from './math-content.service.js';
import { MathTestsService } from './math-tests.service.js';

const Answers = z.record(z.string(), MathTestAnswer);
const dayOf = (d: Date) => d.toISOString().slice(0, 10);

/**
 * The student's Math progress (math-design.md §3.2, §3.4): the /math home with its stages, tests
 * and today's review; skill mastery, calibration and the danger zones; fact sheets; "Try a
 * similar one"; and the teacher's class skills grid (§3.3 C5).
 */
@Injectable()
export class MathProgressService {
  constructor(
    private readonly db: DatabaseService,
    private readonly content: MathContentService,
    private readonly curriculum: CurriculumService,
    private readonly mastery: MasteryService,
    private readonly tests: MathTestsService,
    private readonly access: ClassAccessService,
  ) {}

  async home(user: AuthUser): Promise<MathHome> {
    this.studentOnly(user);
    const stagesFile = await this.content.stages();
    const stages: StageView[] = (stagesFile ?? []).map((s) => ({
      number: s.number,
      title: s.title,
      focus: s.focus,
      units: s.items.flatMap((i) =>
        i.kind === 'unit'
          ? [
              {
                number: i.unit,
                lessons: i.lessons ? ([i.lessons.from, i.lessons.to] as [number, number]) : null,
              },
            ]
          : [],
      ),
      tests: s.items.flatMap((i) =>
        i.kind === 'checkpoint' ? [i.key] : i.kind === 'diagnostic' ? ['diagnostic'] : [],
      ),
      extras: s.items.flatMap((i) =>
        i.kind === 'sprints' || i.kind === 'light-review' || i.kind === 'fact-sheets'
          ? [i.kind]
          : [],
      ),
    }));

    // The stage of the student's next Math lesson.
    const completed = await this.curriculum.completedLessons(user);
    const units = await this.db.client.unit.findMany({
      where: { track: 'MATH', published: true },
      orderBy: { number: 'asc' },
      include: { lessons: { orderBy: { order: 'asc' }, select: { id: true, order: true } } },
    });
    // With every published lesson done, the stage of the last one (until more units are published).
    let currentStage: number | null = null;
    if (stagesFile) {
      for (const u of units) {
        const next = u.lessons.find((l) => !completed.has(l.id));
        if (next) {
          currentStage = stageOf(stagesFile, u.number, next.order);
          break;
        }
      }
      const lastUnit = units.at(-1);
      const last = lastUnit?.lessons.at(-1);
      if (currentStage === null && lastUnit && last && completed.has(last.id))
        currentStage = stageOf(stagesFile, lastUnit.number, last.order);
    }

    const cards: TestCard[] = [];
    for (const key of MATH_TEST_KEYS) {
      const test = await this.content.test(key);
      if (!test) continue;
      const attempts = await this.db.client.mathTestAttempt.findMany({
        where: { studentId: user.id, testKey: key },
        orderBy: { startedAt: 'desc' },
      });
      const done = attempts.filter((a) => a.submittedAt);
      const best = done.reduce<(typeof done)[number] | null>(
        (b, a) => (!b || (a.points ?? 0) > (b.points ?? 0) ? a : b),
        null,
      );
      const locked = await this.tests.lockedReason(user, test.afterUnit);
      cards.push({
        key,
        kind: key === 'diagnostic' ? 'diagnostic' : 'checkpoint',
        title: test.title,
        instructions: test.instructions,
        problemCount: test.problems.length,
        timeLimitMinutes: test.timeLimitMinutes,
        unlocked: !locked,
        lockedReason: locked,
        attempts: done.length,
        best: best
          ? { points: best.points ?? 0, correct: best.correct ?? 0, total: best.total }
          : null,
        openAttemptId: attempts.find((a) => !a.submittedAt)?.id ?? null,
        lastAttemptId: done[0]?.id ?? null,
      });
    }

    const now = new Date();
    const pool = await this.content.pool(user);
    const poolSkills = new Set(pool.map((p) => p.problem.skill));
    const dueSkills = await this.db.client.mathSkillState.count({
      where: { studentId: user.id, dueAt: { lte: now }, skill: { in: [...poolSkills] } },
    });
    const dueRedos = await this.db.client.mathErrorLog.count({
      where: {
        studentId: user.id,
        resolvedAt: null,
        createdAt: { lt: new Date(`${dayOf(now)}T00:00:00Z`) },
      },
    });
    const doneToday = await this.db.client.mathTestAttempt.count({
      where: { studentId: user.id, testKey: `review:${dayOf(now)}`, submittedAt: { not: null } },
    });
    const factUnits = await this.content.factUnits();
    const factSheets = units
      .filter((u) => factUnits.includes(u.number))
      .map((u) => ({ number: u.number, slug: u.slug, title: u.title }));

    return {
      stages,
      currentStage,
      tests: cards,
      review: {
        due: Math.min(REVIEW_SIZE, Math.min(dueRedos, 3) + dueSkills),
        doneToday: doneToday > 0,
        streak: await this.tests.streak(user.id),
        lightAvailable: await this.tests.lightAvailable(user, pool),
      },
      sprintProblems: pool.filter((p) => p.problem.answer.kind === 'choice').length,
      factSheets,
    };
  }

  async skills(user: AuthUser): Promise<MathSkillsView> {
    this.studentOnly(user);
    const skills = await this.content.skills();
    const rows = (await this.mastery.rows([user.id])).get(user.id) ?? [];
    const levels = this.mastery.levels(rows);
    const states = new Map(
      (await this.db.client.mathSkillState.findMany({ where: { studentId: user.id } })).map((s) => [
        s.skill,
        s.dueAt,
      ]),
    );
    const view = skills.map((s) => {
      const m = levels.get(s.id);
      const mine = rows.filter((r) => r.skill === s.id);
      return {
        skill: s.id,
        label: s.label,
        strand: s.strand,
        units: s.units,
        level: m?.level ?? 'new',
        accuracy: m?.accuracy ?? null,
        answered: m?.answered ?? 0,
        dueAt: states.get(s.id)?.toISOString() ?? null,
        medianSeconds: median(mine.flatMap((r) => (r.seconds ? [r.seconds] : []))),
      };
    });

    const calibration = calibrationOf(rows);
    const positions = await this.positions(user.id);
    const zones: (DangerZone & { severity: number })[] = [];
    for (const s of view) {
      if (
        s.answered >= 3 &&
        s.accuracy !== null &&
        s.accuracy < 60 &&
        s.level !== 'strong' &&
        s.level !== 'mastered'
      )
        zones.push({
          kind: 'weak',
          skill: s.skill,
          title: s.label,
          reason: `Right about ${s.accuracy}% of the time recently.`,
          severity: 100 - s.accuracy,
        });
      const timed = rows.filter((r) => r.skill === s.skill && r.seconds).length;
      if (s.medianSeconds && timed >= 3 && s.medianSeconds > AMC_SECONDS_PER_PROBLEM * 1.5)
        zones.push({
          kind: 'slow',
          skill: s.skill,
          title: s.label,
          reason: `About ${Math.round(s.medianSeconds / 60)} minutes a problem; the AMC pace is 3.`,
          severity: Math.min(80, s.medianSeconds / 6),
        });
      const sure = rows.filter(
        (r) => r.skill === s.skill && r.confidence === 3 && r.verdict !== 'blank',
      );
      const sureWrong = sure.filter((r) => r.verdict !== 'correct').length;
      if (sure.length >= 3 && sureWrong >= 2 && sureWrong / sure.length > 0.3)
        zones.push({
          kind: 'overconfident',
          skill: s.skill,
          title: s.label,
          reason: `You marked ${sureWrong} wrong answers as "Sure". Check this skill's traps.`,
          severity: 50 + sureWrong * 5,
        });
    }
    for (const p of positions)
      if (p.answered >= 5 && p.percent !== null && p.percent < 50)
        zones.push({
          kind: 'position',
          skill: null,
          title: `Questions ${p.band.replace('-', '–')}`,
          reason: `${p.percent}% right in timed tests: slow down and check these, or leave a blank.`,
          severity: 100 - p.percent,
        });

    return {
      skills: view,
      calibration: calibration.rows,
      calibrationAdvice: calibration.advice,
      positions,
      dangerZones: zones
        .toSorted((a, b) => b.severity - a.severity)
        .slice(0, 3)
        .map(({ severity: _severity, ...z }) => z),
    };
  }

  /** Accuracy by question position in the student's tests and sprints. */
  private async positions(studentId: string): Promise<PositionRow[]> {
    const attempts = await this.db.client.mathTestAttempt.findMany({
      where: {
        studentId,
        kind: { in: ['diagnostic', 'checkpoint', 'sprint'] },
        submittedAt: { not: null },
      },
      orderBy: { submittedAt: 'desc' },
      take: 50,
      select: { answers: true },
    });
    const tally = new Map(POSITION_BANDS.map((b) => [b, { answered: 0, correct: 0 }]));
    for (const a of attempts) {
      for (const [i, ans] of Object.entries(Answers.catch({}).parse(a.answers))) {
        if (!ans.verdict || ans.verdict === 'blank') continue;
        const t = tally.get(bandOf(Number(i)))!;
        t.answered += 1;
        if (ans.verdict === 'correct') t.correct += 1;
      }
    }
    return POSITION_BANDS.map((band) => {
      const t = tally.get(band)!;
      return {
        band,
        ...t,
        percent: t.answered ? Math.round((t.correct / t.answered) * 100) : null,
      };
    });
  }

  async facts(user: AuthUser, unitNumber: number): Promise<FactSheetView> {
    const unit = await this.db.client.unit.findFirst({
      where: { track: 'MATH', number: unitNumber },
    });
    const sheet =
      unit && (user.role !== 'STUDENT' || unit.published)
        ? await this.content.facts(unitNumber)
        : null;
    if (!unit || !sheet) throw notFound(ErrorCode.NOT_FOUND, 'Fact sheet not found.');
    const skills = await this.content.skills();
    return {
      unitNumber,
      unitSlug: unit.slug,
      unitTitle: unit.title,
      sheet,
      skillLabels: Object.fromEntries(skills.map((s) => [s.id, s.label])),
    };
  }

  /**
   * "Try a similar one" for a practice problem without a template: another practice problem of the
   * same skill (the same difficulty first) from a finished lesson, not answered before.
   */
  async similar(
    user: AuthUser,
    lessonId: string,
    activityKey: string,
    problemId: string,
  ): Promise<SimilarProblemResponse> {
    this.studentOnly(user);
    const { activity } = await this.content.lessonActivity(user, lessonId, activityKey);
    const origin = this.content.problem(activity, problemId);
    const seen = new Set(
      (
        await this.db.client.mathAnswerLog.findMany({
          where: { studentId: user.id, skill: origin.skill },
          select: { activityKey: true, problemId: true },
        })
      ).map((r) => `${r.activityKey}/${r.problemId}`),
    );
    const candidates = (await this.content.pool(user)).filter(
      (p) =>
        p.type === 'PROBLEMS' &&
        p.problem.skill === origin.skill &&
        Math.abs(p.problem.difficulty - origin.difficulty) <= 1 &&
        !(p.activityKey === activityKey && p.problem.id === problemId) &&
        !seen.has(`${p.activityKey}/${p.problem.id}`),
    );
    const best = candidates.toSorted(
      (a, b) =>
        Math.abs(a.problem.difficulty - origin.difficulty) -
          Math.abs(b.problem.difficulty - origin.difficulty) || Math.random() - 0.5,
    )[0];
    if (!best) return { locator: null, problem: null };
    return {
      locator: {
        lessonId: best.lessonId,
        activityKey: best.activityKey,
        problemId: best.problem.id,
      },
      problem: best.problem,
    };
  }

  /** The class's skills × students grid of mastery levels, and its five weakest skills. */
  async classSkills(teacher: AuthUser, classId: string): Promise<ClassMathSkills> {
    await this.access.ownedClass(teacher, classId, { allowArchived: true });
    const enrollments = await this.db.client.enrollment.findMany({
      where: { classId, student: { deletedAt: null } },
      include: { student: { select: { id: true, displayName: true } } },
      orderBy: { student: { displayName: 'asc' } },
    });
    const ids = enrollments.map((e) => e.studentId);
    const rows = await this.mastery.rows(ids);
    const skills = await this.content.skills();
    const used = new Set([...rows.values()].flatMap((list) => list.map((r) => r.skill)));
    const shown = skills.filter((s) => used.has(s.id));
    const students = enrollments.map((e) => {
      const levels = this.mastery.levels(rows.get(e.studentId) ?? []);
      return {
        studentId: e.studentId,
        displayName: e.student.displayName,
        levels: Object.fromEntries(shown.map((s) => [s.id, levels.get(s.id)?.level ?? 'new'])),
        answered: new Set((rows.get(e.studentId) ?? []).map((r) => r.skill)),
      };
    });
    const weakest = shown
      .map((s) => ({
        skill: s.id,
        label: s.label,
        struggling: students.filter((st) => st.answered.has(s.id) && st.levels[s.id] === 'learning')
          .length,
      }))
      .filter((w) => w.struggling > 0)
      .toSorted((a, b) => b.struggling - a.struggling)
      .slice(0, 5);
    return {
      classId,
      skills: shown.map((s) => ({ skill: s.id, label: s.label, strand: s.strand })),
      students: students.map(({ answered: _answered, ...s }) => s),
      weakest,
    };
  }

  /** The trap picker's problems: this lesson's practice and set problems, missed ones first. */
  async trapProblems(user: AuthUser, lessonId: string): Promise<TrapProblems> {
    this.studentOnly(user);
    const { lesson } = await this.curriculum.openLesson(user, lessonId);
    const [, , practice, challenge] = LessonSteps.parse(lesson.steps);
    const misses = await this.db.client.mathAnswerLog.findMany({
      where: { studentId: user.id, lessonId, verdict: { not: 'correct' } },
      select: { activityKey: true, problemId: true, seed: true },
      orderBy: { createdAt: 'desc' },
    });
    const missed = new Map<string, number | null>();
    for (const m of misses) {
      const k = `${m.activityKey}/${m.problemId}`;
      if (!missed.has(k)) missed.set(k, m.seed);
    }
    const problems: TrapProblems['problems'] = [];
    for (const key of [...practice.activityKeys, challenge.activityKey]) {
      const activity = await this.content.activity(key);
      for (const p of activity?.problems ?? []) {
        const seed = missed.get(`${key}/${p.id}`);
        // The variant the student saw when they missed it (seed 0 otherwise).
        const shown = problemVariant(p, p.template ? (seed ?? 0) : undefined);
        problems.push({
          activityKey: key,
          problemId: p.id,
          prompt: shown.prompt,
          missed: seed !== undefined,
        });
      }
    }
    return { problems: problems.toSorted((a, b) => Number(b.missed) - Number(a.missed)) };
  }

  private studentOnly(user: AuthUser) {
    if (user.role !== 'STUDENT') throw forbidden('This is for students.');
  }
}
