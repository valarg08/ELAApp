/**
 * Deterministic answer checking for the Math track (DESIGN.md §9.13). No dependencies; used by the
 * browser (instant practice checks), the API (marked problem sets, error-log redos) and
 * content:check (verifying every `compute` against its answer).
 */
export * from './answer.js';
export { evaluate, readAnswer, texToExpression } from './parse.js';
export { type Value, approx, equal, format, MathError as MathCheckError } from './value.js';
