import type { UnitSummary } from '@storyforge/shared';

/**
 * The unit a student is working on: the first open unit with lessons left (when all are done, the
 * last open one). Mental Math's placement check can open several units at once, so there it is the
 * unit in progress, else the furthest open one.
 */
export function currentUnit(units: readonly UnitSummary[]): UnitSummary | undefined {
  const open = units.filter((u) => u.available);
  const left = open.filter((u) => u.completedLessons < u.lessonCount);
  if (units[0]?.track === 'MENTAL')
    return left.find((u) => u.completedLessons > 0) ?? left.at(-1) ?? open.at(-1);
  return left[0] ?? open.at(-1);
}
