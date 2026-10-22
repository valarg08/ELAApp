import { Injectable } from '@nestjs/common';
import type { Prisma } from '@storyforge/db';
import { DatabaseService } from '../database/database.service.js';

/** Sensitive actions recorded for accountability (DESIGN.md §13.3). Never include secrets. */
export type AuditAction =
  | 'class.archive'
  | 'students.bulk_add'
  | 'student.reset_secret'
  | 'flag.update'
  | 'feedback.release'
  | 'org.create'
  | 'org.update'
  | 'teacher.assign_org'
  | 'teacher.activate'
  | 'teacher.deactivate'
  | 'content.sync';

@Injectable()
export class AuditService {
  constructor(private readonly db: DatabaseService) {}

  async record(
    actorId: string,
    action: AuditAction,
    target: string,
    meta?: Prisma.InputJsonObject,
  ): Promise<void> {
    await this.db.client.auditLog.create({
      data: { actorId, action, target, ...(meta ? { meta } : {}) },
    });
  }
}
