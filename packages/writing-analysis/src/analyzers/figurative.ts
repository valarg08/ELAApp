import { type Span, narrationWords, sentenceAt, sentences, span, words } from '../text.js';

/**
 * Figurative language (Unit 6, DESIGN.md §10): similes, metaphors and personification, plus
 * well-worn clichés. Heuristics: similes are reliable ("like a", "as … as"); metaphors and
 * personification are found from common patterns and word lists, so the Coach says "looks like".
 */
export const DEVICES = ['simile', 'metaphor', 'personification'] as const;
export type Device = (typeof DEVICES)[number];
export const isDevice = (value: string): value is Device =>
  (DEVICES as readonly string[]).includes(value);

export interface DeviceHit {
  device: Device;
  /** The whole sentence it is in. */
  sentence: Span;
  /** The words that make it ("like a hungry wolf", "the wind whispered"). */
  span: Span;
}

const DETERMINERS = new Set(['a', 'an', 'the', 'some', 'my', 'his', 'her', 'their', 'our', 'your']);
/** "I'd like a", "would like the", "they like it": wanting, not comparing. */
// prettier-ignore
const WANT = new Set([
  "i'd", "we'd", "you'd", "they'd", "he'd", "she'd", 'would', 'i', 'we', 'you', 'they', 'he',
  'she', 'to', "don't", "didn't", "doesn't", 'really', 'also', 'just', 'people', 'kids', 'who',
]);
/** "like to", "like that": not a comparison when no determiner follows. */
const NOT_AFTER_LIKE = new Set([
  'to',
  'it',
  'that',
  'this',
  'when',
  'how',
  'what',
  'me',
  'him',
  'her',
  'them',
  'us',
  'you',
]);

/** Things that are often what a metaphor turns its subject into. Base forms only. */
// prettier-ignore
const METAPHOR_HEADS = new Set([
  'blanket', 'sea', 'ocean', 'river', 'wall', 'carpet', 'curtain', 'mountain', 'storm', 'fire',
  'jewel', 'prison', 'cage', 'maze', 'rollercoaster', 'zoo', 'oven', 'freezer', 'furnace',
  'desert', 'jungle', 'battlefield', 'symphony', 'monster', 'ghost', 'beast', 'giant', 'volcano',
  'tornado', 'star', 'diamond', 'mirror', 'ribbon', 'sheet', 'lion', 'mouse', 'snail', 'rocket',
  'bomb', 'machine', 'robot', 'puzzle', 'treasure', 'nightmare', 'dream', 'army', 'circus',
  'feast', 'island', 'tomb', 'blur', 'whirlwind', 'tidal', 'wave', 'flood', 'hurricane', 'magnet',
  'knife', 'dagger', 'thunderstorm', 'shadow', 'spider', 'snake', 'cheetah', 'statue', 'pillow',
  'cloud', 'sponge', 'sauna', 'icebox', 'fridge', 'fortress', 'castle', 'pearl', 'lighthouse',
]);

/** Things that aren't people (or animals that talk): the subjects of personification. */
// prettier-ignore
const NONHUMAN = new Set([
  'wind', 'sun', 'moon', 'star', 'tree', 'leaf', 'leaves', 'house', 'door', 'floor', 'floorboard',
  'stair', 'clock', 'car', 'engine', 'rain', 'snow', 'sea', 'wave', 'river', 'fire', 'flame',
  'city', 'night', 'storm', 'thunder', 'shadow', 'kettle', 'fridge', 'alarm', 'phone', 'book',
  'pencil', 'chair', 'window', 'flower', 'grass', 'cloud', 'fog', 'mist', 'mountain', 'ocean',
  'sky', 'darkness', 'silence', 'time', 'traffic', 'bus', 'train', 'road', 'street', 'town',
  'forest', 'field', 'ice', 'frost', 'candle', 'lamp', 'light', 'radio', 'oven', 'pan', 'pot',
  'computer', 'laptop', 'tv', 'television', 'bell', 'gate', 'fence', 'roof', 'chimney', 'branch',
  'breeze', 'waterfall', 'lake', 'volcano', 'earth', 'world', 'morning', 'dawn', 'dusk', 'winter',
  'summer', 'autumn', 'spring', 'washing', 'machine', 'toaster', 'curtain', 'bed', 'pillow',
  'stomach', 'hunger', 'fear', 'sadness', 'joy', 'hope', 'school', 'kitchen', 'garden', 'thunder',
]);

/** Words before a noun that make it "a thing" for personification. */
const THING_STARTERS = new Set([
  'the',
  'a',
  'an',
  'every',
  'each',
  'this',
  'that',
  'its',
  'our',
  'my',
]);
/** People and animals: their actions are literal, not personification. */
// prettier-ignore
const LIVING = new Set([
  'man', 'men', 'woman', 'women', 'boy', 'boys', 'girl', 'girls', 'kid', 'kids', 'child',
  'children', 'baby', 'people', 'person', 'teacher', 'teachers', 'mum', 'mom', 'dad', 'brother',
  'sister', 'friend', 'friends', 'class', 'crowd', 'team', 'family', 'grandma', 'grandpa',
  'neighbour', 'neighbor', 'doctor', 'nurse', 'driver', 'player', 'players', 'coach', 'cook',
  'dog', 'dogs', 'cat', 'cats', 'bird', 'birds', 'horse', 'cow', 'fox', 'mouse', 'rabbit',
  'puppy', 'kitten', 'owl', 'wolf', 'bear', 'monkey', 'parrot', 'goat', 'sheep', 'pig',
]);
const PRONOUNS = new Set(['i', 'you', 'he', 'she', 'we', 'they', 'me', 'him', 'her', 'us', 'them']);
// prettier-ignore
const PREPOSITIONS = new Set([
  'behind', 'in', 'on', 'at', 'under', 'over', 'from', 'with', 'of', 'to', 'into', 'onto', 'by',
  'near', 'beside', 'between', 'through', 'across', 'above', 'below', 'for', 'about',
]);
/** "its foot", "its breath": body parts given to things. */
// prettier-ignore
const BODY = new Set([
  'foot', 'feet', 'hand', 'hands', 'breath', 'arm', 'arms', 'eye', 'eyes', 'mouth', 'teeth',
  'finger', 'fingers', 'head', 'shoulders', 'heart', 'face', 'voice', 'tongue', 'belly',
]);

/** Things people do, feel or say. Base forms only (-s, -ed, -ing are matched). */
// prettier-ignore
const HUMAN_ACTIONS = new Set([
  'whisper', 'sing', 'sang', 'dance', 'groan', 'sigh', 'scream', 'laugh', 'weep', 'wept', 'cry',
  'cried', 'grab', 'creep', 'crept', 'wave', 'wink', 'smile', 'frown', 'complain', 'shout',
  'call', 'beg', 'hug', 'swallow', 'breathe', 'sleep', 'slept', 'wake', 'woke', 'yawn', 'march',
  'watch', 'stare', 'glare', 'mutter', 'grumble', 'moan', 'snore', 'cough', 'sneeze', 'chuckle',
  'giggle', 'kiss', 'tickle', 'embrace', 'invite', 'refuse', 'protest', 'shiver', 'tremble',
  'sulk', 'grin', 'nod', 'shrug', 'beckon', 'scold', 'tease', 'cheer', 'clap', 'wrap', 'cradle',
  'devour', 'gobble', 'chew', 'spit', 'gossip', 'chatter', 'argue', 'plead', 'promise', 'wait',
  'hide', 'hid', 'peek', 'peep', 'stretch', 'limp', 'stumble', 'stagger', 'tiptoe', 'hum',
  'howl', 'wail', 'roar', 'blink', 'weep', 'mourn', 'rest', 'dream', 'remember', 'forget',
  'forgot', 'know', 'knew', 'think', 'thought', 'want', 'hate', 'love', 'shrug', 'bow', 'kneel',
  'knelt', 'stand', 'stood', 'reach', 'clutch', 'lick', 'bite', 'bit', 'swallow', 'cough', 'tug',
]);

/** Comparisons used so often they've lost their surprise. */
// prettier-ignore
export const CLICHES = [
  'busy as a bee', 'cold as ice', 'quiet as a mouse', 'white as snow', 'light as a feather',
  'fast as lightning', 'old as the hills', 'like a fish out of water', 'strong as an ox',
  'brave as a lion', 'slept like a log', 'good as gold', 'like a kid in a candy shop',
  'sweet as sugar', 'blind as a bat', 'free as a bird', 'hard as a rock', 'happy as a clam',
  'pretty as a picture', 'dead as a doornail', 'flat as a pancake', 'cool as a cucumber',
  'like a bull in a china shop', 'clear as crystal', 'dry as a bone', 'fit as a fiddle',
  'like a deer in headlights', 'sick as a dog', 'tough as nails', 'big as a house',
  'black as night', 'red as a tomato', 'like a rock', 'like the wind', 'heart of gold',
  'time flies', 'like a ton of bricks', 'like a baby', 'like a pig',
] as const;

const lookupIn = (set: ReadonlySet<string>, word: string) => {
  if (set.has(word)) return true;
  for (const ending of ['ing', 'ed', 'es', 's', 'd']) {
    if (!word.endsWith(ending) || word.length - ending.length < 2) continue;
    const stem = word.slice(0, -ending.length);
    if (set.has(stem) || set.has(`${stem}e`) || set.has(stem.slice(0, -1))) return true;
  }
  return false;
};

export interface FigurativeResult {
  hits: DeviceHit[];
  counts: Record<Device, number>;
  /** Clichés found, with where they are. */
  cliches: { phrase: string; span: Span }[];
}

const MAX_HITS_PER_DEVICE = 6;

export function figurative(text: string): FigurativeResult {
  const all = sentences(text);
  const tokens = words(text);
  const narration = new Set(narrationWords(text).map((w) => w.start));
  const hits: DeviceHit[] = [];
  const counts: Record<Device, number> = { simile: 0, metaphor: 0, personification: 0 };
  const add = (device: Device, from: number, to: number) => {
    const sentence = sentenceAt(all, from);
    if (!sentence) return;
    // One device of each kind per sentence is enough.
    if (hits.some((h) => h.device === device && h.sentence.start === sentence.start)) return;
    counts[device] += 1;
    if (counts[device] <= MAX_HITS_PER_DEVICE)
      hits.push({ device, sentence, span: span(text, from, to) });
  };

  /** True when nothing ends the sentence between b and a. */
  const sameSentence = (a: { start: number }, b: { end: number }) =>
    !/[.!?…\n]/.test(text.slice(b.end, a.start));

  tokens.forEach((w, i) => {
    const next = tokens[i + 1];
    const prev = tokens[i - 1];
    // Simile: "like a …" (not "I'd like a …"), "as … as a …".
    if (
      w.lower === 'like' &&
      next &&
      sameSentence(next, w) &&
      !(prev && WANT.has(prev.lower)) &&
      (DETERMINERS.has(next.lower) || !NOT_AFTER_LIKE.has(next.lower))
    ) {
      // Up to five words of the comparison, within the clause.
      const tail = [5, 4, 3, 2]
        .map((k) => tokens[i + k])
        .find((t) => t && sameSentence(t, w) && !text.slice(w.end, t.start).includes(','));
      add('simile', w.start, (tail ?? next).end);
    }
    const asWord = tokens[i + 2];
    const vehicle = tokens[i + 3];
    if (w.lower === 'as' && asWord?.lower === 'as' && vehicle && next && sameSentence(vehicle, w)) {
      const end = DETERMINERS.has(vehicle.lower) ? (tokens[i + 4] ?? vehicle) : vehicle;
      add('simile', w.start, end.end);
    }
    // Metaphor: "was a [adj] HEAD", "a HEAD of …".
    if (
      ['is', 'was', 'were', 'are', 'became', 'becomes', 'felt'].includes(w.lower) &&
      next &&
      (next.lower === 'a' || next.lower === 'an')
    ) {
      const head = [tokens[i + 2], tokens[i + 3]].find(
        (t) => t && lookupIn(METAPHOR_HEADS, t.lower),
      );
      if (head && sameSentence(head, w)) add('metaphor', (prev ?? w).start, head.end);
    }
    if (
      (w.lower === 'a' || w.lower === 'an') &&
      prev?.lower !== 'like' &&
      prev?.lower !== 'as' &&
      next &&
      lookupIn(METAPHOR_HEADS, next.lower) &&
      tokens[i + 2]?.lower === 'of' &&
      tokens[i + 3]
    ) {
      add('metaphor', w.start, tokens[i + 3]!.end);
    }
    // Personification: "the wind whispered", "the old house groaned", "the chairs slide out and
    // gossip" (narration only). A thing is a known non-human word, or any noun after "the", "a",
    // "every"… that isn't a person or an animal.
    const thing =
      narration.has(w.start) &&
      !LIVING.has(w.lower) &&
      (lookupIn(NONHUMAN, w.lower) ||
        (prev !== undefined &&
          THING_STARTERS.has(prev.lower) &&
          !lookupIn(HUMAN_ACTIONS, w.lower)));
    if (thing) {
      for (let k = 1; k <= 4; k += 1) {
        const t = tokens[i + k];
        if (!t || !sameSentence(t, w) || text.slice(w.end, t.start).includes(',')) break;
        if (LIVING.has(t.lower) || PRONOUNS.has(t.lower) || PREPOSITIONS.has(t.lower)) break;
        // "the stand", "a wave": after "the" or "a" it's a noun, not an action.
        const before = tokens[i + k - 1];
        if (k > 1 && before && THING_STARTERS.has(before.lower)) continue;
        if (lookupIn(HUMAN_ACTIONS, t.lower)) {
          add('personification', w.start, t.end);
          break;
        }
      }
    }
    // "…taps its foot", "holds its breath": a thing with a body.
    if (w.lower === 'its' && next && BODY.has(next.lower) && prev) {
      add('personification', prev.start, next.end);
    }
  });

  const lower = text.toLowerCase().replaceAll('’', "'");
  const cliches = CLICHES.flatMap((phrase) => {
    const at = lower.indexOf(phrase);
    return at < 0 ? [] : [{ phrase, span: span(text, at, at + phrase.length) }];
  });
  return { hits: hits.toSorted((a, b) => a.span.start - b.span.start), counts, cliches };
}
