/**
 * Math wording (math-design.md §3.3 C4): plainer copy for 14–16-year-olds, in one place so the
 * Story and Essay text stays untouched. Fewer emoji; results say what happened.
 */
export const MATH_COPY = {
  correct: 'Correct.',
  notQuite: 'Not quite.',
  tryHint: 'Try a hint, or check your working.',
  seeSolution: 'Check your working, or see the solution.',
  passed: (score: number, total: number, percent: number) =>
    `Passed: ${score} of ${total} (${percent}%)`,
  notYet: (score: number, total: number, percent: number) =>
    `Not yet: ${score} of ${total} (${percent}%)`,
  handedIn: (score: number, total: number) => `Handed in: ${score} of ${total} right`,
  addToLog: 'Add to my error log',
  inLog: 'In your error log',
  similar: 'Try a similar one',
  nudge: 'Give me a nudge',
  noSimilar: 'No similar problem yet: finish more lessons to unlock more.',
  skipPrompt: '2 minutes on this one: skip it and come back?',
} as const;

/** "6 points right · 1.5 blank · 0 wrong" style point counts (one decimal at most). */
export const points = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

/** Seconds as m:ss ("2:05"). */
export const clock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
