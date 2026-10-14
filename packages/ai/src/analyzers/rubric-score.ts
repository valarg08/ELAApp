import {
  buildCoachReport,
  dialogue,
  grammarIssues,
  senses,
  veryPhrases,
  wordStats,
} from '@storyforge/writing-analysis';
import { z } from 'zod/v4';
import { QUILL_RULES, writingBlock } from '../prompts.js';
import { type Rubric, describeRubric } from '../rubric.js';
import type { AnalyzerDef, WritingContext } from '../types.js';

/**
 * Rubric score + feedback composition (DESIGN.md §8.2 steps 5–6, §8.5) in one call: levels per
 * criterion with evidence, plus the strengths and next steps the student will see.
 */
export interface RubricScoreInput extends WritingContext {
  rubric: Rubric;
  /** Counts from the deterministic analyzers (no student text). */
  evidence: readonly string[];
  /** Short summaries of the other AI analyzers' findings. */
  analyzerNotes: readonly string[];
}

export const RubricScoreResult = z.object({
  criteria: z.array(
    z.object({
      key: z.string(),
      /** 1–4 */
      level: z.number().int(),
      evidenceQuotes: z.array(z.string()),
      rationale: z.string(),
      /** 0–1: how sure the level is. Below 0.6 asks the teacher to check. */
      confidence: z.number(),
    }),
  ),
  /** Two or three warm sentences addressed to the student. */
  summary: z.string(),
  strengths: z.array(z.object({ quote: z.string(), comment: z.string() })),
  nextSteps: z.array(
    z.object({
      quote: z.string().nullable(),
      action: z.string(),
      exampleIdea: z.string().nullable(),
    }),
  ),
});
export type RubricScoreResult = z.infer<typeof RubricScoreResult>;

const SYSTEM = `${QUILL_RULES}

Task: score the piece against the rubric, then write the feedback the student will see.
- criteria: one entry per rubric criterion key. level is 1, 2, 3 or 4 using the level descriptors. Judge against what is reasonable for the grade level and this short activity, not a finished book. evidenceQuotes are 1-2 exact quotes that justify the level. rationale is one sentence for the teacher. confidence is 0 to 1.
- summary: two or three warm sentences to the student about the piece as a whole.
- strengths: 1 or 2 specific things done well. quote = exact words; comment = why it works.
- nextSteps: at most 3, most important first. action = one thing to try (start with "You could try"); quote = exact words it applies to, or null for the whole piece; exampleIdea = one short example, or null.
Use the analyzer evidence as hints, but trust the writing itself.`;

const clampLevel = (n: number) => Math.max(1, Math.min(4, Math.round(n)));

export const rubricScoreAnalyzer: AnalyzerDef<RubricScoreInput, RubricScoreResult> = {
  id: 'rubric-score',
  version: 'rubric-score-1',
  effort: 'high',
  maxTokens: 4000,
  system: SYSTEM,
  schema: RubricScoreResult,
  buildUser: (input) =>
    [
      `Rubric (${input.rubric.key}):`,
      describeRubric(input.rubric),
      '',
      'Analyzer evidence:',
      ...input.evidence.map((e) => `- ${e}`),
      ...input.analyzerNotes.map((n) => `- ${n}`),
      '',
      writingBlock(input),
    ].join('\n'),
  fake(input) {
    const stats = wordStats(input.text);
    const usedSenses = senses(input.text).used.length;
    const dialogueIssues = dialogue(input.text).issues.length;
    // Grammar practice is coached on grammar, not on story craft.
    const coach = buildCoachReport(
      input.text,
      input.rubric.key === 'grammar.practice'
        ? { analyzers: ['nouns', 'pronouns', 'verbs', 'modifiers'] }
        : {},
    );
    const levels: Record<string, number> = {
      creativity: 3,
      clarity: stats.averageSentenceLength > 25 ? 2 : 3,
      structure: stats.paragraphs > 1 || stats.words < 80 ? 3 : 2,
      sensory: clampLevel(1 + usedSenses * 0.75),
      grammar: dialogueIssues > 2 ? 2 : 3,
      focus: 3,
      conventions: grammarIssues(input.text).length > 2 ? 2 : 3,
      wordChoice: veryPhrases(input.text).length > 2 ? 2 : 3,
    };
    const first = coach.strengths[0];
    return {
      criteria: input.rubric.criteria.map((c) => ({
        key: c.key,
        level: levels[c.key] ?? 3,
        evidenceQuotes: [],
        rationale: '(offline estimate from the rule-based checks)',
        confidence: 0.5,
      })),
      summary:
        'You have a clear piece of writing with some strong moments. Here are a couple of ideas to make it even better.',
      strengths: first
        ? [{ quote: input.text.split(/[.!?]/)[0]?.trim() ?? '', comment: first.message }]
        : [],
      nextSteps: coach.nextSteps.map((n) => ({
        quote: n.span?.text ?? null,
        action: n.message,
        exampleIdea: null,
      })),
    };
  },
};
