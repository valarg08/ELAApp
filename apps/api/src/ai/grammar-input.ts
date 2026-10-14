import type { GrammarCheckInput } from '@storyforge/ai';
import type { WritingActivity } from '@storyforge/shared';

/** The grammar focus and sentence tasks for "Is my grammar right?". */
export function grammarInput(
  activity: WritingActivity,
): Pick<GrammarCheckInput, 'focus' | 'tasks'> {
  return {
    focus: activity.grammarFocus ?? [],
    tasks: activity.sentenceSet?.sentences ?? [],
  };
}
