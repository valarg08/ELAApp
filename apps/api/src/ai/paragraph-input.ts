import type { ParagraphStructureInput } from '@storyforge/ai';
import type { WritingActivity } from '@storyforge/shared';

/** How many paragraphs "Is my paragraph built well?" should expect. */
export function paragraphInput(
  activity: WritingActivity,
): Pick<ParagraphStructureInput, 'paragraphs'> {
  return { paragraphs: activity.constraints.minParagraphs ?? 1 };
}
