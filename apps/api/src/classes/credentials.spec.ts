import { decodePictureSecret, isValidWordCode } from '@storyforge/shared';
import { generateJoinCode, generateStudentSecret, generateUsername } from './credentials.js';

describe('credential generators', () => {
  it('makes 6-character join codes without look-alike characters', () => {
    for (let i = 0; i < 200; i++) expect(generateJoinCode()).toMatch(/^[A-HJ-NP-Z2-9]{6}$/);
  });

  it('makes valid picture secrets with 4 distinct pictures', () => {
    for (let i = 0; i < 200; i++)
      expect(decodePictureSecret(generateStudentSecret('PICTURE'))).not.toBeNull();
  });

  it('makes valid word codes', () => {
    for (let i = 0; i < 200; i++) expect(isValidWordCode(generateStudentSecret('WORD'))).toBe(true);
  });

  it('makes friendly usernames', () => {
    expect(generateUsername()).toMatch(/^[a-z]+-[a-z]+-\d{2}$/);
  });

  it('varies secrets (not a fixed value)', () => {
    const seen = new Set(Array.from({ length: 50 }, () => generateStudentSecret('PICTURE')));
    expect(seen.size).toBeGreaterThan(40);
  });
});
