import type { PlotCheckInput } from '@storyforge/ai';
import { type WritingActivity, conflictType, validConflict, validPlot } from '@storyforge/shared';

/** The conflict card and plan for "Does my plot work?", from the student's choices. */
export function plotInput(
  activity: WritingActivity,
  conflict: string | null,
  plot: unknown,
): Pick<PlotCheckInput, 'conflict' | 'plan'> {
  const card = conflictType(validConflict(activity, conflict) ?? '');
  const plan = activity.plotPlanner ? validPlot(activity, plot) : null;
  return {
    conflict: card ? { id: card.id, label: card.label, definition: card.definition } : null,
    plan,
  };
}

/** Cache key part: the same text with a different conflict or plan is a different request. */
export const plotScope = (input: Pick<PlotCheckInput, 'conflict' | 'plan'>) =>
  `${input.conflict?.id ?? '-'}|${input.plan ? Object.values(input.plan).join('|') : '-'}`;
