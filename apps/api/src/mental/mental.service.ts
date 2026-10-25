import { Injectable } from '@nestjs/common';
import {
  ErrorCode,
  type FactSheetView,
  MathFactsFile,
  MathSkillsFile,
  type MentalHome,
  MentalLevelsFile,
} from '@storyforge/shared';
import type { z } from 'zod';
import type { AuthUser } from '../auth/auth.types.js';
import { forbidden, notFound } from '../common/app-error.js';
import { DatabaseService } from '../database/database.service.js';

/**
 * The Mental Math track (mental-math-design.md): its home (levels, cheat sheets, pattern tips) and
 * the cheat sheets, from the "mental:" rows of MathContent. Lessons, practice and problem sets run
 * on the Math engine.
 */
@Injectable()
export class MentalService {
  constructor(private readonly db: DatabaseService) {}

  private async content<S extends z.ZodType>(key: string, schema: S): Promise<z.infer<S> | null> {
    const row = await this.db.client.mathContent.findUnique({ where: { key } });
    const parsed = row ? schema.safeParse(row.data) : null;
    return parsed?.success ? parsed.data : null;
  }

  async home(user: AuthUser): Promise<MentalHome> {
    if (user.role !== 'STUDENT') throw forbidden('This is for students.');
    const [levels, units, sheets] = await Promise.all([
      this.content('mental:levels', MentalLevelsFile),
      this.db.client.unit.findMany({
        where: { track: 'MENTAL', published: true },
        orderBy: { number: 'asc' },
        select: { number: true, title: true, tips: true },
      }),
      this.db.client.mathContent.findMany({
        where: { key: { startsWith: 'mental:facts:' } },
        select: { key: true },
      }),
    ]);
    if (!levels) throw notFound(ErrorCode.NOT_FOUND, 'Mental Math is not set up yet.');
    const withSheet = new Set(sheets.map((r) => Number(r.key.slice('mental:facts:'.length))));
    return {
      levels,
      cheatSheets: units
        .filter((u) => withSheet.has(u.number))
        .map((u) => ({ unitNumber: u.number, unitTitle: u.title })),
      tips: units.flatMap((u) =>
        (Array.isArray(u.tips) ? u.tips : [])
          .filter((t): t is string => typeof t === 'string')
          .map((tip) => ({ unitNumber: u.number, tip })),
      ),
    };
  }

  /** A unit's cheat sheet (teachers may see unpublished ones, like the Math fact sheets). */
  async cheatSheet(user: AuthUser, unitNumber: number): Promise<FactSheetView> {
    const unit = await this.db.client.unit.findFirst({
      where: { track: 'MENTAL', number: unitNumber },
    });
    const sheet =
      unit && (user.role !== 'STUDENT' || unit.published)
        ? await this.content(`mental:facts:${unitNumber}`, MathFactsFile)
        : null;
    if (!unit || !sheet) throw notFound(ErrorCode.NOT_FOUND, 'Cheat sheet not found.');
    const skills = (await this.content('mental:skills', MathSkillsFile)) ?? [];
    return {
      unitNumber,
      unitSlug: unit.slug,
      unitTitle: unit.title,
      sheet,
      skillLabels: Object.fromEntries(skills.map((s) => [s.id, s.label])),
    };
  }
}
