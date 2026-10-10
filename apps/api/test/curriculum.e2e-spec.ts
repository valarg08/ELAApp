import {
  ClassUnitPacing,
  LessonDetail,
  LessonProgressView,
  UnitDetail,
  UnitSummary,
} from '@storyforge/shared';
import {
  Client,
  type TestContext,
  createClassWithStudents,
  createTestApp,
  loginStudent,
  openSubmission,
  registerTeacher,
  resetDatabase,
  seedContent,
  writeAndSubmit,
} from './helpers.js';

const CHALLENGE_TEXT = 'Wrong bus. Right friend. Lucky Tuesday.';

/** Valid answers for every step of a lesson, built from its content. */
function answersFor(lesson: LessonDetail) {
  const [, learn, practice, , reflect] = lesson.steps;
  return {
    hook: { response: 'It makes me curious.' },
    learn: { cardsViewed: learn.cards.length },
    practice: {
      results: practice.activityKeys.map((activityKey) => ({
        activityKey,
        correct: true,
        attempts: 1,
      })),
    },
    reflect: { answers: reflect.prompts.map(() => 'A thoughtful answer.'), confidence: 3 },
  };
}

describe('Curriculum and lesson progress (e2e)', () => {
  let ctx: TestContext;
  let teacher: Client;
  let student: Client;
  let classId: string;
  let joinCode: string;
  let maya: { id: string; username: string; secret: string };
  let lessonId: string;

  beforeAll(async () => {
    ctx = await createTestApp();
    await resetDatabase(ctx.db);
    await seedContent(ctx.db);
    teacher = (await registerTeacher(ctx.app)).client;
    const created = await createClassWithStudents(teacher, ['Maya']);
    classId = created.klass.id;
    joinCode = created.klass.joinCode;
    maya = created.students[0]!;
    student = (await loginStudent(ctx.app, joinCode, maya)).client;
  });
  afterAll(async () => {
    await ctx.app.close();
  });

  it('shows the unit map: Unit 1 open, unpublished units coming soon', async () => {
    const units = UnitSummary.array().parse((await student.get('/units').expect(200)).body);
    expect(units).toHaveLength(12);
    expect(units[0]).toMatchObject({
      number: 1,
      available: true,
      lockReason: null,
      lessonCount: 4,
      completedLessons: 0,
    });
    expect(units[2]).toMatchObject({ number: 3, available: false, lockReason: 'COMING_SOON' });
  });

  it('opens a unit by slug and lists its lessons in order', async () => {
    const unit = UnitDetail.parse((await student.get('/units/foundations').expect(200)).body);
    expect(unit.lessons.map((l) => l.order)).toEqual([1, 2, 3, 4]);
    expect(unit.lessons[0]).toMatchObject({ completedSteps: 0, totalSteps: 5, completed: false });
    lessonId = unit.lessons[0]!.id;
  });

  it('serves a lesson with its five steps and activities', async () => {
    const lesson = LessonDetail.parse((await student.get(`/lessons/${lessonId}`).expect(200)).body);
    expect(lesson.steps.map((s) => s.id)).toEqual([
      'hook',
      'learn',
      'practice',
      'challenge',
      'reflect',
    ]);
    const [, , practice, challenge] = lesson.steps;
    for (const key of [...practice.activityKeys, challenge.activityKey]) {
      expect(lesson.activities[key]).toBeDefined();
    }
    expect(lesson.progress.completedSteps).toEqual([]);
    expect(lesson.nextLessonId).not.toBeNull();
  });

  it('plays a lesson end to end: steps in order, practice and writing rules enforced, progress saved', async () => {
    const lesson = LessonDetail.parse((await student.get(`/lessons/${lessonId}`)).body);
    const answers = answersFor(lesson);
    const step = (id: string, body: object) =>
      student.post(`/lessons/${lessonId}/steps/${id}/complete`, body);

    // Skipping ahead is not allowed.
    const skipped = await step('practice', answers.practice).expect(409);
    expect(skipped.body.code).toBe('STEP_LOCKED');

    await step('hook', answers.hook).expect(200);
    await step('learn', answers.learn).expect(200);

    // Practice must be finished correctly.
    const unfinished = await step('practice', {
      results: [{ ...answers.practice.results[0], correct: false }],
    }).expect(422);
    expect(unfinished.body.code).toBe('PRACTICE_INCOMPLETE');
    await step('practice', answers.practice).expect(200);

    // The challenge is written in the workspace; the step only completes once it is submitted.
    const notSubmitted = await step('challenge', {}).expect(422);
    expect(notSubmitted.body.code).toBe('WRITING_NOT_SUBMITTED');
    const draft = await openSubmission(student, lesson.challengeActivityId);
    expect(draft).toMatchObject({ status: 'DRAFT', text: '', lesson: { id: lessonId } });

    // The six-word challenge needs exactly six words.
    const short = await student
      .patch(`/submissions/${draft.id}/draft`, {
        text: 'Only five words right here.',
        baseRevision: 0,
      })
      .expect(200);
    const tooShort = await student
      .post(`/submissions/${draft.id}/submit`, { baseRevision: short.body.draftRevision })
      .expect(422);
    expect(tooShort.body.code).toBe('CONSTRAINTS_NOT_MET');
    expect(tooShort.body.errors).toEqual(['Use exactly 6 words (you have 5).']);

    // Submitting completes the lesson step.
    const reopened = await openSubmission(student, lesson.challengeActivityId);
    const submitted = await writeAndSubmit(student, reopened, CHALLENGE_TEXT);
    expect(submitted.lessonProgress?.completedSteps).toContain('challenge');
    await step('challenge', {}).expect(200); // idempotent

    // Reflection needs every answer and the confidence check.
    await step('reflect', { answers: answers.reflect.answers }).expect(400);
    const finished = LessonProgressView.parse(
      (await step('reflect', answers.reflect).expect(200)).body,
    );
    expect(finished.completedSteps).toHaveLength(5);
    expect(finished.completedAt).not.toBeNull();
    expect(finished.responses.reflect).toMatchObject({ confidence: 3 });

    // The challenge text lives in the submission, not in the progress record.
    expect(finished.responses.challenge).toEqual({ wordCount: 6 });
    const submission = await ctx.db.submission.findFirstOrThrow({
      where: { studentId: maya.id },
      include: { versions: true },
    });
    expect(submission).toMatchObject({
      status: 'SUBMITTED',
      contentText: CHALLENGE_TEXT,
      wordCount: 6,
      version: 1,
      classId,
    });
    expect(submission.versions.filter((v) => v.reason === 'SUBMIT')).toHaveLength(1);
  });

  it('keeps progress after logging out and back in', async () => {
    const again = (await loginStudent(ctx.app, joinCode, maya)).client;
    const lesson = LessonDetail.parse((await again.get(`/lessons/${lessonId}`).expect(200)).body);
    expect(lesson.progress.completedSteps).toEqual([
      'hook',
      'learn',
      'practice',
      'challenge',
      'reflect',
    ]);
    expect((await openSubmission(again, lesson.challengeActivityId)).text).toBe(CHALLENGE_TEXT);
    const units = UnitSummary.array().parse((await again.get('/units')).body);
    expect(units[0]!.completedLessons).toBe(1);
  });

  it('lets a student redo a finished challenge (new submission version)', async () => {
    const lesson = LessonDetail.parse((await student.get(`/lessons/${lessonId}`)).body);
    const draft = await openSubmission(student, lesson.challengeActivityId);
    const { submission } = await writeAndSubmit(
      student,
      draft,
      'Dragon egg cracked. Babysitting starts now.',
    );
    expect(submission).toMatchObject({ version: 2, status: 'SUBMITTED' });
  });

  it('rejects unknown lessons and steps', async () => {
    await student.get('/lessons/does-not-exist').expect(404);
    await student.post(`/lessons/${lessonId}/steps/dance/complete`, {}).expect(404);
  });

  it('lets teachers preview lessons but not record progress', async () => {
    const lesson = LessonDetail.parse((await teacher.get(`/lessons/${lessonId}`).expect(200)).body);
    expect(lesson.progress.completedSteps).toEqual([]);
    await teacher.post(`/lessons/${lessonId}/steps/hook/complete`, { response: 'x' }).expect(403);
  });

  describe('pacing', () => {
    it('lists units for a class with their availability', async () => {
      const pacing = ClassUnitPacing.array().parse(
        (await teacher.get(`/teacher/classes/${classId}/units`).expect(200)).body,
      );
      expect(pacing[0]).toMatchObject({
        number: 1,
        available: true,
        hidden: false,
        lessonCount: 4,
      });
      expect(pacing[2]).toMatchObject({ number: 3, published: false, available: false });
    });

    it('locks and unlocks a unit, and sets a due date the student can see', async () => {
      const unitId = UnitSummary.array().parse((await student.get('/units')).body)[0]!.id;

      const locked = await teacher
        .put(`/teacher/classes/${classId}/units/${unitId}`, { hidden: true })
        .expect(200);
      expect(ClassUnitPacing.parse(locked.body)).toMatchObject({ available: false, hidden: true });

      const units = UnitSummary.array().parse((await student.get('/units')).body);
      expect(units[0]).toMatchObject({ available: false, lockReason: 'LOCKED' });
      const blocked = await student.get(`/lessons/${lessonId}`).expect(403);
      expect(blocked.body.code).toBe('UNIT_LOCKED');
      const detail = UnitDetail.parse((await student.get('/units/foundations')).body);
      expect(detail.lessons).toEqual([]);

      const dueAt = '2026-12-01T00:00:00.000Z';
      await teacher
        .put(`/teacher/classes/${classId}/units/${unitId}`, { hidden: false, dueAt })
        .expect(200);
      const reopened = UnitSummary.array().parse((await student.get('/units')).body);
      expect(reopened[0]).toMatchObject({ available: true, dueAt });
    });

    it('honours a scheduled unlock time', async () => {
      const unitId = UnitSummary.array().parse((await student.get('/units')).body)[0]!.id;
      const future = new Date(Date.now() + 86_400_000).toISOString();
      await teacher
        .put(`/teacher/classes/${classId}/units/${unitId}`, { unlockAt: future })
        .expect(200);
      expect(UnitSummary.array().parse((await student.get('/units')).body)[0]!.available).toBe(
        false,
      );
      await teacher
        .put(`/teacher/classes/${classId}/units/${unitId}`, { unlockAt: null })
        .expect(200);
      expect(UnitSummary.array().parse((await student.get('/units')).body)[0]!.available).toBe(
        true,
      );
    });

    it("blocks other teachers and students from a class's pacing", async () => {
      const other = (await registerTeacher(ctx.app, 'Other')).client;
      const unitId = UnitSummary.array().parse((await student.get('/units')).body)[0]!.id;
      await other.get(`/teacher/classes/${classId}/units`).expect(404);
      await other.put(`/teacher/classes/${classId}/units/${unitId}`, { hidden: true }).expect(404);
      await student.get(`/teacher/classes/${classId}/units`).expect(403);
    });

    it('validates pacing input', async () => {
      const unitId = UnitSummary.array().parse((await student.get('/units')).body)[0]!.id;
      await teacher
        .put(`/teacher/classes/${classId}/units/${unitId}`, { dueAt: 'tomorrow' })
        .expect(400);
      await teacher
        .put(`/teacher/classes/${classId}/units/not-a-unit`, { hidden: true })
        .expect(404);
    });
  });

  it('requires a login', async () => {
    const visitor = new Client(ctx.app);
    await visitor.get('/units').expect(401);
    await visitor.get(`/lessons/${lessonId}`).expect(401);
  });
});
