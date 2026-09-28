import { Injectable } from '@nestjs/common';
import { ErrorCode } from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { notFound } from '../common/app-error.js';
import { DatabaseService } from '../database/database.service.js';

/**
 * Ownership checks for teacher routes (DESIGN.md §2.5 "Policies").
 * A teacher only reaches their own classes and the students enrolled in them.
 * Anything else answers 404 so ids cannot be probed.
 */
@Injectable()
export class ClassAccessService {
  constructor(private readonly db: DatabaseService) {}

  async ownedClass(teacher: AuthUser, classId: string, { allowArchived = false } = {}) {
    const klass = await this.db.client.class.findFirst({
      where: {
        id: classId,
        teacherId: teacher.id,
        ...(allowArchived ? {} : { archivedAt: null }),
      },
    });
    if (!klass) throw notFound(ErrorCode.CLASS_NOT_FOUND, 'Class not found.');
    return klass;
  }

  /** The student, if they are enrolled in one of this teacher's active classes. */
  async ownedStudent(teacher: AuthUser, studentId: string) {
    const student = await this.db.client.user.findFirst({
      where: {
        id: studentId,
        role: 'STUDENT',
        deletedAt: null,
        enrollments: { some: { class: { teacherId: teacher.id, archivedAt: null } } },
      },
    });
    if (!student) throw notFound(ErrorCode.STUDENT_NOT_FOUND, 'Student not found.');
    return student;
  }
}
