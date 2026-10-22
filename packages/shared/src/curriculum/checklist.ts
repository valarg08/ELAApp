import { ESSAY_CHECKS } from '@storyforge/writing-analysis';
import { z } from 'zod';

/**
 * Essay Writing checklists (Unit 14 on, DESIGN.md §9.12): a list to edit a whole essay against.
 * Items with `auto` are ticked by Owlery Academy from the essay analysis as the student writes; the
 * others the student ticks themselves (stored in `Submission.choices.checklist`). It never
 * blocks submitting.
 */
export const ChecklistItem = z.object({
  id: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .max(40),
  text: z.string().trim().min(1).max(160),
  /** Checked automatically (see `essayChecks`). */
  auto: z.enum(ESSAY_CHECKS).optional(),
});
export type ChecklistItem = z.infer<typeof ChecklistItem>;

export const Checklist = z.object({
  label: z.string().trim().min(1).max(120),
  items: z.array(ChecklistItem).min(2).max(16),
});
export type Checklist = z.infer<typeof Checklist>;

/** The ids of the items the student ticked. */
export const ChecklistTicks = z.array(z.string().max(40)).max(16);
export type ChecklistTicks = z.infer<typeof ChecklistTicks>;

/** Ticks that name one of the checklist's own (not automatic) items, once each, in list order. */
export function validTicks(checklist: Checklist | undefined, ticks: readonly string[]): string[] {
  if (!checklist) return [];
  const wanted = new Set(ticks);
  return checklist.items.filter((i) => !i.auto && wanted.has(i.id)).map((i) => i.id);
}
