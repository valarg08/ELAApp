import { describe, expect, it } from 'vitest';
import { changedWordCount, diffStats, diffWords } from './diff.js';

const join = (segments: { type: string; text: string }[], keep: string[]) =>
  segments
    .filter((s) => keep.includes(s.type))
    .map((s) => s.text)
    .join('');

describe('diffWords', () => {
  it('returns one same segment for equal texts', () => {
    expect(diffWords('The sky is grey.', 'The sky is grey.')).toEqual([
      { type: 'same', text: 'The sky is grey.' },
    ]);
  });

  it('marks a replaced word', () => {
    expect(diffWords('The sky is grey.', 'The sky is bruised.')).toEqual([
      { type: 'same', text: 'The sky is ' },
      { type: 'removed', text: 'grey' },
      { type: 'added', text: 'bruised' },
      { type: 'same', text: '.' },
    ]);
  });

  it('rebuilds both texts from its segments', () => {
    const before = 'Thunder was loud.\n\nThe dog hid under the bed.';
    const after = 'Thunder cracked like a whip.\n\nThe dog shivered under the bed. Then silence.';
    const segments = diffWords(before, after);
    expect(join(segments, ['same', 'added'])).toBe(after);
    expect(join(segments, ['same', 'removed']).replace(/\s+/g, ' ')).toBe(
      before.replace(/\s+/g, ' '),
    );
  });

  it('ignores extra spaces but not new paragraphs', () => {
    expect(diffWords('one two', 'one  two').every((s) => s.type === 'same')).toBe(true);
    expect(diffWords('one two', 'one\n\ntwo').some((s) => s.type !== 'same')).toBe(true);
  });

  it('handles empty texts', () => {
    expect(diffWords('', 'Hello there')).toEqual([{ type: 'added', text: 'Hello there' }]);
    expect(diffWords('Hello there', '')).toEqual([{ type: 'removed', text: 'Hello there' }]);
    expect(diffWords('', '')).toEqual([]);
  });

  it('counts added and removed words', () => {
    expect(diffStats(diffWords('It was very scary.', 'It was terrifying, honestly.'))).toEqual({
      added: 2,
      removed: 2,
    });
  });
});

describe('changedWordCount', () => {
  it('counts words added and removed, ignoring case and order', () => {
    expect(changedWordCount('the cat sat', 'The cat sat')).toBe(0);
    expect(changedWordCount('the cat sat', 'sat the cat')).toBe(0);
    expect(changedWordCount('the cat sat', 'the dog sat down')).toBe(3);
    expect(changedWordCount('', 'one two three')).toBe(3);
  });
});
