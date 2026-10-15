import { paragraphNotes, paragraphRoles } from '@storyforge/writing-analysis';
import { z } from 'zod/v4';
import { QUILL_RULES, writingBlock } from '../prompts.js';
import type { AnalyzerDef, WritingContext } from '../types.js';

/**
 * "Is my paragraph built well?" (Essay Writing, DESIGN.md §9.12): Quill checks the topic sentence,
 * each piece of evidence and its explanation, the transitions and the closing sentence.
 */
export interface ParagraphStructureInput extends WritingContext {
  /** How many paragraphs the task asks for (1 or 2). */
  paragraphs: number;
}

export const ParagraphStructureResult = z.object({
  topic: z.object({ present: z.boolean(), quote: z.string().nullable(), note: z.string() }),
  /** Each piece of evidence, and whether it is explained. */
  evidence: z.array(z.object({ quote: z.string(), explained: z.boolean(), note: z.string() })),
  transitions: z.object({ quotes: z.array(z.string()), note: z.string() }),
  closing: z.object({ present: z.boolean(), quote: z.string().nullable(), note: z.string() }),
  /** Whether every sentence supports the topic sentence; the first that wanders, if any. */
  unity: z.object({ focused: z.boolean(), quote: z.string().nullable(), note: z.string() }),
  /** One idea to make the paragraph stronger, starting "You could try". */
  nextIdea: z.string().nullable(),
});
export type ParagraphStructureResult = z.infer<typeof ParagraphStructureResult>;

const SYSTEM = `${QUILL_RULES}

Task: check how the student's essay PARAGRAPH is built, like a kind English teacher. A strong paragraph has a topic sentence (the main idea), evidence (facts, examples or quotes) each followed by an explanation of what it shows, transitions that link the ideas, and a closing sentence that sums up the idea in new words.
- topic: present = the first sentence states one clear main idea. quote = the exact topic sentence, or null. note = one sentence: what works, or how to state the main idea.
- evidence: up to 3 pieces of evidence, in order. quote = exact words; explained = the next sentence(s) say what it shows and how it supports the main idea; note = one short sentence. Empty if there is no evidence.
- transitions: quotes = up to 3 exact transition words or phrases used (First, In addition, For example, As a result…). note = one sentence.
- closing: present = the last sentence sums up the main idea (not a new point and not just a copy of the topic sentence). quote = exact words, or null. note = one sentence.
- unity: focused = every sentence supports the topic sentence. quote = the first sentence that wanders off topic, or null. note = one sentence.
- nextIdea: one idea to make the paragraph stronger, starting "You could try", or null.
If there are two paragraphs, judge each the same way and report the weaker one's problems first.`;

export const paragraphStructureAnalyzer: AnalyzerDef<
  ParagraphStructureInput,
  ParagraphStructureResult
> = {
  id: 'paragraph-structure',
  version: 'paragraph-structure-1',
  effort: 'medium',
  maxTokens: 1500,
  system: SYSTEM,
  schema: ParagraphStructureResult,
  buildUser: (input) =>
    [`Paragraphs asked for: ${input.paragraphs}`, writingBlock(input)].join('\n'),
  fake(input) {
    const roles = paragraphRoles(input.text);
    const notes = paragraphNotes(input.text);
    const topic = roles.find((s) => s.role === 'topic');
    const closing = roles.findLast((s) => s.role === 'closing');
    const evidence = roles.filter((s) => s.role === 'evidence').slice(0, 3);
    const unexplained = new Set(
      notes.filter((n) => n.kind === 'unexplained-evidence').map((n) => n.span.start),
    );
    const transitions = roles.flatMap((s) => (s.transition ? [s.transition.text] : []));
    return {
      topic: topic
        ? {
            present: true,
            quote: topic.span.text,
            note: 'Your first sentence states your main idea.',
          }
        : {
            present: false,
            quote: null,
            note: 'Start with one sentence that says your main idea.',
          },
      evidence: evidence.map((e) => ({
        quote: e.span.text,
        explained: !unexplained.has(e.span.start),
        note: unexplained.has(e.span.start)
          ? 'Add a sentence that says what this evidence shows (This shows that…).'
          : 'You explain what this evidence shows.',
      })),
      transitions: {
        quotes: transitions.slice(0, 3),
        note:
          transitions.length > 0
            ? 'Your transitions help the reader follow your ideas.'
            : 'Link your sentences with transitions like First, In addition or As a result.',
      },
      closing: closing
        ? { present: true, quote: closing.span.text, note: 'Your last sentence wraps up the idea.' }
        : {
            present: false,
            quote: null,
            note: 'End with a sentence that sums up your main idea in new words.',
          },
      unity: { focused: true, quote: null, note: 'Your sentences stay on your main idea.' },
      nextIdea:
        evidence.length < 2
          ? 'You could try adding a second piece of evidence, like a fact or an example from your own life.'
          : null,
    };
  },
};
