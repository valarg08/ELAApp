import { describe, expect, it } from 'vitest';
import { type UnitBundle, LessonContent, tokenize, validateUnitBundle } from './content.js';

const lesson = (overrides: Partial<LessonContent> = {}): LessonContent =>
  LessonContent.parse({
    slug: 'show-dont-tell',
    order: 1,
    title: 'Show, Don’t Tell',
    estMinutes: 30,
    steps: [
      {
        id: 'hook',
        type: 'hook',
        variant: 'question',
        prompt: 'How do you know someone is nervous?',
      },
      {
        id: 'learn',
        type: 'mini_lesson',
        cards: [
          { kind: 'definition', title: 'Telling', body: 'Names the feeling.' },
          { kind: 'definition', title: 'Showing', body: 'Lets the reader see it.' },
          {
            kind: 'clue-hunt',
            title: 'Clues',
            prompt: 'Find the clues',
            text: 'Her hands shook.',
            clues: ['shook'],
          },
        ],
      },
      { id: 'practice', type: 'guided_practice', activityKeys: ['u01.mc'] },
      { id: 'challenge', type: 'challenge', activityKey: 'u01.write' },
      { id: 'reflect', type: 'reflection', prompts: ['What did you learn?'] },
    ],
    ...overrides,
  });

const bundle = (): UnitBundle => ({
  unit: {
    number: 1,
    slug: 'foundations',
    title: 'Foundations',
    summary: 'Basics',
    bigIdeas: [],
    published: true,
  },
  lessons: [lesson()],
  activities: [
    {
      key: 'u01.mc',
      type: 'MULTIPLE_CHOICE',
      title: 'Quiz',
      questions: [
        {
          id: 'q1',
          prompt: 'Which is showing?',
          options: [
            { id: 'a', text: 'He was sad.' },
            { id: 'b', text: 'Tears dripped on his homework.' },
          ],
          correctOptionId: 'b',
          explanation: 'We can see the tears.',
        },
      ],
    },
    {
      key: 'u01.write',
      type: 'SHOW_TELL_TRANSFORM',
      title: 'Transform',
      prompt: 'Show it.',
      tips: [],
      constraints: { minWords: 10, bannedWords: [], requiredWords: [], enforcement: 'hard' },
    },
  ],
});

describe('validateUnitBundle', () => {
  it('accepts a consistent unit', () => {
    expect(validateUnitBundle(bundle())).toEqual([]);
  });

  it('reports a missing practice activity', () => {
    const b = bundle();
    b.activities = b.activities.filter((a) => a.key !== 'u01.mc');
    expect(validateUnitBundle(b)).toContain(
      'lesson "show-dont-tell": practice activity "u01.mc" does not exist',
    );
  });

  it('reports a challenge that is not a writing activity', () => {
    const b = bundle();
    const [hook, learn, practice, , reflect] = lesson().steps;
    b.lessons = [
      lesson({
        steps: [
          hook,
          learn,
          practice,
          { id: 'challenge', type: 'challenge', activityKey: 'u01.mc' },
          reflect,
        ],
      }),
    ];
    expect(validateUnitBundle(b).join('\n')).toMatch(/must be a writing activity/);
  });

  it('reports a wrong correct answer and a clue that is not in the text', () => {
    const b = bundle();
    const mc = b.activities[0];
    if (mc?.type === 'MULTIPLE_CHOICE' && mc.questions[0]) mc.questions[0].correctOptionId = 'z';
    const errors = validateUnitBundle(b);
    expect(errors.join('\n')).toMatch(/correctOptionId "z" is not an option/);
  });

  it('reports gaps in lesson order and keys from another unit', () => {
    const b = bundle();
    b.lessons = [lesson({ order: 2 })];
    b.activities.push({ key: 'u02.other', type: 'REFLECTION', title: 'R', prompts: ['Why?'] });
    const errors = validateUnitBundle(b).join('\n');
    expect(errors).toMatch(/without gaps/);
    expect(errors).toMatch(/must start with "u01\."/);
  });

  it('requires lessons in a published unit', () => {
    const b = bundle();
    b.lessons = [];
    expect(validateUnitBundle(b).join('\n')).toMatch(/published unit needs at least one lesson/);
  });
});

describe('lesson schema', () => {
  it('requires the five steps in order', () => {
    const steps = lesson().steps;
    const shuffled = [steps[1], steps[0], steps[2], steps[3], steps[4]];
    expect(LessonContent.safeParse({ ...lesson(), steps: shuffled }).success).toBe(false);
  });
});

describe('tokenize', () => {
  it('lowercases and strips punctuation', () => {
    expect(tokenize('Her hands SHOOK, didn’t they?')).toEqual([
      'her',
      'hands',
      'shook',
      'didn’t',
      'they',
    ]);
  });
});
