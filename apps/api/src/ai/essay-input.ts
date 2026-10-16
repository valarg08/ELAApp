import type { EssayStructureInput } from '@storyforge/ai';
import type { WritingActivity } from '@storyforge/shared';

/** What "Is my essay structured well?" should expect: the kind of essay, what is being written, a counterclaim, the given thesis. */
export function essayInput(
  activity: WritingActivity,
): Pick<EssayStructureInput, 'essayType' | 'mode' | 'counterclaim' | 'thesis'> {
  return {
    essayType: activity.essay?.type ?? 'argumentative',
    mode:
      activity.type === 'ESSAY_OUTLINE'
        ? 'outline'
        : activity.essay?.part === 'introduction' || activity.essay?.part === 'body'
          ? activity.essay.part
          : 'essay',
    counterclaim: Boolean(activity.essay?.counterclaim || activity.outlineBuilder?.counterclaim),
    thesis: activity.essay?.thesis ?? null,
  };
}
