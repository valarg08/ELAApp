import type { EssayStructureInput } from '@storyforge/ai';
import type { WritingActivity } from '@storyforge/shared';

/** What "Is my essay structured well?" should expect: the kind of essay, an outline or not, a counterclaim. */
export function essayInput(
  activity: WritingActivity,
): Pick<EssayStructureInput, 'essayType' | 'mode' | 'counterclaim'> {
  return {
    essayType: activity.essay?.type ?? 'argumentative',
    mode: activity.type === 'ESSAY_OUTLINE' ? 'outline' : 'essay',
    counterclaim: Boolean(activity.essay?.counterclaim || activity.outlineBuilder?.counterclaim),
  };
}
