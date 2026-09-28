import { randomInt } from 'node:crypto';
import {
  JOIN_CODE_ALPHABET,
  PICTURE_IDS,
  PICTURE_SECRET_LENGTH,
  type StudentSecretKind,
  WORD_CODE_ALPHABET,
  WORD_CODE_LENGTH,
  encodePictureSecret,
} from '@storyforge/shared';

function pick<T>(items: readonly T[]): T {
  const item = items[randomInt(items.length)];
  if (item === undefined) throw new Error('pick() needs a non-empty list');
  return item;
}

const randomString = (alphabet: string, length: number) =>
  Array.from({ length }, () => alphabet[randomInt(alphabet.length)]).join('');

export const generateJoinCode = () => randomString(JOIN_CODE_ALPHABET, 6);

/** A fresh picture or word secret, using a cryptographically secure RNG. */
export function generateStudentSecret(kind: StudentSecretKind): string {
  if (kind === 'WORD') return randomString(WORD_CODE_ALPHABET, WORD_CODE_LENGTH);
  const pool = [...PICTURE_IDS];
  const chosen = Array.from(
    { length: PICTURE_SECRET_LENGTH },
    () => pool.splice(randomInt(pool.length), 1)[0],
  ).filter((id) => id !== undefined);
  return encodePictureSecret(chosen);
}

// Friendly, neutral word lists for usernames like "brave-otter-42".
const ADJECTIVES = [
  'amber',
  'bold',
  'brave',
  'bright',
  'calm',
  'clever',
  'cosmic',
  'cozy',
  'daring',
  'eager',
  'fancy',
  'gentle',
  'golden',
  'happy',
  'jolly',
  'kind',
  'lucky',
  'lunar',
  'merry',
  'mighty',
  'misty',
  'noble',
  'plucky',
  'polar',
  'proud',
  'quick',
  'quiet',
  'rapid',
  'royal',
  'rustic',
  'shiny',
  'silver',
  'snowy',
  'solar',
  'speedy',
  'sunny',
  'swift',
  'teal',
  'witty',
  'zesty',
] as const;
const ANIMALS = [
  'badger',
  'beaver',
  'bison',
  'camel',
  'cobra',
  'condor',
  'coyote',
  'crane',
  'dolphin',
  'eagle',
  'falcon',
  'ferret',
  'gecko',
  'heron',
  'ibis',
  'jaguar',
  'koala',
  'lemur',
  'lynx',
  'manatee',
  'marmot',
  'moose',
  'narwhal',
  'ocelot',
  'otter',
  'owl',
  'panda',
  'parrot',
  'penguin',
  'puffin',
  'quokka',
  'raven',
  'seal',
  'sloth',
  'tapir',
  'tiger',
  'toucan',
  'turtle',
  'walrus',
  'zebra',
] as const;

/** 40 × 40 × 90 = 144,000 combinations; callers retry on collision. */
export const generateUsername = () => `${pick(ADJECTIVES)}-${pick(ANIMALS)}-${randomInt(10, 100)}`;
