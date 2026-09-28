import { HttpStatus, Injectable } from '@nestjs/common';
import {
  ErrorCode,
  type LoginRequest,
  type MeResponse,
  type RegisterTeacherRequest,
  type StudentLoginRequest,
  type StudentLookupResponse,
  StudentSecretKind,
} from '@storyforge/shared';
import { AppError, notFound, unauthenticated } from '../common/app-error.js';
import { DatabaseService } from '../database/database.service.js';
import type { AuthUser, IssuedSession } from './auth.types.js';
import { PasswordService } from './password.service.js';
import { TokenService } from './token.service.js';

/** Consecutive failed logins before an account locks (DESIGN.md §2.5). */
export const MAX_FAILED_LOGINS = 10;
/** Teachers unlock automatically after 15 minutes; students stay locked until a teacher resets them. */
const TEACHER_LOCK_MS = 15 * 60 * 1000;
const STUDENT_LOCKED_UNTIL = new Date('9999-12-31T00:00:00Z');

const invalidCredentials = () =>
  new AppError(
    HttpStatus.UNAUTHORIZED,
    ErrorCode.INVALID_CREDENTIALS,
    "Those details don't match",
    'Check them and try again.',
  );

const accountLocked = (student: boolean) =>
  new AppError(
    HttpStatus.LOCKED,
    ErrorCode.ACCOUNT_LOCKED,
    'Account locked',
    student
      ? 'Too many tries. Ask your teacher to reset your password.'
      : 'Too many failed attempts. Try again in 15 minutes.',
  );

export interface LoginResult {
  user: AuthUser;
  session: IssuedSession;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly passwords: PasswordService,
    private readonly tokens: TokenService,
  ) {}

  async registerTeacher(input: RegisterTeacherRequest): Promise<LoginResult> {
    const existing = await this.db.client.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw new AppError(
        HttpStatus.CONFLICT,
        ErrorCode.EMAIL_TAKEN,
        'Email already registered',
        'Log in instead, or use a different email.',
      );
    }
    const user = await this.db.client.user.create({
      data: {
        role: 'TEACHER',
        email: input.email,
        displayName: input.displayName,
        username: await this.uniqueTeacherUsername(input.email),
        passwordHash: await this.passwords.hash(input.password),
        lastLoginAt: new Date(),
      },
    });
    const authUser = { id: user.id, role: user.role };
    return { user: authUser, session: await this.tokens.issueSession(authUser) };
  }

  async loginTeacher(input: LoginRequest): Promise<LoginResult> {
    const user = await this.db.client.user.findUnique({ where: { email: input.email } });
    if (!user || !user.passwordHash || user.deletedAt || user.role === 'STUDENT') {
      await this.passwords.verifyDummy(input.password);
      throw invalidCredentials();
    }
    if (user.lockedUntil && user.lockedUntil > new Date()) throw accountLocked(false);

    if (!(await this.passwords.verify(user.passwordHash, input.password))) {
      await this.recordFailure(user.id, user.failedLogins, false);
      throw invalidCredentials();
    }
    return this.completeLogin(user.id, user.role);
  }

  /** Class name and roster (first names + usernames) for the "pick your name" step. */
  async lookupClass(joinCode: string): Promise<StudentLookupResponse> {
    const klass = await this.db.client.class.findUnique({
      where: { joinCode },
      include: {
        enrollments: {
          where: { student: { deletedAt: null } },
          include: { student: true },
          orderBy: { student: { displayName: 'asc' } },
        },
      },
    });
    if (!klass || klass.archivedAt) {
      throw notFound(ErrorCode.CLASS_NOT_FOUND, "We couldn't find that class code.");
    }
    return {
      className: klass.name,
      students: klass.enrollments.map(({ student }) => ({
        username: student.username,
        displayName: student.displayName,
        secretKind: StudentSecretKind.catch('PICTURE').parse(student.studentSecretKind),
      })),
    };
  }

  async loginStudent(input: StudentLoginRequest): Promise<LoginResult> {
    const enrollment = await this.db.client.enrollment.findFirst({
      where: {
        class: { joinCode: input.joinCode, archivedAt: null },
        student: { username: input.username, role: 'STUDENT', deletedAt: null },
      },
      include: { student: true },
    });
    const student = enrollment?.student;
    if (!student?.studentSecretHash) {
      await this.passwords.verifyDummy(input.secret);
      throw invalidCredentials();
    }
    if (student.lockedUntil && student.lockedUntil > new Date()) throw accountLocked(true);

    if (!(await this.passwords.verify(student.studentSecretHash, input.secret))) {
      await this.recordFailure(student.id, student.failedLogins, true);
      throw invalidCredentials();
    }
    return this.completeLogin(student.id, student.role);
  }

  refresh(refreshToken: string | undefined): Promise<LoginResult> {
    if (!refreshToken) throw unauthenticated();
    return this.tokens.rotate(refreshToken);
  }

  async logout(refreshToken: string | undefined): Promise<void> {
    if (refreshToken) await this.tokens.revokeByToken(refreshToken);
  }

  async me(user: AuthUser): Promise<MeResponse> {
    const record = await this.db.client.user.findUnique({
      where: { id: user.id },
      include: {
        enrollments: { include: { class: true } },
        taughtClasses: { where: { archivedAt: null }, orderBy: { createdAt: 'asc' } },
      },
    });
    if (!record || record.deletedAt) throw unauthenticated();
    const classes =
      record.role === 'STUDENT'
        ? record.enrollments.filter((e) => !e.class.archivedAt).map((e) => e.class)
        : record.taughtClasses;
    return {
      id: record.id,
      role: record.role,
      displayName: record.displayName,
      username: record.username,
      classes: classes.map((c) => ({ id: c.id, name: c.name })),
    };
  }

  private async completeLogin(userId: string, role: AuthUser['role']): Promise<LoginResult> {
    await this.db.client.user.update({
      where: { id: userId },
      data: { failedLogins: 0, lockedUntil: null, lastLoginAt: new Date() },
    });
    const user = { id: userId, role };
    return { user, session: await this.tokens.issueSession(user) };
  }

  private async recordFailure(userId: string, previous: number, student: boolean): Promise<void> {
    const failedLogins = previous + 1;
    const lock =
      failedLogins >= MAX_FAILED_LOGINS
        ? student
          ? STUDENT_LOCKED_UNTIL
          : new Date(Date.now() + TEACHER_LOCK_MS)
        : undefined;
    await this.db.client.user.update({
      where: { id: userId },
      data: { failedLogins, ...(lock ? { lockedUntil: lock } : {}) },
    });
  }

  private async uniqueTeacherUsername(email: string): Promise<string> {
    const base =
      (email.split('@')[0] ?? 'teacher').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') ||
      'teacher';
    for (let attempt = 0; attempt < 20; attempt++) {
      const candidate = attempt === 0 ? base : `${base}-${Math.floor(1000 + Math.random() * 9000)}`;
      const taken = await this.db.client.user.findUnique({ where: { username: candidate } });
      if (!taken) return candidate;
    }
    throw new Error('Could not generate a unique username');
  }
}
