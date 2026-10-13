import {
  type Narrator,
  type Perspective,
  type Pov,
  checkPerspectives,
  firstPersonGaps,
  narratorReach,
  perspectiveName,
  pointOfView,
  povShifts,
  sentenceAt,
  sentences,
  splitSections,
} from '@storyforge/writing-analysis';
import { z } from 'zod/v4';
import { QUILL_RULES, writingBlock } from '../prompts.js';
import type { AnalyzerDef, WritingContext } from '../types.js';

/**
 * "Is my point of view steady?" (Unit 5, DESIGN.md §8.4 `pov-consistency`): Quill finds the point of
 * view, every place it slips, whether a third-person narrator stays in one head (limited) or knows
 * everyone's thoughts (omniscient), and, for the multi-perspective rewrite, whether each part keeps
 * its own point of view.
 */
export interface PovConsistencyInput extends WritingContext {
  /** The point of view the piece must use, if the activity locks one. */
  pov: Pov | null;
  /** Third person only: how much the narrator should know. */
  narrator: Narrator | null;
  /** The parts of a multi-perspective rewrite (empty otherwise). */
  perspectives: readonly Perspective[];
}

const POVS = ['first', 'second', 'third'] as const;

export const PovConsistencyResult = z.object({
  detectedPov: z.enum([...POVS, 'mixed', 'unclear']),
  /** 0–1: how sure Quill is. */
  confidence: z.number().min(0).max(1),
  /** Places where the narration slips into another point of view (speech in quotes is fine). */
  shifts: z.array(
    z.object({
      quote: z.string(),
      from: z.enum(POVS),
      to: z.enum(POVS),
      /** One idea, starting "You could try". */
      suggestion: z.string(),
    }),
  ),
  /** Third person with a narrator target: does it stay in one head, or show many? */
  narrator: z
    .object({
      detected: z.enum(['limited', 'omniscient', 'unclear']),
      /** Words showing a character's thoughts that prove it (or break it). */
      quote: z.string().nullable(),
      note: z.string(),
    })
    .nullable(),
  /** One entry per part of a rewrite, in order (empty when there are no parts). */
  parts: z.array(
    z.object({
      label: z.string(),
      keeps: z.boolean(),
      quote: z.string().nullable(),
      note: z.string(),
    }),
  ),
  /** A moment where the point of view works especially well. */
  strongMoment: z.object({ quote: z.string(), why: z.string() }).nullable(),
});
export type PovConsistencyResult = z.infer<typeof PovConsistencyResult>;

const SYSTEM = `${QUILL_RULES}

Task: check the POINT OF VIEW of the student's narration. Speech inside quotation marks may use any person; only the narration counts.
- detectedPov: first (I, me, my), second (you), third (he, she, they, names), mixed (switches without a reason), or unclear.
- confidence: 0 to 1.
- shifts: every place the narration slips out of the required point of view (or out of its main one if none is required). quote = the exact words; from = the point of view it should be in; to = the one it slips into; suggestion = one idea starting "You could try". Empty if there are none.
- narrator: only when a narrator target is given (third person limited = the narrator knows ONE character's thoughts and feelings; omniscient = the narrator knows what several characters think and feel). detected = limited, omniscient or unclear; quote = exact words showing a character's thoughts that prove it or break the target; note = one short sentence for the student. Otherwise null.
- parts: when the piece is a multi-perspective rewrite, one entry per part in the given order. The parts start with their labels on their own lines. keeps = true if that part stays in its point of view (and narrator, if given) and is a real retelling of the event. quote = exact words of a slip, or null. note = one short sentence. Otherwise an empty list.
- strongMoment: one moment where the point of view works especially well (a thought only this narrator could know, a detail seen through their eyes); quote = exact words, why = one sentence of praise. Null if there is none.`;

const NAME: Record<Pov, string> = { first: 'first', second: 'second', third: 'third' };

const sentenceOf = (text: string, pos: number) =>
  sentenceAt(sentences(text), pos)?.text.trim() ?? null;

export const povConsistencyAnalyzer: AnalyzerDef<PovConsistencyInput, PovConsistencyResult> = {
  id: 'pov-consistency',
  version: 'pov-consistency-1',
  effort: 'medium',
  maxTokens: 2000,
  system: SYSTEM,
  schema: PovConsistencyResult,
  buildUser: (input) =>
    [
      `Required point of view: ${input.pov ? `${NAME[input.pov]} person` : '(none)'}`,
      `Narrator target: ${input.narrator ?? '(none)'}`,
      `Parts: ${
        input.perspectives.length > 0
          ? input.perspectives.map((p) => `"${p.label}" = ${perspectiveName(p)}`).join('; ')
          : '(none)'
      }`,
      writingBlock(input),
    ].join('\n'),
  fake(input) {
    const { text } = input;
    if (input.perspectives.length > 0) {
      const sections = splitSections(
        text,
        input.perspectives.map((p) => p.label),
      );
      const checks = checkPerspectives(text, input.perspectives);
      const parts = checks.map((c) => {
        const keeps = c.status === 'ok';
        const quote =
          !keeps && c.span?.text ? (sentenceOf(text, c.span.start) ?? c.span.text) : null;
        const note = {
          ok: `Stays in the ${perspectiveName(c)} all the way through.`,
          missing: `Quill couldn't find this part. Put “${c.label}” on its own line above it.`,
          short:
            'This part is very short. You could try adding a thought or a detail only this narrator would notice.',
          shift: `This part slips out of the ${perspectiveName(c)}.`,
          narrator:
            c.narrator === 'limited'
              ? 'This part shows more than one character’s thoughts. A limited narrator stays in one head.'
              : 'An all-knowing narrator could show what more than one character thinks here.',
        }[c.status];
        return { label: c.label, keeps, quote, note };
      });
      const firstOk = sections.find((s, i) => s.found && checks[i]?.status === 'ok');
      const strong = firstOk ? sentences(firstOk.text)[0]?.text.trim() : undefined;
      return {
        detectedPov: 'mixed',
        confidence: 0.6,
        shifts: [],
        narrator: null,
        parts,
        strongMoment: strong
          ? { quote: strong, why: 'This opening puts the reader right inside this point of view.' }
          : null,
      };
    }

    const pov = pointOfView(text);
    const detectedPov = pov.guess === 'unknown' ? 'unclear' : pov.guess;
    const lock = input.pov ?? (pov.guess === 'unknown' ? null : pov.guess);
    const shifts = lock
      ? povShifts(pov, lock)
          .slice(0, 3)
          .flatMap((s) => {
            const to = POVS.find((p) => pov.spans[p].includes(s));
            if (!to || to === lock) return [];
            return [
              {
                quote: sentenceOf(text, s.start) ?? s.text,
                from: lock,
                to,
                suggestion:
                  lock === 'first'
                    ? 'You could try telling this part through the narrator’s own eyes, with I or me.'
                    : `You could try changing “${s.text}” so the narration stays in the ${lock} person.`,
              },
            ];
          })
      : [];
    if (lock === 'first' && shifts.length === 0) {
      const gap = firstPersonGaps(text)[0];
      if (gap) {
        shifts.push({
          quote: gap.text.trim(),
          from: 'first',
          to: 'third',
          suggestion:
            'You could try checking this part: if it is your narrator, tell it with I and my.',
        });
      }
    }
    let narrator: PovConsistencyResult['narrator'] = null;
    if (input.narrator && (input.pov ?? pov.guess) === 'third') {
      const reach = narratorReach(text);
      const [first, second] = reach.minds;
      const proof = reach.guess === 'omniscient' ? second : first;
      narrator = {
        detected: reach.guess === 'unknown' ? 'unclear' : reach.guess,
        quote: proof ? sentenceOf(text, proof.span.start) : null,
        note:
          reach.guess === input.narrator
            ? input.narrator === 'limited'
              ? 'You stay inside one character’s head, so the reader sees the story through their eyes.'
              : 'Your narrator knows what more than one character thinks.'
            : input.narrator === 'limited'
              ? reach.guess === 'omniscient'
                ? 'You show more than one character’s thoughts. A limited narrator only knows one.'
                : 'You could try showing one thought or feeling of your main character.'
              : 'You could try showing what a second character thinks or feels.',
      };
    }
    const keep = shifts.length === 0 && detectedPov !== 'unclear';
    const firstLine = sentences(text)[0]?.text.trim();
    return {
      detectedPov,
      confidence: pov.guess === 'unknown' ? 0.3 : 0.7,
      shifts,
      narrator,
      parts: [],
      strongMoment:
        keep && firstLine
          ? {
              quote: firstLine,
              why: 'From the first line, the reader knows whose eyes we are looking through.',
            }
          : null,
    };
  },
};
