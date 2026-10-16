import type { EssayStructureInput } from '@storyforge/ai';
import type { WritingActivity } from '@storyforge/shared';

/** What "Is my essay structured well?" should expect: the kind of essay, what is being written, a counterclaim. */
export function essayInput(
  activity: WritingActivity,
): Pick<EssayStructureInput, 'essayType' | 'mode' | 'counterclaim'> {
  return {
    essayType: activity.essay?.type ?? 'argumentative',
    mode:
      activity.type === 'ESSAY_OUTLINE'
        ? 'outline'
        : activity.essay?.part === 'introduction'
          ? 'introduction'
          : 'essay',
    counterclaim: Boolean(activity.essay?.counterclaim || activity.outlineBuilder?.counterclaim),
  };
}
