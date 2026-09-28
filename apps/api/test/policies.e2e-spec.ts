import {
  Client,
  type TestContext,
  createClass,
  createClassWithStudents,
  createTestApp,
  loginStudent,
  registerTeacher,
  resetDatabase,
} from './helpers.js';

/**
 * Acceptance: cross-class access is denied (DESIGN.md §14.2 P1).
 * Another teacher's resources answer 404 so ids can't be probed; wrong roles answer 403.
 */
describe('Access policies (e2e)', () => {
  let ctx: TestContext;
  let teacherA: Client;
  let teacherB: Client;
  let classA: { id: string; joinCode: string };
  let studentA: { id: string; username: string; secret: string };

  beforeAll(async () => {
    ctx = await createTestApp();
    await resetDatabase(ctx.db);
    teacherA = (await registerTeacher(ctx.app, 'Teacher A')).client;
    teacherB = (await registerTeacher(ctx.app, 'Teacher B')).client;
    const created = await createClassWithStudents(teacherA, ['Maya']);
    classA = created.klass;
    studentA = created.students[0]!;
  });
  afterAll(async () => {
    await ctx.app.close();
  });

  describe("another teacher cannot reach teacher A's class", () => {
    it('cannot read it', async () => {
      const res = await teacherB.get(`/teacher/classes/${classA.id}`).expect(404);
      expect(res.body.code).toBe('CLASS_NOT_FOUND');
    });

    it('does not see it in their list', async () => {
      expect((await teacherB.get('/teacher/classes').expect(200)).body).toEqual([]);
    });

    it('cannot rename or archive it', async () => {
      await teacherB.patch(`/teacher/classes/${classA.id}`, { name: 'Mine now' }).expect(404);
      await teacherB.delete(`/teacher/classes/${classA.id}`).expect(404);
    });

    it('cannot list or add students', async () => {
      await teacherB.get(`/teacher/classes/${classA.id}/students`).expect(404);
      await teacherB
        .post(`/teacher/classes/${classA.id}/students/bulk`, { names: ['Intruder'] })
        .expect(404);
    });

    it("cannot reset teacher A's student or print their card", async () => {
      await teacherB.post(`/teacher/students/${studentA.id}/reset-secret`, {}).expect(404);
      await teacherB
        .post(`/teacher/classes/${classA.id}/login-cards`, {
          cards: [{ studentId: studentA.id, secret: studentA.secret }],
        })
        .expect(404);
    });

    it("cannot print a card for another class's student through their own class", async () => {
      const own = await createClass(teacherB, 'B class');
      await teacherB
        .post(`/teacher/classes/${own.id}/login-cards`, {
          cards: [{ studentId: studentA.id, secret: studentA.secret }],
        })
        .expect(404);
    });

    it('teacher A still has full access', async () => {
      await teacherA.get(`/teacher/classes/${classA.id}`).expect(200);
      await teacherA.get(`/teacher/classes/${classA.id}/students`).expect(200);
    });
  });

  describe('students cannot use teacher routes', () => {
    it('returns 403 for a logged-in student', async () => {
      const { client: student } = await loginStudent(ctx.app, classA.joinCode, studentA);
      const res = await student.get('/teacher/classes').expect(403);
      expect(res.body.code).toBe('FORBIDDEN');
      await student.post('/teacher/classes', { name: 'Hack', gradeLevel: 7 }).expect(403);
      await student.get(`/teacher/classes/${classA.id}/students`).expect(403);
    });

    it('a student cannot log in through a different class code', async () => {
      const other = await createClass(teacherB, 'Other');
      const { res } = await loginStudent(ctx.app, other.joinCode, studentA);
      expect(res.status).toBe(401);
    });
  });

  describe('anonymous visitors', () => {
    it('get 401 on teacher and profile routes', async () => {
      const anon = new Client(ctx.app);
      await anon.get('/teacher/classes').expect(401);
      await anon.get(`/teacher/classes/${classA.id}`).expect(401);
      await anon.get('/auth/me').expect(401);
    });
  });
});
