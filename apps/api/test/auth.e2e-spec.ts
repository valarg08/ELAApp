import { ACCESS_COOKIE, CSRF_COOKIE, ProblemDetails, REFRESH_COOKIE } from '@storyforge/shared';
import request from 'supertest';
import {
  Client,
  type TestContext,
  cookieValue,
  createTestApp,
  registerTeacher,
  resetDatabase,
  setCookieHeader,
} from './helpers.js';

describe('Auth (e2e)', () => {
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

  describe('teacher registration and login', () => {
    it('registers a teacher, sets secure session cookies and serves /auth/me', async () => {
      const client = new Client(ctx.app);
      const res = await client
        .post('/auth/register', {
          email: '  Rivera@School.TEST ',
          password: 'correct horse battery',
          displayName: 'Ms Rivera',
        })
        .expect(201);

      expect(setCookieHeader(res, ACCESS_COOKIE)).toMatch(/HttpOnly/i);
      expect(setCookieHeader(res, REFRESH_COOKIE)).toMatch(/HttpOnly/i);
      expect(setCookieHeader(res, ACCESS_COOKIE)).toMatch(/SameSite=Lax/i);
      expect(setCookieHeader(res, CSRF_COOKIE)).not.toMatch(/HttpOnly/i);

      const me = await client.get('/auth/me').expect(200);
      expect(me.body).toMatchObject({ role: 'TEACHER', displayName: 'Ms Rivera', classes: [] });

      const stored = await ctx.db.user.findUniqueOrThrow({
        where: { email: 'rivera@school.test' },
      });
      expect(stored.passwordHash).toMatch(/^\$argon2id\$/);
    });

    it('rejects a duplicate email with 409', async () => {
      const { email } = await registerTeacher(ctx.app);
      const res = await new Client(ctx.app)
        .post('/auth/register', { email, password: 'another long password', displayName: 'X' })
        .expect(409);
      expect(res.body).toMatchObject({ code: 'EMAIL_TAKEN', status: 409 });
    });

    it('returns problem details for invalid input', async () => {
      const res = await new Client(ctx.app)
        .post('/auth/register', { email: 'not-an-email', password: 'short', displayName: '' })
        .expect(400);
      expect(res.headers['content-type']).toMatch(/application\/problem\+json/);
      const problem = ProblemDetails.parse(res.body);
      expect(problem.code).toBe('VALIDATION_FAILED');
      expect(problem.errors?.length).toBeGreaterThanOrEqual(3);
    });

    it('logs in with the right password and rejects the wrong one generically', async () => {
      const { email } = await registerTeacher(ctx.app);
      await new Client(ctx.app)
        .post('/auth/login', { email, password: 'correct horse battery' })
        .expect(200);

      const wrong = await new Client(ctx.app)
        .post('/auth/login', { email, password: 'wrong password' })
        .expect(401);
      const unknown = await new Client(ctx.app)
        .post('/auth/login', { email: 'nobody@example.test', password: 'wrong password' })
        .expect(401);
      expect(wrong.body.code).toBe('INVALID_CREDENTIALS');
      expect(unknown.body.title).toBe(wrong.body.title);
    });

    it('locks a teacher account after 10 failed attempts', async () => {
      const { email } = await registerTeacher(ctx.app);
      for (let i = 0; i < 10; i++) {
        await new Client(ctx.app).post('/auth/login', { email, password: 'nope' }).expect(401);
      }
      const locked = await new Client(ctx.app)
        .post('/auth/login', { email, password: 'correct horse battery' })
        .expect(423);
      expect(locked.body.code).toBe('ACCOUNT_LOCKED');
    });
  });

  describe('sessions', () => {
    it('requires a login for protected routes', async () => {
      const res = await new Client(ctx.app).get('/auth/me').expect(401);
      expect(res.body.code).toBe('UNAUTHENTICATED');
    });

    it('rejects a tampered access token', async () => {
      await request(ctx.app.getHttpServer())
        .get('/api/v1/auth/me')
        .set('Cookie', `${ACCESS_COOKIE}=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4In0.bad`)
        .expect(401);
    });

    it('rotates the refresh token and detects reuse of an old one', async () => {
      const { client } = await registerTeacher(ctx.app);
      const first = await client.post('/auth/refresh').expect(200);
      const oldRefresh = cookieValue(first, REFRESH_COOKIE);
      const second = await client.post('/auth/refresh').expect(200);
      const newRefresh = cookieValue(second, REFRESH_COOKIE);
      expect(newRefresh).toBeDefined();
      expect(newRefresh).not.toBe(oldRefresh);

      // An attacker replays the old token: rejected, and the whole family is revoked.
      await request(ctx.app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .set('Cookie', `${REFRESH_COOKIE}=${oldRefresh}`)
        .expect(401);
      const afterReuse = await request(ctx.app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .set('Cookie', `${REFRESH_COOKIE}=${newRefresh}`)
        .expect(401);
      expect(afterReuse.body.code).toBe('REFRESH_INVALID');
    });

    it('logs out: clears cookies and revokes the refresh token', async () => {
      const { client } = await registerTeacher(ctx.app);
      const refreshed = await client.post('/auth/refresh').expect(200);
      const token = cookieValue(refreshed, REFRESH_COOKIE);
      const out = await client.post('/auth/logout').expect(204);
      expect(setCookieHeader(out, ACCESS_COOKIE)).toMatch(/Expires=Thu, 01 Jan 1970/);
      await request(ctx.app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .set('Cookie', `${REFRESH_COOKIE}=${token}`)
        .expect(401);
    });
  });

  describe('CSRF protection', () => {
    it('rejects state-changing requests without the CSRF header', async () => {
      const { client } = await registerTeacher(ctx.app);
      const res = await client.agent
        .post('/api/v1/teacher/classes')
        .send({ name: 'No token', gradeLevel: 7 })
        .expect(403);
      expect(res.body.code).toBe('CSRF_FAILED');
    });

    it('rejects a CSRF header that does not match the cookie', async () => {
      const { client } = await registerTeacher(ctx.app);
      await client.agent
        .post('/api/v1/teacher/classes')
        .set('x-csrf-token', 'forged')
        .send({ name: 'Forged', gradeLevel: 7 })
        .expect(403);
    });

    it('accepts the request when the header matches', async () => {
      const { client } = await registerTeacher(ctx.app);
      await client.post('/teacher/classes', { name: 'Real', gradeLevel: 7 }).expect(201);
    });
  });
});
