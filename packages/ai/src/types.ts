import type { z } from 'zod/v4';

/** What every analyzer knows about the piece (DESIGN.md §8.4). Never includes names or ids. */
export interface WritingContext {
  text: string;
  activityTitle: string;
  prompt: string;
  unitTitle: string;
  focusSkills: readonly string[];
  gradeLevel: number;
}

export type Effort = 'low' | 'medium' | 'high';

/**
 * One Claude-backed analyzer: a stable system prompt (cacheable prefix), a Zod output schema, and a
 * fake used when no API key is configured (and in tests), so the app works end to end offline.
 */
export interface AnalyzerDef<I, O> {
  id: string;
  /** Bump when the prompt or schema changes: part of the cache key and stored on feedback. */
  version: string;
  effort: Effort;
  maxTokens: number;
  system: string;
  schema: z.ZodType<O>;
  buildUser(input: I): string;
  fake(input: I): O;
}

export interface AiUsageStats {
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  latencyMs: number;
}

export type AnalyzerOutcome<O> =
  | { status: 'ok'; result: O; usage: AiUsageStats }
  /** The model declined (stop_reason "refusal"): route to the teacher, never show an error. */
  | { status: 'declined'; usage: AiUsageStats };

export interface AiGateway {
  readonly provider: 'anthropic' | 'fake';
  readonly model: string;
  run<I, O>(def: AnalyzerDef<I, O>, input: I): Promise<AnalyzerOutcome<O>>;
}

export class AnalyzerParseError extends Error {
  constructor(readonly analyzer: string) {
    super(`Analyzer ${analyzer} returned no parseable output`);
  }
}
