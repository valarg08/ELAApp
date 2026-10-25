import type { DatabaseService } from '../database/database.service.js';

const DAY = 86_400_000;

export const dayOf = (d: Date) => d.toISOString().slice(0, 10);

/**
 * Days in a row (to today or yesterday) with a daily review handed in. Math reviews are kind
 * "review" (key "review:YYYY-MM-DD"), Mental Math ones "mental-review".
 */
export async function reviewStreak(
  db: DatabaseService,
  studentId: string,
  kind: 'review' | 'mental-review',
): Promise<number> {
  const rows = await db.client.mathTestAttempt.findMany({
    where: { studentId, kind, submittedAt: { not: null } },
    orderBy: { startedAt: 'desc' },
    take: 120,
    select: { testKey: true },
  });
  const days = new Set(rows.map((r) => r.testKey.slice(kind.length + 1)));
  let streak = 0;
  let t = Date.now();
  if (!days.has(dayOf(new Date(t)))) t -= DAY;
  while (days.has(dayOf(new Date(t)))) {
    streak += 1;
    t -= DAY;
  }
  return streak;
}
