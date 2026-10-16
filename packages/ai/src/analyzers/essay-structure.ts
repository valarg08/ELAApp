import { type EssayType, essayNotes, essayStructure } from '@storyforge/writing-analysis';
import { z } from 'zod/v4';
import { QUILL_RULES, writingBlock } from '../prompts.js';
import type { AnalyzerDef, WritingContext } from '../types.js';

/**
 * "Is my essay structured well?" (Essay Writing Units 11–15, DESIGN.md §9.12): Quill checks the
 * hook, the thesis (or a narrative's focus), whether each body paragraph supports it, the
 * counterclaim and rebuttal, and the conclusion, in an essay or in an outline.
 */
export interface EssayStructureInput extends WritingContext {
  essayType: EssayType;
  /** An outline (labelled lines), a full essay, or one part of an essay (Unit 12 introductions, Unit 13 body paragraphs). */
  mode: 'essay' | 'outline' | 'introduction' | 'body';
  /** Body paragraph tasks: the essay's thesis, given by the task. */
  thesis?: string | null;
  /** The task asks for a counterclaim and rebuttal. */
  counterclaim: boolean;
}

const THESIS_KINDS = [
  'claim',
  'focus',
  'opinion',
  'fact',
  'announcement',
  'question',
  'none',
] as const;

export const EssayStructureResult = z.object({
  thesis: z.object({
    present: z.boolean(),
    kind: z.enum(THESIS_KINDS),
    quote: z.string().nullable(),
    note: z.string(),
  }),
  hook: z.object({ quote: z.string().nullable(), works: z.boolean(), note: z.string() }),
  /** The introduction's sentences between the hook and the thesis. */
  background: z.object({ present: z.boolean(), quote: z.string().nullable(), note: z.string() }),
  /** Each body paragraph (or body point), in order: does it support the thesis? */
  bodies: z.array(z.object({ quote: z.string(), supportsThesis: z.boolean(), note: z.string() })),
  counterclaim: z.object({
    present: z.boolean(),
    rebutted: z.boolean(),
    quote: z.string().nullable(),
    note: z.string(),
  }),
  conclusion: z.object({
    present: z.boolean(),
    restates: z.boolean(),
    finalThought: z.boolean(),
    quote: z.string().nullable(),
    note: z.string(),
  }),
  /** One idea to make the essay stronger, starting "You could try". */
  nextIdea: z.string().nullable(),
});
export type EssayStructureResult = z.infer<typeof EssayStructureResult>;

const SYSTEM = `${QUILL_RULES}

Task: check how the student's ESSAY (or essay OUTLINE) is structured, like a kind English teacher. You are told the kind of essay (argumentative, informative or narrative), whether it is an outline (labelled lines like "Thesis: …", "Body 1: …") or a full essay, and whether the task asks for a counterclaim.
- thesis: the one sentence the essay proves (argumentative: a claim someone could disagree with, with reasons), explains (informative: the topic and its parts) or shows (narrative: the focus, what the experience taught or changed). kind = claim, focus, opinion (personal taste only), fact (nothing to prove), announcement ("In this essay I will…"), question, or none. present = it is a real claim or focus. quote = exact words or null. note = one sentence.
- hook: the first sentence. works = it grabs the reader (a question, a surprising fact, a quote, a short story, a bold statement), not an announcement or a plain fact. quote = exact words or null. note = one sentence.
- background: the introduction's sentences between the hook and the thesis that tell the reader what they need to know (the situation, a definition, the problem). present = there is at least one; quote = the first, exact words, or null; note = one sentence. Outlines have no background: present = false, note says it comes when writing.
- bodies: each body paragraph (or "Body n" line) in order, up to 4. quote = its topic sentence, exact words. supportsThesis = it proves or explains part of the thesis (narrative: it moves the story toward the focus). note = one short sentence.
- counterclaim: present = the essay gives the other side; rebutted = it then answers it. quote = the counterclaim's exact words or null. note = one sentence (if the task asks for one and it is missing, say how to add it; if not asked for, say it is optional).
- conclusion: present = there is a conclusion; restates = it restates the thesis in new words (not copied); finalThought = it ends with a call to act, a look ahead, a question or (narrative) a reflection. quote = exact words of its first sentence or null. note = one sentence.
- nextIdea: one idea to make the structure stronger, starting "You could try", or null.
If this is just an INTRODUCTION, judge the hook, background and thesis only (a strong introduction ends with its thesis): bodies = [], counterclaim and conclusion present = false with the note "Not part of this task.".
If these are just BODY PARAGRAPHS, you are given the essay's thesis: thesis present = true with that thesis as quote; hook and background "Not part of this task." (works and present = false); conclusion present = false with the note "Not part of this task."; judge each body paragraph's topic sentence, evidence (a fact, example or quote; narrative: details and time words that show the order of events) and how it explains the evidence, in its note; and the counterclaim and rebuttal.
Judge structure only, not grammar or spelling. Outlines are notes: do not expect full paragraphs or a final thought there.`;

export const essayStructureAnalyzer: AnalyzerDef<EssayStructureInput, EssayStructureResult> = {
  id: 'essay-structure',
  version: 'essay-structure-3',
  effort: 'medium',
  maxTokens: 1800,
  system: SYSTEM,
  schema: EssayStructureResult,
  buildUser: (input) =>
    [
      `Kind of essay: ${input.essayType}`,
      `This is: ${input.mode === 'outline' ? 'an outline' : input.mode === 'introduction' ? 'just an introduction' : input.mode === 'body' ? 'just body paragraphs' : 'a full essay'}`,
      ...(input.mode === 'body' && input.thesis ? [`The essay's thesis: ${input.thesis}`] : []),
      `Counterclaim asked for: ${input.counterclaim ? 'yes' : 'no'}`,
      writingBlock(input),
    ].join('\n'),
  fake(input) {
    const options = {
      type: input.essayType,
      counterclaim: input.counterclaim,
      ...(input.mode === 'introduction' || input.mode === 'body' ? { part: input.mode } : {}),
      ...(input.thesis ? { thesis: input.thesis } : {}),
    };
    const introOnly = input.mode === 'introduction';
    const bodyOnly = input.mode === 'body';
    const e = essayStructure(input.text, options);
    const notes = essayNotes(input.text, options);
    const narrative = input.essayType === 'narrative';
    const intro = e.paragraphs.find((p) => p.part === 'introduction');
    const background = intro?.background?.[0];
    const bodies = introOnly
      ? []
      : e.paragraphs.filter((p) => p.part === 'body' && !p.counterclaim);
    const counter = e.paragraphs.find((p) => p.counterclaim);
    const conclusion = e.paragraphs.find((p) => p.part === 'conclusion');
    const thesisOk = e.thesis && (e.thesis.kind === 'claim' || e.thesis.kind === 'focus');
    const weak = notes.find((n) => n.kind === 'weak-thesis');
    const hookOk = intro?.hook && intro.hook.kind !== 'plain' && intro.hook.kind !== 'announcement';
    const notPart = 'Not part of this task.';
    if (bodyOnly) {
      return {
        thesis: { present: true, kind: 'claim', quote: input.thesis ?? null, note: notPart },
        hook: { quote: null, works: false, note: notPart },
        background: { present: false, quote: null, note: notPart },
        bodies: bodies.slice(0, 4).map((p) => ({
          quote: p.topic?.span.text ?? p.span.text,
          supportsThesis: p.topic?.linked !== false || narrative,
          note: narrative
            ? p.timeWords?.length
              ? 'Your time words show the order of events.'
              : 'Add time words (First, Then, Finally) to show the order of events.'
            : p.evidence
              ? 'Your evidence backs up your topic sentence; explain what it shows.'
              : 'Add evidence: a fact, an example or a quote that proves your topic sentence.',
        })),
        counterclaim: counter
          ? {
              present: true,
              rebutted: counter.rebuttal !== undefined,
              quote: counter.counterclaim?.text ?? null,
              note: counter.rebuttal
                ? 'You give the other side and answer it.'
                : 'Answer the other side with a rebuttal that starts “However, …”.',
            }
          : {
              present: false,
              rebutted: false,
              quote: null,
              note: input.counterclaim
                ? 'Add what the other side says (Some people argue…) and your answer (However, …).'
                : 'A counterclaim is optional here.',
            },
        conclusion: {
          present: false,
          restates: false,
          finalThought: false,
          quote: null,
          note: notPart,
        },
        nextIdea: narrative
          ? null
          : 'You could try adding a sentence that explains how your evidence proves your point.',
      };
    }
    return {
      thesis: {
        present: Boolean(thesisOk) || (narrative && e.thesis !== undefined),
        kind: e.thesis?.kind ?? 'none',
        quote: e.thesis?.span.text ?? null,
        note: weak
          ? weak.message
          : e.thesis
            ? `Your ${narrative ? 'focus' : 'thesis'} tells the reader what your essay is about.`
            : `Add a ${narrative ? 'focus' : 'thesis'}: one sentence your essay will ${narrative ? 'show' : 'prove or explain'}.`,
      },
      hook: {
        quote: intro?.hook?.span.text ?? null,
        works: Boolean(hookOk),
        note: hookOk
          ? 'Your opening makes the reader want to keep going.'
          : 'Open with a question, a surprising fact, a quote or a short story.',
      },
      background: background
        ? {
            present: true,
            quote: background.text,
            note: 'Your background gives the reader what they need before your thesis.',
          }
        : {
            present: false,
            quote: null,
            note: e.outline
              ? 'Background comes when you write the introduction.'
              : 'Add a sentence or two between your hook and thesis that tells the reader what they need to know.',
          },
      bodies: bodies.slice(0, 4).map((p) => ({
        quote: p.topic?.span.text ?? p.span.text,
        supportsThesis: p.topic?.linked !== false || narrative,
        note:
          p.topic?.linked === false && !narrative
            ? 'Use a key word from your thesis so the reader sees how this point proves it.'
            : 'This point supports your thesis.',
      })),
      counterclaim:
        counter && !introOnly
          ? {
              present: true,
              rebutted: counter.rebuttal !== undefined,
              quote: counter.counterclaim?.text ?? null,
              note: counter.rebuttal
                ? 'You give the other side and answer it.'
                : 'Answer the other side with a rebuttal that starts “However, …”.',
            }
          : {
              present: false,
              rebutted: false,
              quote: null,
              note: introOnly
                ? 'Not part of this task.'
                : input.counterclaim
                  ? 'Add what the other side says (Some people argue…) and your answer (However, …).'
                  : 'A counterclaim is optional here.',
            },
      conclusion:
        conclusion && !introOnly
          ? {
              present: true,
              restates: conclusion.echoesThesis === true && !conclusion.copiesThesis,
              finalThought: e.outline || conclusion.finalThought !== undefined,
              quote: conclusion.span.text.split(/(?<=[.!?])\s/)[0] ?? null,
              note: conclusion.copiesThesis
                ? 'Restate your thesis in new words instead of copying it.'
                : 'Your conclusion brings the reader back to your main point.',
            }
          : {
              present: false,
              restates: false,
              finalThought: false,
              quote: null,
              note: introOnly
                ? 'Not part of this task.'
                : 'Add a conclusion that restates your thesis and leaves a final thought.',
            },
      nextIdea:
        !introOnly && bodies.length < 3 && !narrative
          ? 'You could try adding another body point with its own evidence.'
          : null,
    };
  },
};
