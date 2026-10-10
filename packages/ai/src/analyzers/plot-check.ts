import { pacing, sentences } from '@storyforge/writing-analysis';
import { z } from 'zod/v4';
import { QUILL_RULES, writingBlock } from '../prompts.js';
import type { AnalyzerDef, WritingContext } from '../types.js';

/**
 * "Does my plot work?" (Unit 4, DESIGN.md §10): Quill checks the conflict (against the card the
 * student chose), which story mountain stages are there, the climax and the ending, and whether the
 * story follows the student's plan.
 */
export const PLOT_STAGES = ['exposition', 'rising', 'climax', 'falling', 'resolution'] as const;
export type PlotStage = (typeof PLOT_STAGES)[number];
export const PLOT_STAGE_LABELS: Record<PlotStage, string> = {
  exposition: 'beginning',
  rising: 'rising action',
  climax: 'climax',
  falling: 'falling action',
  resolution: 'resolution',
};

export interface PlotCheckInput extends WritingContext {
  /** The conflict card the student chose, if any. */
  conflict: { id: string; label: string; definition: string } | null;
  /** The student's story mountain plan (stage → one line), if they made one. */
  plan: Partial<Record<PlotStage, string>> | null;
}

export const PlotCheckResult = z.object({
  conflict: z.object({
    /** Can a reader tell what the main problem is? */
    clear: z.boolean(),
    /** Does it fit the chosen conflict type? null when none was chosen. */
    matchesChosen: z.boolean().nullable(),
    quote: z.string().nullable(),
    /** When unclear or not matching: one idea, starting "You could try". */
    idea: z.string().nullable(),
  }),
  stages: z.array(
    z.object({ stage: z.enum(PLOT_STAGES), present: z.boolean(), quote: z.string().nullable() }),
  ),
  climax: z.object({ clear: z.boolean(), quote: z.string().nullable() }),
  ending: z.object({
    resolved: z.boolean(),
    quote: z.string().nullable(),
    idea: z.string().nullable(),
  }),
  /** Does the story follow the plan? null when there is no plan. */
  planFollowed: z.boolean().nullable(),
});
export type PlotCheckResult = z.infer<typeof PlotCheckResult>;

const SYSTEM = `${QUILL_RULES}

Task: check the PLOT of the student's story using the story mountain: beginning (exposition) → rising action → climax → falling action → resolution.
- conflict: clear = true if a reader can tell what the main problem or struggle is. matchesChosen = whether it fits the chosen conflict type (null if none was chosen). quote = the exact words where the conflict shows best, or null. idea = if unclear or not matching, one short idea starting "You could try" (else null).
- stages: one entry for each of the five stages, in order. present = true if the story has that part (short stories may keep some parts very brief). quote = a short exact quote from that part, or null.
- climax: clear = true if there is one biggest, most intense moment where the character faces the problem. quote = exact words from it, or null.
- ending: resolved = true if the problem is settled or the character has clearly changed by the end. quote = exact words from the ending, or null. idea = if not resolved, one idea starting "You could try" (else null).
- planFollowed: if a plan is given, true if the story mostly follows it (changes that improve it are fine); null if there is no plan.`;

const CONFLICT_MARKERS =
  /\b(but|couldn't|can't|wouldn't|refused|against|problem|had to|trapped|lost|stuck|until|before|only one)\b/i;
const RESOLVED =
  /\b(finally|at last|from then on|home|safe|smiled|laughed|learned|learnt|realised|realized|never again|together|ever since|the end|for the first time)\b/i;
const CONFLICT_WORDS: Record<string, RegExp> = {
  'person-vs-nature':
    /\b(storm|river|snow|wind|flood|wave|sea|animal|wolf|bear|cliff|cold|forest|mountain|fire|rain|ice)\b/i,
  'person-vs-technology':
    /\b(robot|phone|computer|screen|machine|app|game|code|device|ai|drone|wifi|battery)\b/i,
  'person-vs-supernatural':
    /\b(ghost|magic|spell|mirror|haunted|cursed|spirit|witch|portal|vanished|appeared)\b/i,
  'person-vs-society':
    /\b(rule|law|ban|banned|sign|everyone|town|council|allowed|unfair|protest|petition)\b/i,
  'person-vs-self':
    /\b(afraid|doubt|scared|nervous|choice|decide|guilty|truth|courage|myself|himself|herself)\b/i,
  'person-vs-person':
    /\b(rival|bully|brother|sister|enemy|argued|fight|against|won|lost|shouted at)\b/i,
};

const sentenceWith = (text: string, re: RegExp) =>
  sentences(text)
    .find((s) => re.test(s.text))
    ?.text.trim() ?? null;

export const plotCheckAnalyzer: AnalyzerDef<PlotCheckInput, PlotCheckResult> = {
  id: 'plot-check',
  version: 'plot-check-1',
  effort: 'medium',
  maxTokens: 2500,
  system: SYSTEM,
  schema: PlotCheckResult,
  buildUser(input) {
    const lines = [
      input.conflict
        ? `Chosen conflict: ${input.conflict.label} (${input.conflict.definition})`
        : 'Chosen conflict: (none)',
    ];
    const plan = input.plan
      ? PLOT_STAGES.filter((s) => input.plan?.[s]).map(
          (s) => `- ${PLOT_STAGE_LABELS[s]}: ${input.plan?.[s]}`,
        )
      : [];
    lines.push(
      plan.length > 0 ? `The student's plan:\n${plan.join('\n')}` : "The student's plan: (none)",
    );
    return [...lines, writingBlock(input)].join('\n');
  },
  fake(input) {
    const p = pacing(input.text);
    const all = sentences(input.text);
    const peakIndex = p.peak ? p.segments.indexOf(p.peak) : -1;
    const conflictQuote = sentenceWith(input.text, CONFLICT_MARKERS);
    const words = input.conflict ? CONFLICT_WORDS[input.conflict.id] : undefined;
    const matches = input.conflict ? (words ? words.test(input.text) : true) : null;
    const last = all.at(-1)?.text.trim() ?? null;
    const resolved =
      last !== null && (RESOLVED.test(last) || RESOLVED.test(all.at(-2)?.text ?? ''));
    const climaxQuote =
      p.peak && peakIndex > 0
        ? (all.find((s) => s.start >= (p.peak?.start ?? 0))?.text.trim() ?? null)
        : null;
    const present: Record<PlotStage, boolean> = {
      exposition: all.length > 0,
      rising: p.segments.length >= 3 && peakIndex >= 1,
      climax: climaxQuote !== null,
      falling: peakIndex >= 0 && peakIndex < p.segments.length - 1,
      resolution: resolved,
    };
    return {
      conflict: {
        clear: conflictQuote !== null,
        matchesChosen: matches,
        quote: conflictQuote,
        idea:
          conflictQuote === null
            ? 'You could try one sentence early on that shows what your character wants and what stands in the way.'
            : matches === false && input.conflict
              ? `You could try making the ${input.conflict.label.toLowerCase()} struggle stronger: ${input.conflict.definition.toLowerCase()}`
              : null,
      },
      stages: PLOT_STAGES.map((stage) => ({
        stage,
        present: present[stage],
        quote: stage === 'climax' ? climaxQuote : stage === 'resolution' && resolved ? last : null,
      })),
      climax: { clear: climaxQuote !== null, quote: climaxQuote },
      ending: {
        resolved,
        quote: resolved ? last : null,
        idea: resolved
          ? null
          : 'You could try a last moment that shows how things have changed for your character.',
      },
      planFollowed: null,
    };
  },
};
