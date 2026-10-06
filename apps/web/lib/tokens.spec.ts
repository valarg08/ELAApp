import { describe, expect, it } from 'vitest';
import { scoreSelection, splitWords } from './tokens';

describe('splitWords', () => {
  it('keeps punctuation and spaces as non-word parts', () => {
    const parts = splitWords("Leo's face turned red.");
    expect(parts.map((p) => p.text).join('')).toBe("Leo's face turned red.");
    expect(parts.filter((p) => p.word).map((p) => p.word)).toEqual([
      "leo's",
      'face',
      'turned',
      'red',
    ]);
  });
});

describe('scoreSelection', () => {
  it('is correct only with every target and nothing extra', () => {
    expect(
      scoreSelection(['Red', 'stomped', 'slammed'], ['red', 'stomped', 'slammed']).correct,
    ).toBe(true);
    const partial = scoreSelection(['red', 'face'], ['red', 'stomped']);
    expect(partial).toMatchObject({
      correct: false,
      found: ['red'],
      missed: ['stomped'],
      extra: ['face'],
    });
  });
});
