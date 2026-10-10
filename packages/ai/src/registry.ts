import { sensoryAnalyzer } from './analyzers/sensory.js';
import { showVsTellAnalyzer } from './analyzers/show-vs-tell.js';

/** Analyzers students can run from the Coach panel ("Ask Quill"). */
export const LIVE_ANALYZERS = {
  'show-vs-tell': showVsTellAnalyzer,
  'sensory-analysis': sensoryAnalyzer,
} as const;
export type LiveAnalyzerId = keyof typeof LIVE_ANALYZERS;

/** Which coach checks map to which live AI analyzer. */
export const LIVE_FOR_COACH: Record<string, LiveAnalyzerId> = {
  telling: 'show-vs-tell',
  senses: 'sensory-analysis',
};

/**
 * AnalyzerRegistry (DESIGN.md §8.4): the LLM analyzers run on a submission, by activity type.
 * The rubric score and safety check always run. Later units add their analyzers here.
 */
const BY_ACTIVITY_TYPE: Record<string, LiveAnalyzerId[]> = {
  SIX_WORD_STORY: [],
  QUICK_WRITE: ['show-vs-tell'],
  SHOW_TELL_TRANSFORM: ['show-vs-tell'],
  DESCRIBE_WITHOUT_NAMING: ['sensory-analysis', 'show-vs-tell'],
  VIVID_REWRITE: ['show-vs-tell', 'sensory-analysis'],
};

export function analyzersForActivity(type: string): LiveAnalyzerId[] {
  return BY_ACTIVITY_TYPE[type] ?? ['show-vs-tell'];
}
