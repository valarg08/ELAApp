import { SENSES } from '@storyforge/writing-analysis';
import { z } from 'zod';

/**
 * The personal sensory word bank (DESIGN.md §10, Unit 6): words a student collects in the sensory
 * lab (or adds themselves), grouped by sense, shown beside the editor in every workspace.
 */
export const WORD_BANK_LIMIT = 300;

export const SenseName = z.enum(SENSES);

/** One to three words, letters only (with ' and -), at most 30 characters, stored lowercase. */
export const SensoryWordText = z
  .string()
  .trim()
  .toLowerCase()
  .min(1)
  .max(30)
  .regex(/^\p{L}[\p{L}'’-]*(?: \p{L}[\p{L}'’-]*){0,2}$/u, 'Use one to three words, letters only.');

export const WordBankEntry = z.object({
  id: z.string(),
  sense: SenseName,
  word: z.string(),
});
export type WordBankEntry = z.infer<typeof WordBankEntry>;

export const WordBankResponse = z.object({
  words: z.array(WordBankEntry),
  limit: z.number(),
  /** Words left out by the safety check (after an add). */
  skipped: z.number().default(0),
});
export type WordBankResponse = z.infer<typeof WordBankResponse>;

export const AddWordsRequest = z.object({
  entries: z
    .array(z.object({ sense: SenseName, word: SensoryWordText }))
    .min(1)
    .max(50),
});
export type AddWordsRequest = z.infer<typeof AddWordsRequest>;
