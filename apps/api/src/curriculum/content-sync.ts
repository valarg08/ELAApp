import type { Prisma, PrismaClient } from '@storyforge/db';
import { isWritingActivity } from '@storyforge/shared';
import type { LoadResult, LoadedUnit } from './content-loader.js';

/** Plain JSON copy for a Prisma Json column (drops undefined fields). */
function toJson(value: unknown): Prisma.InputJsonValue {
  const json: Prisma.InputJsonValue = JSON.parse(JSON.stringify(value));
  return json;
}

export interface SyncReport {
  units: number;
  lessons: number;
  activities: number;
  /** Lessons/activities in the database that no longer exist in /content (kept, not deleted). */
  orphans: string[];
}

/**
 * Upsert validated content into the database: units by (track, number), lessons by (unit, slug),
 * activities by key. Nothing is deleted, because student progress and submissions may point at it;
 * items missing from /content are reported as orphans instead.
 */
export async function syncContent(
  db: PrismaClient,
  units: LoadedUnit[],
  math?: LoadResult['math'],
): Promise<SyncReport> {
  const report: SyncReport = { units: 0, lessons: 0, activities: 0, orphans: [] };

  for (const { track, unit, lessons, activities, contentHash } of units) {
    await db.$transaction(async (tx) => {
      const unitData = {
        slug: unit.slug,
        title: unit.title,
        summary: unit.summary,
        bigIdeas: unit.bigIdeas,
        published: unit.published,
        contentHash,
        projectSpec: unit.projectSpec ?? undefined,
      };
      const dbUnit = await tx.unit.upsert({
        where: { track_number: { track, number: unit.number } },
        create: { track, number: unit.number, ...unitData },
        update: unitData,
      });
      report.units += 1;

      const lessonIds = new Map<string, string>();
      for (const lesson of lessons) {
        const data = {
          order: lesson.order,
          title: lesson.title,
          estMinutes: lesson.estMinutes,
          steps: toJson(lesson.steps),
        };
        const row = await tx.lesson.upsert({
          where: { unitId_slug: { unitId: dbUnit.id, slug: lesson.slug } },
          create: { unitId: dbUnit.id, slug: lesson.slug, ...data },
          update: data,
        });
        lessonIds.set(lesson.slug, row.id);
        report.lessons += 1;
      }

      // Link each activity to the lesson that uses it (practice or challenge).
      const lessonOf = new Map<string, string>();
      for (const lesson of lessons) {
        const [, , practice, challenge] = lesson.steps;
        for (const key of [...practice.activityKeys, challenge.activityKey]) {
          const lessonId = lessonIds.get(lesson.slug);
          if (lessonId && !lessonOf.has(key)) lessonOf.set(key, lessonId);
        }
      }

      for (const activity of activities) {
        const data = {
          unitId: dbUnit.id,
          lessonId: lessonOf.get(activity.key) ?? null,
          type: activity.type,
          title: activity.title,
          prompt: isWritingActivity(activity) ? activity.prompt : activity.title,
          config: toJson(activity),
          xpReward: activity.xpReward ?? (isWritingActivity(activity) ? 30 : 10),
          isProject: false,
        };
        await tx.activity.upsert({
          where: { key: activity.key },
          create: { key: activity.key, ...data },
          update: data,
        });
        report.activities += 1;
      }

      const staleLessons = await tx.lesson.findMany({
        where: { unitId: dbUnit.id, slug: { notIn: lessons.map((l) => l.slug) } },
        select: { slug: true },
      });
      const staleActivities = await tx.activity.findMany({
        where: { unitId: dbUnit.id, key: { notIn: activities.map((a) => a.key) } },
        select: { key: true },
      });
      report.orphans.push(
        ...staleLessons.map(
          (l) =>
            `${track === 'STORY' ? '' : `${track.toLowerCase()} `}unit ${unit.number} lesson "${l.slug}"`,
        ),
        ...staleActivities.map((a) => `activity "${a.key}"`),
      );
    });
  }
  if (math) await syncMathContent(db, math);
  return report;
}

/** Math-wide content into MathContent, one row per file (math-design.md §3). */
async function syncMathContent(db: PrismaClient, math: NonNullable<LoadResult['math']>) {
  const rows: [string, unknown][] = [
    ['skills', math.skills],
    ...(math.stages ? [['stages', math.stages] as [string, unknown]] : []),
    ...math.tests.map((t): [string, unknown] => [`test:${t.key}`, t]),
    ...Object.entries(math.facts).map(([n, f]): [string, unknown] => [`facts:${n}`, f]),
  ];
  await db.$transaction(
    rows.map(([key, value]) =>
      db.mathContent.upsert({
        where: { key },
        create: { key, data: toJson(value), contentHash: math.contentHash },
        update: { data: toJson(value), contentHash: math.contentHash },
      }),
    ),
  );
}
