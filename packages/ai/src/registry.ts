import { characterReadAnalyzer } from './analyzers/character-read.js';
import { sensoryAnalyzer } from './analyzers/sensory.js';
import { settingMoodAnalyzer } from './analyzers/setting-mood.js';
import { showVsTellAnalyzer } from './analyzers/show-vs-tell.js';

/** Analyzers students can run from the Coach panel ("Ask Quill"). */
export const LIVE_ANALYZERS = {
  'show-vs-tell': showVsTellAnalyzer,
  'sensory-analysis': sensoryAnalyzer,
  'character-read': characterReadAnalyzer,
  'setting-mood': settingMoodAnalyzer,
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
  CHARACTER_SKETCH: ['character-read', 'show-vs-tell'],
  TRAITS_IN_ACTION: ['character-read', 'show-vs-tell'],
  CHARACTER_VOICE: ['show-vs-tell'],
  FLAW_SCENE: ['character-read', 'show-vs-tell'],
  SETTING_SNAPSHOT: ['setting-mood', 'sensory-analysis'],
  MOOD_SCENE: ['setting-mood', 'sensory-analysis'],
  WORLD_DETAILS: ['setting-mood', 'show-vs-tell'],
  SETTING_SCENE: ['setting-mood', 'sensory-analysis'],
};

/** Activity types where "Can your reader tell?" also checks the character's want and fear. */
export const WANT_FEAR_TYPES: readonly string[] = ['CHARACTER_SKETCH', 'FLAW_SCENE'];

export function analyzersForActivity(type: string): LiveAnalyzerId[] {
  return BY_ACTIVITY_TYPE[type] ?? ['show-vs-tell'];
}
