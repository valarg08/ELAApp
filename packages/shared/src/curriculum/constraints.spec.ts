import { describe, expect, it } from 'vitest';
import {
  WritingConstraints,
  checkConstraints,
  countWords,
  findBannedWords,
} from './constraints.js';

const rules = (input: Partial<WritingConstraints>) => WritingConstraints.parse(input);

describe('countWords', () => {
  it.each([
    ['', 0],
    ['   ', 0],
    ['Lost key. Found friend.', 4],
    ["Don't stop — the well-known path!", 5],
    ['Ünïcödé wörds count tøø', 4],
  ])('%j has %i words', (text, n) => {
    expect(countWords(text)).toBe(n);
  });
});

describe('findBannedWords', () => {
  it('matches whole words without case, including simple endings', () => {
    expect(findBannedWords('She SAID it, then kept saying it.', ['said', 'say'])).toEqual([
      'said',
      'say',
    ]);
  });

  it('does not match inside other words', () => {
    expect(findBannedWords('The everyday very-thin veryanna', ['very'])).toEqual(['very']);
    expect(findBannedWords('Everything is fine', ['very'])).toEqual([]);
  });
});

describe('checkConstraints', () => {
  it('passes when every rule is met', () => {
    expect(
      checkConstraints('One two three four five six', rules({ exactWords: 6 })).problems,
    ).toEqual([]);
  });

  it('reports each broken rule', () => {
    const { wordCount, problems } = checkConstraints(
      'It was very scary.',
      rules({ minWords: 10, bannedWords: ['very', 'scary'], requiredWords: ['storm'] }),
    );
    expect(wordCount).toBe(4);
    expect(problems).toEqual([
      { rule: 'minWords', expected: 10, actual: 4 },
      { rule: 'bannedWords', found: ['very', 'scary'] },
      { rule: 'requiredWords', missing: ['storm'] },
    ]);
  });

  it('rejects minWords greater than maxWords', () => {
    expect(WritingConstraints.safeParse({ minWords: 10, maxWords: 5 }).success).toBe(false);
  });
});
