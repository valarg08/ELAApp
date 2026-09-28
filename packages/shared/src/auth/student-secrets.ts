import { z } from 'zod';

/**
 * Picture passwords: a student taps 4 different pictures in order, out of 12.
 * 12 × 11 × 10 × 9 = 11,880 combinations; together with the class code, the username and the
 * lockout after 10 failed attempts, that is adequate for classroom accounts.
 */
export const PICTURES = [
  { id: 'cat', emoji: '🐱', label: 'Cat' },
  { id: 'dog', emoji: '🐶', label: 'Dog' },
  { id: 'sun', emoji: '☀️', label: 'Sun' },
  { id: 'moon', emoji: '🌙', label: 'Moon' },
  { id: 'star', emoji: '⭐', label: 'Star' },
  { id: 'tree', emoji: '🌳', label: 'Tree' },
  { id: 'apple', emoji: '🍎', label: 'Apple' },
  { id: 'rocket', emoji: '🚀', label: 'Rocket' },
  { id: 'fish', emoji: '🐟', label: 'Fish' },
  { id: 'flower', emoji: '🌸', label: 'Flower' },
  { id: 'car', emoji: '🚗', label: 'Car' },
  { id: 'ball', emoji: '⚽', label: 'Ball' },
] as const;

export type PictureId = (typeof PICTURES)[number]['id'];
export const PICTURE_IDS: readonly PictureId[] = PICTURES.map((p) => p.id);
const PICTURE_ID_SET: ReadonlySet<string> = new Set(PICTURE_IDS);
export const PICTURE_SECRET_LENGTH = 4;

/** Word codes avoid look-alike characters (0/o, 1/l/i). */
export const WORD_CODE_ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';
export const WORD_CODE_LENGTH = 6;

export const StudentSecretKind = z.enum(['PICTURE', 'WORD']);
export type StudentSecretKind = z.infer<typeof StudentSecretKind>;

/** Picture secrets travel as ids joined by "-", e.g. "cat-sun-tree-fish". */
export function encodePictureSecret(ids: readonly PictureId[]): string {
  return ids.join('-');
}

export function decodePictureSecret(secret: string): PictureId[] | null {
  const parts = secret.split('-');
  if (parts.length !== PICTURE_SECRET_LENGTH || new Set(parts).size !== parts.length) return null;
  return parts.every((p): p is PictureId => PICTURE_ID_SET.has(p)) ? parts : null;
}

const WORD_CODE_PATTERN = new RegExp(`^[${WORD_CODE_ALPHABET}]{${WORD_CODE_LENGTH}}$`);

export function isValidWordCode(secret: string): boolean {
  return WORD_CODE_PATTERN.test(secret);
}

export function isValidStudentSecret(kind: StudentSecretKind, secret: string): boolean {
  return kind === 'PICTURE' ? decodePictureSecret(secret) !== null : isValidWordCode(secret);
}

/** Human-readable form for login cards: "Cat → Sun → Tree → Fish". */
export function describeSecret(kind: StudentSecretKind, secret: string): string {
  if (kind === 'WORD') return secret;
  const ids = decodePictureSecret(secret) ?? [];
  return ids.map((id) => PICTURES.find((p) => p.id === id)?.label ?? id).join(' → ');
}
