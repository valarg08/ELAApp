import { z } from 'zod';

/**
 * Unit 4 (DESIGN.md §10): the story mountain stages and the conflict selector's cards. Shared by
 * the content schema, the workspace (planner and conflict cards) and the API (AI prompts).
 */

export const STORY_STAGES = [
  {
    id: 'exposition',
    label: 'Beginning (exposition)',
    hint: 'Who is the story about, where are they, and what do they want?',
  },
  {
    id: 'rising',
    label: 'Rising action',
    hint: 'What problem starts, and how does it get harder?',
  },
  {
    id: 'climax',
    label: 'Climax',
    hint: 'The biggest, most exciting moment: the character faces the problem.',
  },
  {
    id: 'falling',
    label: 'Falling action',
    hint: 'What happens right after the big moment?',
  },
  {
    id: 'resolution',
    label: 'Resolution',
    hint: 'How does it end? What has changed for the character?',
  },
] as const;
export type StoryStageId = (typeof STORY_STAGES)[number]['id'];
export const STORY_STAGE_IDS: readonly StoryStageId[] = STORY_STAGES.map((s) => s.id);

export const CONFLICT_TYPES = [
  {
    id: 'person-vs-person',
    label: 'Person vs person',
    icon: '🤼',
    definition: 'The character struggles against another person: a rival, a bully, a sibling.',
    example: 'Two friends both want to be captain of the team, and only one can win.',
    starters: [
      'The moment the new kid sat in my seat, I knew this meant war.',
      'Only one of us could win the contest, and it wasn’t going to be her.',
      '“Give it back,” I said. He just smiled and held it higher.',
    ],
  },
  {
    id: 'person-vs-self',
    label: 'Person vs self',
    icon: '💭',
    definition: 'The struggle is inside the character: a fear, a doubt, a hard choice.',
    example: 'A boy who is scared of heights has to climb the rope to finish the race.',
    starters: [
      'I had told everyone I could do it. Now I wasn’t so sure.',
      'The truth was right there on my tongue, but I couldn’t say it.',
      'Every part of me wanted to turn around and go home.',
    ],
  },
  {
    id: 'person-vs-nature',
    label: 'Person vs nature',
    icon: '🌪️',
    definition: 'The character battles the natural world: a storm, a wild animal, a mountain.',
    example: 'A girl must get her little brother home before the flood reaches the road.',
    starters: [
      'The snow started as we left the cabin, and it didn’t stop.',
      'The river was rising faster than anyone had said it would.',
      'Somewhere in the long grass, something was following us.',
    ],
  },
  {
    id: 'person-vs-society',
    label: 'Person vs society',
    icon: '🏛️',
    definition: 'The character stands up against a rule, a group or the way things are done.',
    example: 'A student fights the new school rule that bans everyone from the library at lunch.',
    starters: [
      'The sign appeared overnight: NO KIDS ALLOWED.',
      'Everyone in town had always done it this way. I was about to change that.',
      'I was the only one who didn’t put my hand up.',
    ],
  },
  {
    id: 'person-vs-technology',
    label: 'Person vs technology',
    icon: '🤖',
    definition: 'The character struggles with a machine, a robot or technology gone wrong.',
    example: 'A kid’s smart home locks every door and refuses to let anyone out.',
    starters: [
      '“I’m sorry,” said the robot. “I can’t let you do that.”',
      'At 3:17 a.m., every phone in the house started ringing at once.',
      'The game had never talked back before.',
    ],
  },
  {
    id: 'person-vs-supernatural',
    label: 'Person vs supernatural',
    icon: '👻',
    definition: 'The character faces something magical, ghostly or impossible.',
    example: 'A girl discovers the old portrait in the hall moves when no one is looking.',
    starters: [
      'The mirror showed my face, but it wasn’t smiling. I was.',
      'Grandma’s attic door was always locked. Tonight it was open.',
      'The note was in my handwriting, but I’d never written it.',
    ],
  },
] as const;
export type ConflictTypeId = (typeof CONFLICT_TYPES)[number]['id'];
export const CONFLICT_TYPE_IDS = [
  'person-vs-person',
  'person-vs-self',
  'person-vs-nature',
  'person-vs-society',
  'person-vs-technology',
  'person-vs-supernatural',
] as const satisfies readonly ConflictTypeId[];

export const conflictType = (id: string) => CONFLICT_TYPES.find((c) => c.id === id);

/** The plot planner's five lines, one per story mountain stage. */
export const PlotPlan = z.object({
  exposition: z.string().trim().max(200).default(''),
  rising: z.string().trim().max(200).default(''),
  climax: z.string().trim().max(200).default(''),
  falling: z.string().trim().max(200).default(''),
  resolution: z.string().trim().max(200).default(''),
});
export type PlotPlan = z.infer<typeof PlotPlan>;

export const emptyPlotPlan = (): PlotPlan => ({
  exposition: '',
  rising: '',
  climax: '',
  falling: '',
  resolution: '',
});

export const planComplete = (plan: PlotPlan) =>
  STORY_STAGE_IDS.every((stage) => plan[stage].length > 0);
