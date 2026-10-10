/**
 * Deterministic writing analyzers (DESIGN.md §8.3): pure, fast functions that run in the browser
 * for the Coach panel and on the server for rule checks and (from P4b) AI feedback context.
 */
export * from './text.js';
export * from './analyzers/stats.js';
export * from './analyzers/word-choice.js';
export * from './analyzers/narration.js';
export * from './analyzers/senses.js';
export * from './analyzers/dialogue.js';
export * from './analyzers/mood.js';
export * from './coach.js';
