import { Injectable } from '@nestjs/common';
import type { Prisma } from '@storyforge/db';
import {
  type SatSchedule,
  type SetSatScheduleRequest,
  classSettings,
  isSatDate,
  satToday,
  satWeekOpens,
} from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { ClassAccessService } from '../classes/class-access.service.js';
import { DatabaseService } from '../database/database.service.js';
import { SatContentService } from './sat-content.service.js';

/**
 * A class's SAT schedule (sat-design.md §3): week 1 opens on the start date the teacher sets and
 * each next week 7 days later, by the class's time zone. Kept in the class's settings; a class
 * without a start date has every week open. Another teacher's class answers 404.
 */
@Injectable()
export class SatScheduleService {
  constructor(
    private readonly db: DatabaseService,
    private readonly access: ClassAccessService,
    private readonly content: SatContentService,
  ) {}

  async get(teacher: AuthUser, classId: string): Promise<SatSchedule> {
    const klass = await this.access.ownedClass(teacher, classId);
    const saved = (classSettings(klass.settings) as Record<string, unknown>).satStartDate;
    const startDate = typeof saved === 'string' && isSatDate(saved) ? saved : null;
    const weeks = (await this.content.weeks()).toSorted((a, b) => a.week - b.week);
    return {
      startDate,
      timezone: klass.timezone,
      today: satToday(klass.timezone),
      weeks: weeks.map((w) => ({
        week: w.week,
        title: w.title,
        opens: startDate ? satWeekOpens(startDate, w.week) : null,
      })),
    };
  }

  async set(teacher: AuthUser, classId: string, body: SetSatScheduleRequest): Promise<SatSchedule> {
    const klass = await this.access.ownedClass(teacher, classId);
    const settings = JSON.parse(
      JSON.stringify({ ...classSettings(klass.settings), satStartDate: body.startDate }),
    ) as Prisma.InputJsonValue;
    await this.db.client.class.update({ where: { id: classId }, data: { settings } });
    return this.get(teacher, classId);
  }
}
