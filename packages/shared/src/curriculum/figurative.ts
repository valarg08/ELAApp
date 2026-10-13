import type { Device } from '@storyforge/writing-analysis';

/**
 * The simile / metaphor / personification helper (DESIGN.md §10, Unit 6): a scaffold, not a
 * generator of finished lines. For a subject and a device it gives sentence frames with blanks and a
 * few idea seeds; the student writes the line.
 */
export interface DeviceGuide {
  id: Device;
  label: string;
  icon: string;
  definition: string;
  example: string;
  /** Frames with "{Subject}" / "{subject}" for the student's subject and ___ for their own words. */
  frames: readonly string[];
  /** Questions that point at a comparison without making it. */
  seeds: readonly string[];
}

export const DEVICE_GUIDES: Record<Device, DeviceGuide> = {
  simile: {
    id: 'simile',
    label: 'Simile',
    icon: '🔗',
    definition: 'Compares two things using “like” or “as”.',
    example: 'The hallway was as quiet as a held breath.',
    frames: ['{Subject} was as ___ as ___.', '{Subject} ___ like ___.', 'Like ___, {subject} ___.'],
    seeds: [
      'Which animal moves or sounds the way {subject} does?',
      'What in a kitchen has the same colour, shape or noise as {subject}?',
      'What kind of weather feels like {subject}?',
      'Which machine or tool works the way {subject} does?',
      'What food has the same texture as {subject}?',
      'What from your own life (a game, a sport, a place) feels like {subject}?',
      'What would a little kid compare {subject} to?',
    ],
  },
  metaphor: {
    id: 'metaphor',
    label: 'Metaphor',
    icon: '🎭',
    definition: 'Says one thing IS another, without “like” or “as”.',
    example: 'The playground was a battlefield.',
    frames: ['{Subject} was a ___ that ___.', '{Subject} is a ___ of ___.', '{Subject}? A ___.'],
    seeds: [
      'If {subject} were a place, which place would it be?',
      'If {subject} were an animal, what would it be, and what would it be doing?',
      'What job or person is {subject} like: a guard, a thief, a clown?',
      'Is {subject} a gift, a trap, a prison or a playground? Why?',
      'What large thing (an ocean, a mountain, a storm) could {subject} be?',
      'What would {subject} be in a fairy tale?',
      'If {subject} were a sound, what would it be?',
    ],
  },
  personification: {
    id: 'personification',
    label: 'Personification',
    icon: '🗣️',
    definition: 'Gives an object, animal or idea a human action or feeling.',
    example: 'The old stairs groaned under every step.',
    frames: [
      '{Subject} ___ as if it ___.',
      '{Subject} whispered / grumbled / sighed ___.',
      'Every night, {subject} ___.',
    ],
    seeds: [
      'If {subject} could talk, what would it complain about?',
      'What mood is {subject} in today: grumpy, sleepy, nervous?',
      'What would {subject} do with hands?',
      'Who is {subject} waiting for, or hiding from?',
      'What sound does {subject} make, and what person makes that sound?',
      'How would {subject} move if it could walk?',
      'What secret might {subject} know?',
    ],
  },
};

const DETERMINER = /^(?:a|an|the|my|your|his|her|their|our|this|that|these|those|some)\s/i;

/**
 * Put the subject into a frame or seed: "{Subject}" starts a sentence, "{subject}" is mid-sentence.
 * A bare noun gets "the" ("thunderstorm" → "the thunderstorm"); "my cat" stays as it is.
 */
export function fillSubject(template: string, subject: string): string {
  const typed = subject.trim().replace(/\s+/g, ' ');
  // "Grandma" is a name: no "the". "The old bus" mid-sentence is "the old bus".
  const phrase =
    typed === ''
      ? 'it'
      : DETERMINER.test(typed)
        ? typed.replace(DETERMINER, (d) => d.toLowerCase())
        : /^\p{Lu}/u.test(typed)
          ? typed
          : `the ${typed}`;
  const capital = phrase.charAt(0).toUpperCase() + phrase.slice(1);
  return template.replaceAll('{Subject}', capital).replaceAll('{subject}', phrase);
}
