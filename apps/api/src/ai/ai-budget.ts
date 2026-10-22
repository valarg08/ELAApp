import type { PrismaClient } from '@storyforge/db';
import { estimateCostCents } from '@storyforge/shared';

/** Midnight UTC today: AI budgets and the admin's "today" figures use UTC days. */
export function startOfUtcDay(now = new Date()): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

/** Estimated AI spend (US cents) today, summed over each school's classes. */
export async function orgSpendTodayCents(
  db: PrismaClient,
  orgIds: string[],
): Promise<Map<string, number>> {
  const spend = new Map(orgIds.map((id) => [id, 0]));
  if (orgIds.length === 0) return spend;
  const classes = await db.class.findMany({
    where: { orgId: { in: orgIds } },
    select: { id: true, orgId: true },
  });
  const orgOf = new Map(classes.map((c) => [c.id, c.orgId!]));
  const rows = await db.aiUsage.groupBy({
    by: ['classId', 'model'],
    where: { classId: { in: [...orgOf.keys()] }, createdAt: { gte: startOfUtcDay() } },
    _sum: { inputTokens: true, outputTokens: true, cacheReadTokens: true },
  });
  for (const r of rows) {
    const org = orgOf.get(r.classId!)!;
    const cost = estimateCostCents(r.model, {
      inputTokens: r._sum.inputTokens ?? 0,
      outputTokens: r._sum.outputTokens ?? 0,
      cacheReadTokens: r._sum.cacheReadTokens ?? 0,
    });
    spend.set(org, spend.get(org)! + cost);
  }
  return spend;
}
