import { describe, expect, it } from 'vitest';
import {
  PICTURES,
  decodePictureSecret,
  describeSecret,
  encodePictureSecret,
  isValidStudentSecret,
  isValidWordCode,
} from './student-secrets.js';

describe('picture secrets', () => {
  it('has 12 distinct pictures', () => {
    expect(new Set(PICTURES.map((p) => p.id)).size).toBe(12);
  });

  it('round-trips through encode/decode', () => {
    const ids = ['cat', 'sun', 'tree', 'fish'] as const;
    expect(decodePictureSecret(encodePictureSecret(ids))).toEqual(ids);
  });

  it.each([
    ['cat-sun-tree', 'too short'],
    ['cat-sun-tree-fish-dog', 'too long'],
    ['cat-cat-tree-fish', 'repeats a picture'],
    ['cat-sun-tree-unicorn', 'unknown picture'],
  ])('rejects %s (%s)', (secret) => {
    expect(decodePictureSecret(secret)).toBeNull();
  });

  it('describes a secret for login cards', () => {
    expect(describeSecret('PICTURE', 'cat-sun-tree-fish')).toBe('Cat → Sun → Tree → Fish');
  });
});

describe('word codes', () => {
  it('accepts 6 characters from the safe alphabet', () => {
    expect(isValidWordCode('ab3k9z')).toBe(true);
  });

  it('rejects look-alike characters and wrong lengths', () => {
    expect(isValidWordCode('ab0k9z')).toBe(false); // zero
    expect(isValidWordCode('abl19z')).toBe(false); // l and 1
    expect(isValidWordCode('abc')).toBe(false);
  });

  it('validates by kind', () => {
    expect(isValidStudentSecret('WORD', 'cat-sun-tree-fish')).toBe(false);
    expect(isValidStudentSecret('PICTURE', 'cat-sun-tree-fish')).toBe(true);
  });
});
