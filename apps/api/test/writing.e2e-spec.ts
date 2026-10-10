import {
  DiffResponse,
  SaveDraftResponse,
  SubmissionDetail,
  SubmitResponse,
  UnitSummary,
  VersionDetail,
  VersionSummary,
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
} from './helpers.js';

/** 30 words, no banned words: passes u01.show-tell-write (25–150 words). */
const GOOD =
  'Her fists curled tight. She stomped across the kitchen, slammed the cupboard door, and glared ' +
  'at the broken plate on the floor. Her cheeks burned red. Nobody dared to speak.';
const words = (n: number, prefix = 'w') =>
  Array.from({ length: n }, (_, i) => `${prefix}${i}`).join(' ');

const save = (client: Client, id: string, text: string, baseRevision: number) =>
  client.patch(`/submissions/${id}/draft`, { text, baseRevision });

describe('Writing workspace (e2e)', () => {
  let ctx: TestContext;
  let teacher: Client;
  let student: Client;
  let classmate: Client;
  let activityId: string;
  let classId: string;

  beforeAll(async () => {
    ctx = await createTestApp();
    await resetDatabase(ctx.db);
    await seedContent(ctx.db);
    teacher = (await registerTeacher(ctx.app)).client;
    const { klass, students } = await createClassWithStudents(teacher, ['Maya', 'Leo']);
    classId = klass.id;
    student = (await loginStudent(ctx.app, klass.joinCode, students[0]!)).client;
    classmate = (await loginStudent(ctx.app, klass.joinCode, students[1]!)).client;
    activityId = (
      await ctx.db.activity.findUniqueOrThrow({ where: { key: 'u01.show-tell-write' } })
    ).id;
  });
  afterAll(async () => {
    await ctx.app.close();
  });

  const versions = async (id: string) =>
    VersionSummary.array().parse(
      (await student.get(`/submissions/${id}/versions`).expect(200)).body,
    );

  describe('opening a working copy', () => {
    it('creates one draft per activity and returns it again', async () => {
      const first = await openSubmission(student, activityId);
      expect(first).toMatchObject({
        status: 'DRAFT',
        text: '',
        wordCount: 0,
        draftRevision: 0,
        version: 0,
        activity: { key: 'u01.show-tell-write', content: { type: 'SHOW_TELL_TRANSFORM' } },
        lesson: { order: 2 },
      });
      expect((await openSubmission(student, activityId)).id).toBe(first.id);
    });

    it('rejects practice activities, unknown activities and teachers', async () => {
      const practice = await ctx.db.activity.findUniqueOrThrow({
        where: { key: 'u01.six-word-mc' },
      });
      await student.post('/submissions', { activityId: practice.id }).expect(404);
      await student.post('/submissions', { activityId: 'nope' }).expect(404);
      await student.post('/submissions', {}).expect(400);
      await teacher.post('/submissions', { activityId }).expect(403);
    });

    it('needs the unit to be open in the class', async () => {
      const unitId = UnitSummary.array().parse((await student.get('/units')).body)[0]!.id;
      await teacher
        .put(`/teacher/classes/${classId}/units/${unitId}`, { hidden: true })
        .expect(200);
      const locked = await classmate.post('/submissions', { activityId }).expect(403);
      expect(locked.body.code).toBe('UNIT_LOCKED');
      await teacher
        .put(`/teacher/classes/${classId}/units/${unitId}`, { hidden: false })
        .expect(200);
    });
  });

  describe('autosave', () => {
    it('saves with revisions and snapshots the first save, then after 50 changed words', async () => {
      const draft = await openSubmission(student, activityId);
      const first = SaveDraftResponse.parse(
        (await save(student, draft.id, 'The door slammed.', 0).expect(200)).body,
      );
      expect(first).toMatchObject({ draftRevision: 1, wordCount: 3, snapshotCreated: true });

      const small = SaveDraftResponse.parse(
        (await save(student, draft.id, 'The door slammed shut.', 1).expect(200)).body,
      );
      expect(small).toMatchObject({ draftRevision: 2, snapshotCreated: false });

      const big = SaveDraftResponse.parse(
        (await save(student, draft.id, `The door slammed shut. ${words(50)}`, 2).expect(200)).body,
      );
      expect(big).toMatchObject({ draftRevision: 3, wordCount: 54, snapshotCreated: true });

      const detail = SubmissionDetail.parse(
        (await student.get(`/submissions/${draft.id}`).expect(200)).body,
      );
      expect(detail).toMatchObject({ draftRevision: 3, wordCount: 54 });
      expect((await versions(draft.id)).map((v) => v.reason)).toEqual(['AUTOSAVE', 'AUTOSAVE']);
    });

    it('rejects a stale revision with 409 (two tabs), but accepts a retried identical save', async () => {
      const draft = await openSubmission(student, activityId);
      const rev = draft.draftRevision;
      await save(student, draft.id, 'Tab one wrote this.', rev).expect(200);

      const stale = await save(student, draft.id, 'Tab two wrote this.', rev).expect(409);
      expect(stale.body.code).toBe('SUBMISSION_REVISION_CONFLICT');

      // The same request again (e.g. the response was lost while offline) is fine.
      const retried = SaveDraftResponse.parse(
        (await save(student, draft.id, 'Tab one wrote this.', rev).expect(200)).body,
      );
      expect(retried).toMatchObject({ draftRevision: rev + 1, snapshotCreated: false });
    });

    it('validates the body', async () => {
      const draft = await openSubmission(student, activityId);
      await save(student, draft.id, 'x'.repeat(60_001), draft.draftRevision).expect(400);
      await save(student, draft.id, 'ok', -1).expect(400);
      await student.patch(`/submissions/${draft.id}/draft`, { text: 'no revision' }).expect(400);
    });
  });

  describe('versions, diff and restore', () => {
    it('saves a version on request, lists newest first and shows one', async () => {
      const draft = await openSubmission(student, activityId);
      const manual = VersionSummary.parse(
        (
          await student
            .post(`/submissions/${draft.id}/versions`, { baseRevision: draft.draftRevision })
            .expect(201)
        ).body,
      );
      expect(manual).toMatchObject({ reason: 'MANUAL', revision: draft.draftRevision });
      expect((await versions(draft.id))[0]!.id).toBe(manual.id);

      const shown = VersionDetail.parse(
        (await student.get(`/submissions/${draft.id}/versions/${manual.id}`).expect(200)).body,
      );
      expect(shown.text).toBe(draft.text);
      await student.get(`/submissions/${draft.id}/versions/nope`).expect(404);
      await student
        .post(`/submissions/${draft.id}/versions`, { baseRevision: draft.draftRevision - 1 })
        .expect(409);
    });

    it('diffs a version against another version or the current draft', async () => {
      const draft = await openSubmission(student, activityId);
      const before = VersionSummary.parse(
        (
          await student
            .post(`/submissions/${draft.id}/versions`, { baseRevision: draft.draftRevision })
            .expect(201)
        ).body,
      );
      await save(student, draft.id, 'The sky was grey.', draft.draftRevision).expect(200);
      const after = VersionSummary.parse(
        (
          await student
            .post(`/submissions/${draft.id}/versions`, { baseRevision: draft.draftRevision + 1 })
            .expect(201)
        ).body,
      );
      await save(student, draft.id, 'The sky was bruised.', draft.draftRevision + 1).expect(200);

      const toCurrent = DiffResponse.parse(
        (await student.get(`/submissions/${draft.id}/diff?from=${after.id}`).expect(200)).body,
      );
      expect(toCurrent.segments).toEqual([
        { type: 'same', text: 'The sky was ' },
        { type: 'removed', text: 'grey' },
        { type: 'added', text: 'bruised' },
        { type: 'same', text: '.' },
      ]);
      expect(toCurrent).toMatchObject({ added: 1, removed: 1 });

      const between = DiffResponse.parse(
        (await student.get(`/submissions/${draft.id}/diff?from=${before.id}&to=${after.id}`)).body,
      );
      expect(between.added).toBe(4);
      await student.get(`/submissions/${draft.id}/diff?from=nope`).expect(404);
    });

    it('restores an old version without losing the current text', async () => {
      const draft = await openSubmission(student, activityId);
      await save(student, draft.id, 'First idea.', draft.draftRevision).expect(200);
      const firstIdea = VersionSummary.parse(
        (
          await student
            .post(`/submissions/${draft.id}/versions`, { baseRevision: draft.draftRevision + 1 })
            .expect(201)
        ).body,
      );
      await save(student, draft.id, 'Second idea.', draft.draftRevision + 1).expect(200);

      await student
        .post(`/submissions/${draft.id}/restore`, {
          versionId: firstIdea.id,
          baseRevision: draft.draftRevision,
        })
        .expect(409);
      const restored = SubmissionDetail.parse(
        (
          await student
            .post(`/submissions/${draft.id}/restore`, {
              versionId: firstIdea.id,
              baseRevision: draft.draftRevision + 2,
            })
            .expect(200)
        ).body,
      );
      expect(restored).toMatchObject({
        text: 'First idea.',
        draftRevision: draft.draftRevision + 3,
      });

      const [newest, previous] = await versions(draft.id);
      expect(newest).toMatchObject({ reason: 'RESTORE', revision: restored.draftRevision });
      const kept = VersionDetail.parse(
        (await student.get(`/submissions/${draft.id}/versions/${previous!.id}`)).body,
      );
      expect(kept.text).toBe('Second idea.');
    });
  });

  describe('submit', () => {
    it('checks the rules on the saved draft (422) and the revision (409)', async () => {
      const draft = await openSubmission(student, activityId);
      const empty = await save(student, draft.id, '', draft.draftRevision).expect(200);
      const nothing = await student
        .post(`/submissions/${draft.id}/submit`, { baseRevision: empty.body.draftRevision })
        .expect(422);
      expect(nothing.body.errors).toEqual(['Write something first.']);

      const angry = await save(
        student,
        draft.id,
        `He was angry. ${words(25)}`,
        empty.body.draftRevision,
      ).expect(200);
      const banned = await student
        .post(`/submissions/${draft.id}/submit`, { baseRevision: angry.body.draftRevision })
        .expect(422);
      expect(banned.body).toMatchObject({
        code: 'CONSTRAINTS_NOT_MET',
        errors: ['Try writing without: angry.'],
      });

      await student
        .post(`/submissions/${draft.id}/submit`, { baseRevision: angry.body.draftRevision - 1 })
        .expect(409);
    });

    it('submits, moves to revising on edit, and resubmits as a new version', async () => {
      const draft = await openSubmission(student, activityId);
      const saved = await save(student, draft.id, GOOD, draft.draftRevision).expect(200);
      const result = SubmitResponse.parse(
        (
          await student
            .post(`/submissions/${draft.id}/submit`, { baseRevision: saved.body.draftRevision })
            .expect(200)
        ).body,
      );
      expect(result.submission).toMatchObject({ status: 'SUBMITTED', version: 1, text: GOOD });
      // Lesson 2's earlier steps aren't done, so the step isn't completed yet.
      expect(result.lessonProgress).toBeNull();
      expect((await versions(draft.id))[0]).toMatchObject({ reason: 'SUBMIT', version: 1 });

      await save(student, draft.id, `${GOOD} The end.`, saved.body.draftRevision).expect(200);
      const revising = SubmissionDetail.parse((await student.get(`/submissions/${draft.id}`)).body);
      expect(revising.status).toBe('REVISING');

      const again = SubmitResponse.parse(
        (
          await student
            .post(`/submissions/${draft.id}/submit`, { baseRevision: revising.draftRevision })
            .expect(200)
        ).body,
      );
      expect(again.submission).toMatchObject({ status: 'SUBMITTED', version: 2 });
    });

    it('locks graded writing', async () => {
      const draft = await openSubmission(student, activityId);
      await ctx.db.submission.update({ where: { id: draft.id }, data: { status: 'GRADED' } });
      const locked = await save(student, draft.id, 'Changed', draft.draftRevision).expect(409);
      expect(locked.body.code).toBe('SUBMISSION_LOCKED');
      await ctx.db.submission.update({ where: { id: draft.id }, data: { status: 'SUBMITTED' } });
    });
  });

  describe('authorisation', () => {
    let id: string;
    let versionId: string;
    beforeAll(async () => {
      const draft = await openSubmission(student, activityId);
      id = draft.id;
      versionId = (await versions(id))[0]!.id;
    });

    it('lets the class teacher read but not change it', async () => {
      await teacher.get(`/submissions/${id}`).expect(200);
      await teacher.get(`/submissions/${id}/versions`).expect(200);
      await teacher.get(`/submissions/${id}/versions/${versionId}`).expect(200);
      await teacher.get(`/submissions/${id}/diff?from=${versionId}`).expect(200);
      await save(teacher, id, 'x', 0).expect(403);
      await teacher.post(`/submissions/${id}/submit`, { baseRevision: 0 }).expect(403);
      await teacher.post(`/submissions/${id}/versions`, { baseRevision: 0 }).expect(403);
      await teacher.post(`/submissions/${id}/restore`, { versionId, baseRevision: 0 }).expect(403);
    });

    it('hides it from other students and other teachers (404)', async () => {
      const otherTeacher = (await registerTeacher(ctx.app, 'Other')).client;
      for (const client of [classmate, otherTeacher]) {
        await client.get(`/submissions/${id}`).expect(404);
        await client.get(`/submissions/${id}/versions`).expect(404);
        await client.get(`/submissions/${id}/versions/${versionId}`).expect(404);
        await client.get(`/submissions/${id}/diff?from=${versionId}`).expect(404);
      }
      await save(classmate, id, 'x', 0).expect(404);
      await classmate.post(`/submissions/${id}/submit`, { baseRevision: 0 }).expect(404);
      await classmate.post(`/submissions/${id}/versions`, { baseRevision: 0 }).expect(404);
      await classmate
        .post(`/submissions/${id}/restore`, { versionId, baseRevision: 0 })
        .expect(404);
    });

    it("hides it from a teacher's student in another class", async () => {
      const other = await registerTeacher(ctx.app, 'Third');
      const { klass, students } = await createClassWithStudents(other.client, ['Ana']);
      const [ana] = students;
      const outsider = (await loginStudent(ctx.app, klass.joinCode, ana!)).client;
      await outsider.get(`/submissions/${id}`).expect(404);
    });

    it('requires a login', async () => {
      const visitor = new Client(ctx.app);
      await visitor.get(`/submissions/${id}`).expect(401);
      await visitor.post('/submissions', { activityId }).expect(401);
      await visitor.patch(`/submissions/${id}/draft`, { text: 'x', baseRevision: 0 }).expect(401);
    });
  });
});
