import { Injectable } from '@nestjs/common';
import type { Class, User } from '@storyforge/db';
import {
  type BulkAddStudentsRequest,
  type ClassSummary,
  type CreateClassRequest,
  type StudentCredential,
  StudentSecretKind,
  type StudentSummary,
  type UpdateClassRequest,
} from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { PasswordService } from '../auth/password.service.js';
import { AuditService } from '../common/audit.service.js';
import { TokenService } from '../auth/token.service.js';
import { DatabaseService } from '../database/database.service.js';
import { ClassAccessService } from './class-access.service.js';
import { generateJoinCode, generateStudentSecret, generateUsername } from './credentials.js';

const DEFAULT_SETTINGS = {
  leaderboardEnabled: false,
  schoolDaysOnlyStreaks: true,
  peerReviewEnabled: false,
  hardConstraints: false,
};

const secretKindOf = (user: User) =>
  StudentSecretKind.catch('PICTURE').parse(user.studentSecretKind);

@Injectable()
export class ClassesService {
  constructor(
    private readonly db: DatabaseService,
    private readonly access: ClassAccessService,
    private readonly passwords: PasswordService,
    private readonly tokens: TokenService,
    private readonly audit: AuditService,
  ) {}

  async list(teacher: AuthUser, includeArchived = false): Promise<ClassSummary[]> {
    const classes = await this.db.client.class.findMany({
      where: { teacherId: teacher.id, ...(includeArchived ? {} : { archivedAt: null }) },
      include: { _count: { select: { enrollments: true } } },
      orderBy: { createdAt: 'asc' },
    });
    return classes.map((c) => toSummary(c, c._count.enrollments));
  }

  async create(teacher: AuthUser, input: CreateClassRequest): Promise<ClassSummary> {
    const klass = await this.db.client.class.create({
      data: {
        teacherId: teacher.id,
        name: input.name,
        gradeLevel: input.gradeLevel,
        timezone: input.timezone,
        joinCode: await this.uniqueJoinCode(),
        settings: DEFAULT_SETTINGS,
      },
    });
    return toSummary(klass, 0);
  }

  async get(teacher: AuthUser, classId: string): Promise<ClassSummary> {
    const klass = await this.access.ownedClass(teacher, classId);
    return toSummary(klass, await this.countStudents(classId));
  }

  async update(
    teacher: AuthUser,
    classId: string,
    input: UpdateClassRequest,
  ): Promise<ClassSummary> {
    await this.access.ownedClass(teacher, classId);
    const klass = await this.db.client.class.update({ where: { id: classId }, data: input });
    return toSummary(klass, await this.countStudents(classId));
  }

  /** Archive (soft delete). Students of an archived class can no longer log in through it. */
  async archive(teacher: AuthUser, classId: string): Promise<void> {
    await this.access.ownedClass(teacher, classId);
    await this.db.client.class.update({ where: { id: classId }, data: { archivedAt: new Date() } });
    await this.audit.record(teacher.id, 'class.archive', classId);
  }

  async listStudents(teacher: AuthUser, classId: string): Promise<StudentSummary[]> {
    await this.access.ownedClass(teacher, classId);
    const enrollments = await this.db.client.enrollment.findMany({
      where: { classId, student: { deletedAt: null } },
      include: { student: true },
      orderBy: { student: { displayName: 'asc' } },
    });
    const now = new Date();
    return enrollments.map(({ student }) => ({
      id: student.id,
      displayName: student.displayName,
      username: student.username,
      secretKind: secretKindOf(student),
      locked: !!student.lockedUntil && student.lockedUntil > now,
      lastLoginAt: student.lastLoginAt?.toISOString() ?? null,
    }));
  }

  /** Create students with generated usernames and secrets. Secrets are returned once and stored hashed. */
  async bulkAdd(
    teacher: AuthUser,
    classId: string,
    input: BulkAddStudentsRequest,
  ): Promise<StudentCredential[]> {
    await this.access.ownedClass(teacher, classId);
    const usernames = await this.uniqueUsernames(input.names.length);
    const prepared = await Promise.all(
      input.names.map(async (displayName, i) => {
        const username = usernames[i];
        if (!username) throw new Error('Not enough usernames generated');
        const secret = generateStudentSecret(input.secretKind);
        return { displayName, username, secret, secretHash: await this.passwords.hash(secret) };
      }),
    );

    // One transaction: either every student is created or none are.
    const credentials = await this.db.client.$transaction(async (tx) => {
      const created: StudentCredential[] = [];
      for (const p of prepared) {
        const user = await tx.user.create({
          data: {
            role: 'STUDENT',
            displayName: p.displayName,
            username: p.username,
            studentSecretHash: p.secretHash,
            studentSecretKind: input.secretKind,
            enrollments: { create: { classId } },
          },
        });
        created.push({
          id: user.id,
          displayName: user.displayName,
          username: user.username,
          secretKind: input.secretKind,
          secret: p.secret,
        });
      }
      return created;
    });
    await this.audit.record(teacher.id, 'students.bulk_add', classId, {
      count: credentials.length,
      secretKind: input.secretKind,
    });
    return credentials;
  }

  /** New secret for a student; also unlocks the account and ends their sessions. */
  async resetSecret(
    teacher: AuthUser,
    studentId: string,
    kind?: StudentSecretKind,
  ): Promise<StudentCredential> {
    const student = await this.access.ownedStudent(teacher, studentId);
    const secretKind = kind ?? secretKindOf(student);
    const secret = generateStudentSecret(secretKind);
    await this.db.client.user.update({
      where: { id: studentId },
      data: {
        studentSecretHash: await this.passwords.hash(secret),
        studentSecretKind: secretKind,
        failedLogins: 0,
        lockedUntil: null,
      },
    });
    await this.tokens.revokeAllForUser(studentId);
    await this.audit.record(teacher.id, 'student.reset_secret', studentId, { secretKind });
    return {
      id: student.id,
      displayName: student.displayName,
      username: student.username,
      secretKind,
      secret,
    };
  }

  private countStudents(classId: string): Promise<number> {
    return this.db.client.enrollment.count({ where: { classId, student: { deletedAt: null } } });
  }

  private async uniqueJoinCode(): Promise<string> {
    for (let attempt = 0; attempt < 20; attempt++) {
      const code = generateJoinCode();
      const taken = await this.db.client.class.findUnique({ where: { joinCode: code } });
      if (!taken) return code;
    }
    throw new Error('Could not generate a unique join code');
  }

  private async uniqueUsernames(count: number): Promise<string[]> {
    const chosen = new Set<string>();
    for (let round = 0; round < 20 && chosen.size < count; round++) {
      const candidates = new Set<string>();
      while (candidates.size < (count - chosen.size) * 2) {
        const name = generateUsername();
        if (!chosen.has(name)) candidates.add(name);
      }
      const taken = await this.db.client.user.findMany({
        where: { username: { in: [...candidates] } },
        select: { username: true },
      });
      const takenSet = new Set(taken.map((t) => t.username));
      for (const name of candidates) {
        if (chosen.size < count && !takenSet.has(name)) chosen.add(name);
      }
    }
    if (chosen.size < count) throw new Error('Could not generate unique usernames');
    return [...chosen];
  }
}

function toSummary(klass: Class, studentCount: number): ClassSummary {
  return {
    id: klass.id,
    name: klass.name,
    gradeLevel: klass.gradeLevel,
    joinCode: klass.joinCode,
    timezone: klass.timezone,
    aiFeedbackMode: klass.aiFeedbackMode,
    studentCount,
    createdAt: klass.createdAt.toISOString(),
  };
}
