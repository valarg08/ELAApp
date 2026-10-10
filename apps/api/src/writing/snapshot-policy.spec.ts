import { shouldSnapshot } from './snapshot-policy.js';

const now = new Date('2026-10-09T10:00:00Z');
const ago = (ms: number) => new Date(now.getTime() - ms);
const words = (n: number) => Array.from({ length: n }, (_, i) => `w${i}`).join(' ');

describe('shouldSnapshot', () => {
  it('snapshots the first non-empty save', () => {
    expect(shouldSnapshot(null, 'Hello', now)).toBe(true);
    expect(shouldSnapshot(null, '   ', now)).toBe(false);
  });

  it('never snapshots unchanged text', () => {
    expect(shouldSnapshot({ contentText: 'Same', createdAt: ago(600_000) }, 'Same', now)).toBe(
      false,
    );
  });

  it('snapshots after two minutes', () => {
    const last = { contentText: 'One two', createdAt: ago(119_000) };
    expect(shouldSnapshot(last, 'One two three', now)).toBe(false);
    expect(shouldSnapshot({ ...last, createdAt: ago(120_000) }, 'One two three', now)).toBe(true);
  });

  it('snapshots after 50 changed words', () => {
    const last = { contentText: '', createdAt: ago(1000) };
    expect(shouldSnapshot(last, words(49), now)).toBe(false);
    expect(shouldSnapshot(last, words(50), now)).toBe(true);
  });
});
