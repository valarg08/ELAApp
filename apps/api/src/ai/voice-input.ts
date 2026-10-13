import type { PovConsistencyInput, ToneStyleInput } from '@storyforge/ai';
import { type WritingActivity, validTone } from '@storyforge/shared';

/** The point-of-view targets for "Is my point of view steady?", from the activity's rules. */
export function povInput(
  activity: WritingActivity,
): Pick<PovConsistencyInput, 'pov' | 'narrator' | 'perspectives'> {
  const c = activity.constraints;
  return {
    pov: c.povLock ?? null,
    narrator: c.narrator ?? null,
    perspectives: c.perspectives ?? [],
  };
}

/** The tone aimed for, for "What tone will my reader hear?" (only the activity's scales). */
export function toneInput(activity: WritingActivity, tone: unknown): Pick<ToneStyleInput, 'aimed'> {
  return { aimed: validTone(activity, tone) };
}

/** Cache key part: the same text aimed at a different tone is a different request. */
export const toneScope = (input: Pick<ToneStyleInput, 'aimed'>) =>
  Object.entries(input.aimed)
    .map(([axis, step]) => `${axis}${step}`)
    .join(',') || '-';
