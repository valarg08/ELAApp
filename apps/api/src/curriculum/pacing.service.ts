import { Injectable } from '@nestjs/common';
import type { ClassUnitPacing, UpdatePacingRequest } from '@storyforge/shared';
import { ErrorCode, classSettings } from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { ClassAccessService } from '../classes/class-access.service.js';
import { notFound } from '../common/app-error.js';
import { DatabaseService } from '../database/database.service.js';
import { unitAvailability } from './curriculum.service.js';

/** Teachers choose which units each class can open, and when they're due (DESIGN.md §11.3). */
@Injectable()
export class PacingService {
  constructor(
    private readonly db: DatabaseService,
    private readonly access: ClassAccessService,
  ) {}

  async list(teacher: AuthUser, classId: string): Promise<ClassUnitPacing[]> {
    const klass = await this.access.ownedClass(teacher, classId);
    const { selfPaced } = classSettings(klass.settings);
    const units = await this.db.client.unit.findMany({
      orderBy: { number: 'asc' },
      include: { classUnits: { where: { classId } }, _count: { select: { lessons: true } } },
    });
    return units.map((unit) => {
      const row = unit.classUnits[0];
      return {
        unitId: unit.id,
        number: unit.number,
        title: unit.title,
        published: unit.published,
        // Self-paced: "available" means students can reach it once earlier units are done.
        available: unitAvailability(unit, row, { selfPaced, previousDone: true }).available,
        hidden: row ? row.hidden : !selfPaced && unit.number !== 1,
        unlockAt: row?.unlockAt?.toISOString() ?? null,
        dueAt: row?.dueAt?.toISOString() ?? null,
        lessonCount: unit._count.lessons,
      };
    });
  }

  async update(
    teacher: AuthUser,
    classId: string,
    unitId: string,
    input: UpdatePacingRequest,
  ): Promise<ClassUnitPacing> {
    const klass = await this.access.ownedClass(teacher, classId);
    const { selfPaced } = classSettings(klass.settings);
    const unit = await this.db.client.unit.findUnique({ where: { id: unitId } });
    if (!unit) throw notFound(ErrorCode.UNIT_NOT_FOUND, 'Unit not found.');

    const data = {
      ...(input.hidden !== undefined ? { hidden: input.hidden } : {}),
      ...(input.unlockAt !== undefined
        ? { unlockAt: input.unlockAt ? new Date(input.unlockAt) : null }
        : {}),
      ...(input.dueAt !== undefined ? { dueAt: input.dueAt ? new Date(input.dueAt) : null } : {}),
    };
    await this.db.client.classUnit.upsert({
      where: { classId_unitId: { classId, unitId } },
      // A new row starts from the class default plus the requested change (self-paced: nothing is
      // hidden, so setting a due date never locks a unit).
      create: { classId, unitId, hidden: !selfPaced && unit.number !== 1, ...data },
      update: data,
    });
    const all = await this.list(teacher, classId);
    const updated = all.find((u) => u.unitId === unitId);
    if (!updated) throw notFound(ErrorCode.UNIT_NOT_FOUND, 'Unit not found.');
    return updated;
  }
}
