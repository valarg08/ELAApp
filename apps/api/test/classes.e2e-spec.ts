import {
  ClassSummary,
  StudentCredential,
  StudentLookupResponse,
  StudentSummary,
  decodePictureSecret,
} from '@storyforge/shared';
import {
  type TestContext,
  addStudents,
  createClass,
  createClassWithStudents,
  createTestApp,
  loginStudent,
  registerTeacher,
  resetDatabase,
  wrongPictureSecret,
} from './helpers.js';

describe('Classes and student login (e2e)', () => {
  let ctx: TestContext;

  beforeAll(async () => {
    ctx = await createTestApp();
  });
  beforeEach(async () => {
    await resetDatabase(ctx.db);
  });
  afterAll(async () => {
    await ctx.app.close();
  });

  it('acceptance: a teacher creates a class, adds 3 students, and a student logs in with a picture password', async () => {
    const { client: teacher } = await registerTeacher(ctx.app);

    const created = await teacher
      .post('/teacher/classes', { name: '7B Writers', gradeLevel: 7 })
      .expect(201);
    const klass = ClassSummary.parse(created.body);
    expect(klass.joinCode).toMatch(/^[A-HJ-NP-Z2-9]{6}$/);

    const added = await teacher
      .post(`/teacher/classes/${klass.id}/students/bulk`, {
        names: ['Maya', 'Leo', 'Aarav'],
        secretKind: 'PICTURE',
      })
      .expect(201);
    const students = StudentCredential.array().parse(added.body);
    expect(students).toHaveLength(3);
    expect(new Set(students.map((s) => s.username)).size).toBe(3);
    for (const s of students) expect(decodePictureSecret(s.secret)).not.toBeNull();

    // Secrets are stored only as hashes.
    const stored = await ctx.db.user.findFirstOrThrow({
      where: { username: students[0]!.username },
    });
    expect(stored.studentSecretHash).toMatch(/^\$argon2id\$/);
    expect(stored.studentSecretHash).not.toContain(students[0]!.secret);

    // The student's "pick your name" screen.
    const lookup = await teacher
      .post('/auth/student/lookup', { joinCode: klass.joinCode.toLowerCase() })
      .expect(200);
    expect(StudentLookupResponse.parse(lookup.body).students.map((s) => s.displayName)).toEqual([
      'Aarav',
      'Leo',
      'Maya',
    ]);

    const maya = students.find((s) => s.displayName === 'Maya')!;
    const { client: student, res } = await loginStudent(ctx.app, klass.joinCode, maya);
    expect(res.status).toBe(200);
    const me = await student.get('/auth/me').expect(200);
    expect(me.body).toMatchObject({
      role: 'STUDENT',
      displayName: 'Maya',
      classes: [{ id: klass.id, name: '7B Writers' }],
    });

    const roster = await teacher.get(`/teacher/classes/${klass.id}/students`).expect(200);
    const mayaRow = StudentSummary.array()
      .parse(roster.body)
      .find((s) => s.displayName === 'Maya');
    expect(mayaRow?.lastLoginAt).not.toBeNull();
  });

  it('rejects a wrong picture password', async () => {
    const { client } = await registerTeacher(ctx.app);
    const { klass, students } = await createClassWithStudents(client, ['Maya']);
    const { res } = await loginStudent(ctx.app, klass.joinCode, {
      username: students[0]!.username,
      secret: wrongPictureSecret(students[0]!.secret),
    });
    expect(res.status).toBe(401);
    expect(res.body.code).toBe('INVALID_CREDENTIALS');
  });

  it('supports word codes', async () => {
    const { client } = await registerTeacher(ctx.app);
    const klass = await createClass(client, 'Words', 8);
    const [leo] = await addStudents(client, klass.id, ['Leo'], 'WORD');
    expect(leo!.secret).toMatch(/^[a-hj-kmnp-z2-9]{6}$/);
    const { res } = await loginStudent(ctx.app, klass.joinCode, {
      username: leo!.username,
      secret: leo!.secret.toUpperCase(),
    });
    expect(res.status).toBe(200);
  });

  it('locks a student after 10 failures until the teacher resets their password', async () => {
    const { client: teacher } = await registerTeacher(ctx.app);
    const { klass, students } = await createClassWithStudents(teacher, ['Maya']);
    const maya = students[0]!;
    const wrong = wrongPictureSecret(maya.secret);
    for (let i = 0; i < 10; i++) {
      await loginStudent(ctx.app, klass.joinCode, { username: maya.username, secret: wrong });
    }
    const locked = await loginStudent(ctx.app, klass.joinCode, maya);
    expect(locked.res.status).toBe(423);

    const roster = StudentSummary.array().parse(
      (await teacher.get(`/teacher/classes/${klass.id}/students`)).body,
    );
    expect(roster[0]!.locked).toBe(true);

    const reset = await teacher.post(`/teacher/students/${maya.id}/reset-secret`, {}).expect(200);
    const fresh = StudentCredential.parse(reset.body);
    expect((await loginStudent(ctx.app, klass.joinCode, maya)).res.status).toBe(401);
    expect((await loginStudent(ctx.app, klass.joinCode, fresh)).res.status).toBe(200);
  });

  it('records audit entries for bulk adds, resets and archiving, without secrets', async () => {
    const { client: teacher, userId } = await registerTeacher(ctx.app);
    const { klass, students } = await createClassWithStudents(teacher, ['Maya', 'Leo']);
    await teacher.post(`/teacher/students/${students[0]!.id}/reset-secret`, {}).expect(200);
    await teacher.delete(`/teacher/classes/${klass.id}`).expect(204);

    const entries = await ctx.db.auditLog.findMany({
      where: { actorId: userId },
      orderBy: { createdAt: 'asc' },
    });
    expect(entries.map((e) => [e.action, e.target])).toEqual([
      ['students.bulk_add', klass.id],
      ['student.reset_secret', students[0]!.id],
      ['class.archive', klass.id],
    ]);
    const serialized = JSON.stringify(entries);
    for (const s of students) expect(serialized).not.toContain(s.secret);
  });

  it("ends a student's sessions when the teacher resets their password", async () => {
    const { client: teacher } = await registerTeacher(ctx.app);
    const { klass, students } = await createClassWithStudents(teacher, ['Maya']);
    const { client: student } = await loginStudent(ctx.app, klass.joinCode, students[0]!);
    await teacher.post(`/teacher/students/${students[0]!.id}/reset-secret`, {}).expect(200);
    await student.post('/auth/refresh').expect(401);
  });

  it('renders login cards as a PDF, only for the current secrets', async () => {
    const { client: teacher } = await registerTeacher(ctx.app);
    const { klass, students } = await createClassWithStudents(teacher, ['Maya', 'Leo']);
    const cards = students.map((s) => ({ studentId: s.id, secret: s.secret }));

    const pdf = await teacher
      .post(`/teacher/classes/${klass.id}/login-cards`, { cards })
      .buffer(true)
      .parse((res, done) => {
        const chunks: Buffer[] = [];
        res.on('data', (c: Buffer) => chunks.push(c));
        res.on('end', () => done(null, Buffer.concat(chunks)));
      })
      .expect(200);
    expect(pdf.headers['content-type']).toBe('application/pdf');
    expect(Buffer.isBuffer(pdf.body) && pdf.body.subarray(0, 5).toString()).toBe('%PDF-');

    const stale = await teacher
      .post(`/teacher/classes/${klass.id}/login-cards`, {
        cards: [
          {
            studentId: students[0]!.id,
            secret: wrongPictureSecret(students[0]!.secret),
          },
        ],
      })
      .expect(422);
    expect(stale.body.code).toBe('SECRET_MISMATCH');
  });

  it('updates and archives a class; archived classes disappear and block student login', async () => {
    const { client: teacher } = await registerTeacher(ctx.app);
    const { klass, students } = await createClassWithStudents(teacher, ['Maya']);

    const renamed = await teacher
      .patch(`/teacher/classes/${klass.id}`, { name: '7B Storytellers', aiFeedbackMode: 'OFF' })
      .expect(200);
    expect(renamed.body).toMatchObject({ name: '7B Storytellers', aiFeedbackMode: 'OFF' });

    await teacher.delete(`/teacher/classes/${klass.id}`).expect(204);
    expect((await teacher.get('/teacher/classes').expect(200)).body).toEqual([]);
    await teacher.post('/auth/student/lookup', { joinCode: klass.joinCode }).expect(404);
    expect((await loginStudent(ctx.app, klass.joinCode, students[0]!)).res.status).toBe(401);
  });

  it('validates bulk input', async () => {
    const { client } = await registerTeacher(ctx.app);
    const klass = await createClass(client, 'V', 6);
    await client.post(`/teacher/classes/${klass.id}/students/bulk`, { names: [] }).expect(400);
    await client
      .post(`/teacher/classes/${klass.id}/students/bulk`, { names: Array(61).fill('Kid') })
      .expect(400);
    await client.post('/teacher/classes', { name: 'Too young', gradeLevel: 3 }).expect(400);
  });
});
