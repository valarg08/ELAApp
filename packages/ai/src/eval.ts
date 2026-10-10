/**
 * `pnpm ai:eval` (DESIGN.md §8.9): runs the golden set through the REAL Claude API and reports
 * rubric agreement, quote anchoring and token use. Costs money: run by hand, never in CI.
 */
import { readFileSync } from 'node:fs';
import { z } from 'zod';
import { anchorQuote } from './anchor.js';
import { rubricScoreAnalyzer } from './analyzers/rubric-score.js';
import { safetyAnalyzer } from './analyzers/safety.js';
import { showVsTellAnalyzer } from './analyzers/show-vs-tell.js';
import { ClaudeGateway, DEFAULT_MODEL } from './gateway.js';
import { DEFAULT_RUBRIC } from './rubric.js';
import type { AiUsageStats, WritingContext } from './types.js';

const Golden = z.array(
  z.object({
    id: z.string(),
    activity: z.object({ title: z.string(), prompt: z.string(), unit: z.string() }),
    gradeLevel: z.number(),
    text: z.string(),
    expected: z.record(z.string(), z.number()).nullable(),
    expectSafetyFlag: z.boolean(),
  }),
);

try {
  process.loadEnvFile(new URL('../../../.env', import.meta.url));
} catch {
  // use the real environment
}
const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error('ai:eval calls the real Claude API: set ANTHROPIC_API_KEY in .env first.');
  process.exit(1);
}
const gateway = new ClaudeGateway(apiKey, process.env.AI_MODEL ?? DEFAULT_MODEL);
const golden = Golden.parse(
  JSON.parse(readFileSync(new URL('../evals/golden.json', import.meta.url), 'utf8')),
);

const totals = { within1: 0, exact: 0, criteria: 0, quotes: 0, anchored: 0, safetyRight: 0 };
const tokens = { input: 0, output: 0, cacheRead: 0 };
const add = (u: AiUsageStats) => {
  tokens.input += u.inputTokens;
  tokens.output += u.outputTokens;
  tokens.cacheRead += u.cacheReadTokens;
};

console.log(`Model ${gateway.model}, ${golden.length} pieces\n`);
for (const piece of golden) {
  const ctx: WritingContext = {
    text: piece.text,
    activityTitle: piece.activity.title,
    prompt: piece.activity.prompt,
    unitTitle: piece.activity.unit,
    focusSkills: [],
    gradeLevel: piece.gradeLevel,
  };
  const safety = await gateway.run(safetyAnalyzer, ctx);
  add(safety.usage);
  const flagged = safety.status === 'declined' || safety.result.flagged;
  if (flagged === piece.expectSafetyFlag) totals.safetyRight += 1;
  let line = `${piece.id}: safety ${flagged ? 'FLAGGED' : 'ok'}${flagged === piece.expectSafetyFlag ? '' : ' (UNEXPECTED)'}`;

  if (piece.expected && !flagged) {
    const svt = await gateway.run(showVsTellAnalyzer, ctx);
    add(svt.usage);
    const scored = await gateway.run(rubricScoreAnalyzer, {
      ...ctx,
      rubric: DEFAULT_RUBRIC,
      evidence: [],
      analyzerNotes: [],
    });
    add(scored.usage);
    if (scored.status === 'ok') {
      const levels: string[] = [];
      for (const c of scored.result.criteria) {
        const want = piece.expected[c.key];
        if (want === undefined) continue;
        totals.criteria += 1;
        if (Math.abs(c.level - want) <= 1) totals.within1 += 1;
        if (c.level === want) totals.exact += 1;
        levels.push(`${c.key} ${c.level}/${want}`);
      }
      const quotes = [
        ...scored.result.strengths.map((s) => s.quote),
        ...scored.result.nextSteps.flatMap((n) => (n.quote ? [n.quote] : [])),
        ...(svt.status === 'ok' ? svt.result.tellingSentences.map((t) => t.quote) : []),
      ];
      totals.quotes += quotes.length;
      totals.anchored += quotes.filter((q) => anchorQuote(piece.text, q)).length;
      line += ` | ${levels.join(', ')}`;
    } else {
      line += ' | rubric declined';
    }
  }
  console.log(line);
}

const pct = (n: number, d: number) => (d === 0 ? 'n/a' : `${Math.round((n / d) * 100)}%`);
console.log(`
Rubric within ±1 level: ${pct(totals.within1, totals.criteria)} (target ≥ 90%)
Rubric exact:           ${pct(totals.exact, totals.criteria)} (target ≥ 60%)
Quote anchoring:        ${pct(totals.anchored, totals.quotes)} (target ≥ 98%)
Safety as expected:     ${totals.safetyRight}/${golden.length}
Tokens: ${tokens.input} in (${tokens.cacheRead} cache reads), ${tokens.output} out`);
