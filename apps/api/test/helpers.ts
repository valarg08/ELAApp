import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import type { PrismaClient } from '@storyforge/db';
import {
  CSRF_COOKIE,
  CSRF_HEADER,
  ClassSummary,
  StudentCredential,
  type StudentSecretKind,
  SubmissionDetail,
  SubmitResponse,
} from '@storyforge/shared';
import request from 'supertest';
import type TestAgent from 'supertest/lib/agent.js';
import { z } from 'zod';
import { AppModule } from '../src/app.module.js';
import { DatabaseService } from '../src/database/database.service.js';
import { configureApp } from '../src/setup.js';
import { loadContent } from '../src/curriculum/content-loader.js';
import { syncContent } from '../src/curriculum/content-sync.js';

export interface TestContext {
  app: NestExpressApplication;
  db: PrismaClient;
}

export async function createTestApp(): Promise<TestContext> {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = moduleRef.createNestApplication<NestExpressApplication>();
  configureApp(app, 'http://localhost:3000');
  await app.init();
  return { app, db: app.get(DatabaseService).client };
}

/** Empty every table (keeps the migrations table). */
export async function resetDatabase(db: PrismaClient): Promise<void> {
  const tables = await db.$queryRaw<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'`;
  if (tables.length === 0) return;
  const list = tables.map((t) => `"public"."${t.tablename}"`).join(', ');
  await db.$executeRawUnsafe(`TRUNCATE TABLE ${list} RESTART IDENTITY CASCADE`);
}

/** A cookie-keeping client that also sends the CSRF header, like the web app does. */
export class Client {
  readonly agent: TestAgent;
  private csrf: string | undefined;

  constructor(app: NestExpressApplication) {
    this.agent = request.agent(app.getHttpServer());
  }

  get(path: string) {
    return this.agent.get(`/api/v1${path}`);
  }

  post(path: string, body?: object) {
    return this.withCsrf(this.agent.post(`/api/v1${path}`)).send(body ?? {});
  }

  put(path: string, body: object) {
    return this.withCsrf(this.agent.put(`/api/v1${path}`)).send(body);
  }

  patch(path: string, body: object) {
    return this.withCsrf(this.agent.patch(`/api/v1${path}`)).send(body);
  }

  delete(path: string) {
    return this.withCsrf(this.agent.delete(`/api/v1${path}`));
  }

  /** Remember the CSRF cookie from a login/refresh response. */
  remember(res: request.Response): this {
    const value = cookieValue(res, CSRF_COOKIE);
    if (value) this.csrf = value;
    return this;
  }

  private withCsrf(req: request.Test) {
    return this.csrf ? req.set(CSRF_HEADER, this.csrf) : req;
  }
}

function setCookies(res: request.Response): string[] {
  const raw: unknown = res.headers['set-cookie'];
  if (typeof raw === 'string') return [raw];
  return Array.isArray(raw) ? raw.filter((c): c is string => typeof c === 'string') : [];
}

/** The full Set-Cookie header for one cookie. */
export function setCookieHeader(res: request.Response, name: string): string | undefined {
  return setCookies(res).find((c) => c.startsWith(`${name}=`));
}

/** Just the value of one cookie from a response's Set-Cookie headers. */
export function cookieValue(res: request.Response, name: string): string | undefined {
  const value = setCookieHeader(res, name)
    ?.split(';')[0]
    ?.slice(name.length + 1);
  return value ? decodeURIComponent(value) : undefined;
}

let teacherCount = 0;
const SessionBody = z.object({ user: z.object({ id: z.string() }) });

export async function registerTeacher(app: NestExpressApplication, name = 'Ms Rivera') {
  teacherCount += 1;
  const client = new Client(app);
  const email = `teacher${teacherCount}-${Date.now()}@example.test`;
  const res = await client
    .post('/auth/register', { email, password: 'correct horse battery', displayName: name })
    .expect(201);
  client.remember(res);
  return { client, email, userId: SessionBody.parse(res.body).user.id };
}

export async function createClass(client: Client, name = '7B Writers', gradeLevel = 7) {
  const res = await client.post('/teacher/classes', { name, gradeLevel }).expect(201);
  return ClassSummary.parse(res.body);
}

export async function addStudents(
  client: Client,
  classId: string,
  names: string[],
  secretKind: StudentSecretKind = 'PICTURE',
) {
  const res = await client
    .post(`/teacher/classes/${classId}/students/bulk`, { names, secretKind })
    .expect(201);
  return StudentCredential.array().parse(res.body);
}

export async function createClassWithStudents(client: Client, names: string[]) {
  const klass = await createClass(client);
  return { klass, students: await addStudents(client, klass.id, names) };
}

export async function loginStudent(
  app: NestExpressApplication,
  joinCode: string,
  student: Pick<StudentCredential, 'username' | 'secret'>,
) {
  const client = new Client(app);
  const res = await client.post('/auth/student/login', {
    joinCode,
    username: student.username,
    secret: student.secret,
  });
  client.remember(res);
  return { client, res };
}

/** A picture secret guaranteed to differ from `secret`. */
export const wrongPictureSecret = (secret: string) =>
  secret === 'cat-dog-sun-moon' ? 'dog-cat-sun-moon' : 'cat-dog-sun-moon';

/** Load /content into the (freshly reset) test database. */
export async function seedContent(db: PrismaClient): Promise<void> {
  const { units, errors } = await loadContent();
  if (errors.length > 0) throw new Error(`Invalid content:\n${errors.join('\n')}`);
  await syncContent(db, units);
}

/** Open the student's working copy of a writing activity. */
export async function openSubmission(client: Client, activityId: string) {
  const res = await client.post('/submissions', { activityId }).expect(200);
  return SubmissionDetail.parse(res.body);
}

/** Save text into a working copy (from its current revision) and submit it. */
export async function writeAndSubmit(client: Client, submission: SubmissionDetail, text: string) {
  const saved = await client
    .patch(`/submissions/${submission.id}/draft`, {
      text,
      baseRevision: submission.draftRevision,
    })
    .expect(200);
  const res = await client
    .post(`/submissions/${submission.id}/submit`, { baseRevision: saved.body.draftRevision })
    .expect(200);
  return SubmitResponse.parse(res.body);
}
