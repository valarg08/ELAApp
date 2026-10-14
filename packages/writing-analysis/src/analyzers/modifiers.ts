import { type Span, type WordToken, sentences, words } from '../text.js';
import type { GrammarIssue } from './grammar.js';
import { verbHits } from './verbs.js';
import { EMOTION_WORDS } from './word-choice.js';

/**
 * Adjectives and adverbs for the Essay Writing track (Unit 3, DESIGN.md §9.12): find adjectives,
 * comparatives, superlatives and adverbs that tell how, when and where; spot comparison mistakes
 * ("more taller", "gooder", "the tallest of the two"), "did good" and "ran quick", and suggest one
 * strong word for "very + adjective". Word lists and patterns, no parser: a guide, never a rule.
 */

export const MODIFIER_FEATURES = [
  'adjective',
  'comparative',
  'superlative',
  'adverb-how',
  'adverb-when',
  'adverb-where',
] as const;
export type ModifierFeature = (typeof MODIFIER_FEATURES)[number];

export const MODIFIER_FEATURE_LABELS: Record<ModifierFeature, string> = {
  adjective: 'an adjective',
  comparative: 'a comparative',
  superlative: 'a superlative',
  'adverb-how': 'an adverb that tells how',
  'adverb-when': 'an adverb that tells when',
  'adverb-where': 'an adverb that tells where',
};

export const MODIFIER_FEATURE_EXAMPLES: Record<ModifierFeature, string> = {
  adjective: 'a word that describes a noun, like enormous, silver or ancient',
  comparative: 'a word that compares two things, like taller, faster or more careful',
  superlative: 'the most of three or more, like tallest, best or most careful',
  'adverb-how': 'how it happened, like quickly, carefully or well',
  'adverb-when': 'when it happened, like yesterday, soon, later or finally',
  'adverb-where': 'where it happened, like here, outside, upstairs or everywhere',
};

const set = (s: string) => new Set(s.split(/\s+/).filter(Boolean));

/** Adjectives that compare with -er/-est (big, bigger, biggest). */
const SHORT =
  set(`big small tall short long fast slow old young new hot cold warm cool dark bright light
loud quiet soft hard strong weak rich poor clean dirty happy sad mad glad kind mean nice brave calm wild wise
smart quick thick thin wide deep high low fresh sweet sour rough smooth sharp dull tough tight loose late
early busy easy funny pretty ugly heavy angry hungry noisy lazy lucky silly scary tiny crazy sleepy messy shiny
dusty cloudy sunny rainy windy snowy icy juicy salty spicy tasty fluffy muddy foggy stormy cheap fat flat
great proud fair rare safe firm fierce large pale plain clever simple gentle narrow shallow neat dry wet cute
bold brief cheap close damp deadly fine grand green huge rude slim steep sticky strange thirsty wealthy`);
/** Adjectives that compare with more/most (beautiful, more beautiful, most beautiful). */
const LONG =
  set(`beautiful careful colorful colourful powerful peaceful helpful wonderful dangerous famous nervous
curious delicious generous expensive important interesting exciting boring amazing confusing surprising
frightening comfortable difficult different intelligent patient confident brilliant elegant modern popular
successful creative active attractive impressive mysterious adventurous ridiculous gorgeous anxious cautious
jealous serious careless useless hopeful thankful graceful stressful painful playful cheerful fearful
delightful honest handsome excited tired bored scared frightened worried annoyed relaxed talented valuable
useful horrible terrible incredible enormous ancient magnificent fantastic dramatic energetic realistic
challenging tiring relaxing satisfying disgusting fascinating peculiar unusual obvious efficient convenient`);
const IRREGULAR_COMPARE: Record<string, [string, string]> = {
  good: ['better', 'best'],
  well: ['better', 'best'],
  bad: ['worse', 'worst'],
  badly: ['worse', 'worst'],
  far: ['farther', 'farthest'],
  little: ['less', 'least'],
  many: ['more', 'most'],
  much: ['more', 'most'],
};

/** big → [bigger, biggest]; happy → [happier, happiest]; nice → [nicer, nicest]. */
function compareForms(adj: string): [string, string] {
  const irregular = IRREGULAR_COMPARE[adj];
  if (irregular) return irregular;
  if (adj.endsWith('e')) return [`${adj}r`, `${adj}st`];
  if (/[^aeiou]y$/.test(adj)) return [`${adj.slice(0, -1)}ier`, `${adj.slice(0, -1)}iest`];
  if (/^[^aeiou]*[aeiou][^aeiouwxy]$/.test(adj)) {
    return [`${adj}${adj.at(-1)}er`, `${adj}${adj.at(-1)}est`];
  }
  return [`${adj}er`, `${adj}est`];
}

/** Each comparative and superlative form → its adjective. */
const COMPARATIVE = new Map<string, string>();
const SUPERLATIVE = new Map<string, string>();
for (const adj of [...SHORT, ...Object.keys(IRREGULAR_COMPARE)]) {
  const [er, est] = compareForms(adj);
  if (!COMPARATIVE.has(er)) COMPARATIVE.set(er, adj);
  if (!SUPERLATIVE.has(est)) SUPERLATIVE.set(est, adj);
}
for (const [er, est, adj] of [
  ['further', 'furthest', 'far'],
  ['fewer', 'fewest', 'few'],
  ['littler', 'littlest', 'little'],
] as const) {
  COMPARATIVE.set(er, adj);
  SUPERLATIVE.set(est, adj);
}
// "more" and "most" compare too, but on their own they are about amounts ("more time").
COMPARATIVE.delete('more');
SUPERLATIVE.delete('most');

const COLOURS_AND_MORE =
  set(`red blue green yellow purple orange pink brown black white grey gray golden silver
wooden metal rusty creaky crooked fuzzy slimy gloomy eerie vivid empty full broken frozen soggy shimmering
gigantic massive miniature enormous glowing ancient spotless filthy furious exhausted thrilled terrified
gentle crisp fragile hollow jagged smoky misty dim faint fierce graceful clumsy eager lonely lovely friendly
silent awful perfect correct proper polite rude calm wild clear serious real certain sure possible impossible
favorite favourite whole own special different same main entire tired upset alive afraid alone asleep awake
complete formal informal`);
/** Endings that usually make an adjective. */
const ADJECTIVE_ENDING = /^[a-z]{3,}(?:ful|ous|less|able|ible|ive)$/;
const NOT_ADJECTIVE =
  set(`unless nevertheless bless arrive survive forgive receive believe deceive perceive
achieve relieve thrive strive deprive derive detective olive motive table cable vegetable timetable constable
stable`);

/** -ly words that are not adverbs, and -ly adverbs that tell when or how much instead of how. */
const NOT_LY =
  set(`family friendly lonely lovely ugly silly holy only july reply supply apply fly belly jelly
rally ally bully italy lily sly rely curly hilly chilly oily wobbly elderly likely unlikely lively costly deadly
cowardly orderly early jolly woolly smelly bubbly prickly sickly assembly butterfly dragonfly monopoly comply
imply multiply ghostly scaly holly sully tally rely`);
const DEGREE =
  set(`very really quite rather too so extremely totally completely absolutely nearly almost hardly
barely mostly slightly fairly incredibly truly especially entirely partly only just even also simply actually
probably definitely certainly possibly maybe perhaps clearly obviously surely luckily unfortunately fortunately
basically literally seriously honestly hopefully apparently`);
const HOW = set('well fast hard together alone aloud straight');
const WHEN =
  set(`yesterday today tomorrow tonight now then soon later already finally afterwards afterward
eventually immediately recently lately always never often sometimes usually rarely seldom daily weekly monthly
yearly nightly frequently occasionally instantly shortly previously currently earlier`);
/** "late" and "early" tell when after a verb ("arrived late"), but describe before a noun. */
const WHEN_AFTER_VERB = set('late early before yet');
const WHERE =
  set(`here everywhere somewhere anywhere nowhere upstairs downstairs indoors outdoors nearby
abroad overhead underground backward backwards forward forwards upward upwards downward downwards uphill
downhill elsewhere ashore aboard ahead away`);
/** Where words that can also start a phrase ("outside the gym"): an adverb only when a phrase doesn't follow. */
const WHERE_OR_PHRASE = set(
  'outside inside behind below above around underneath beneath there home',
);
const TIME_NOUNS =
  set(`night week weekend month year morning afternoon evening summer winter spring fall autumn
monday tuesday wednesday thursday friday saturday sunday`);
const DESCRIBERS = set(
  'a an the this that these those my your our their his her its every each some',
);
const BE = set("am is are was were be been being isn't aren't wasn't weren't 's");
/** After an adverb, words like these can follow; after an adjective, usually a noun does. */
const AFTER_ADVERB =
  set(`at in on with for to from during today yesterday tonight tomorrow this last and but
or so because when while than as again too all together until after before if then now`);
/** Verbs that link to a description ("went quiet", "stayed calm", "turned red"), so an adjective is right. */
const LINKING_LIKE =
  set(`go goes went gone going get gets got gotten getting grow grows grew grown growing turn
turns turned turning stay stays stayed staying keep keeps kept keeping remain remains remained become becomes
became seem seems seemed feel feels felt look looks looked sound sounds sounded smell smells smelled taste
tastes tasted appear appears appeared lie lies lay lain sit sits sat stand stands stood rest rests rested hold
holds held come comes came prove proves proved fall falls fell fallen make makes made break breaks broke`);
/** Verbs that can take an object and then a description of it ("made him angry", "kept the room quiet"). */
const COMPLEMENT_VERBS =
  set(`make makes made keep keeps kept find finds found leave leaves left want wants wanted
like likes liked prefer prefers preferred consider considered call calls called paint painted push pushed pull
pulled set sets get gets got hold holds held drive drives drove turn turns turned believe believed`);
const INTENSIFIERS = set('very really so too pretty super real extremely');

/** quick → quickly, happy → happily, gentle → gently, terrible → terribly. */
function lyForm(adj: string): string {
  if (/[^aeiou]y$/.test(adj)) return `${adj.slice(0, -1)}ily`;
  if (/[^aeiou]le$/.test(adj)) return `${adj.slice(0, -1)}y`;
  if (adj.endsWith('ic')) return `${adj}ally`;
  return `${adj}ly`;
}
/** Adjectives students often use where an adverb belongs ("ran quick", "talked quiet"). */
const NEEDS_LY =
  set(`quick quiet slow careful loud soft nervous angry happy sad bad easy polite rude calm brave
proud patient safe silent gentle terrible honest correct smooth careless beautiful awful serious clear
neat eager graceful confident cheerful nice proper sudden`);

/** One strong word for "very + adjective" (first choice, second choice). */
const STRONGER: Record<string, [string, string]> = {
  big: ['huge', 'enormous'],
  large: ['huge', 'massive'],
  small: ['tiny', 'miniature'],
  little: ['tiny', 'minuscule'],
  happy: ['delighted', 'overjoyed'],
  sad: ['miserable', 'heartbroken'],
  tired: ['exhausted', 'drained'],
  good: ['excellent', 'superb'],
  bad: ['terrible', 'awful'],
  cold: ['freezing', 'icy'],
  hot: ['scorching', 'boiling'],
  scared: ['terrified', 'petrified'],
  afraid: ['terrified', 'petrified'],
  angry: ['furious', 'livid'],
  mad: ['furious', 'livid'],
  fast: ['rapid', 'speedy'],
  quick: ['swift', 'rapid'],
  quiet: ['silent', 'hushed'],
  loud: ['deafening', 'thunderous'],
  hungry: ['starving', 'ravenous'],
  thirsty: ['parched', 'dry'],
  old: ['ancient', 'worn'],
  pretty: ['beautiful', 'gorgeous'],
  beautiful: ['stunning', 'gorgeous'],
  smart: ['brilliant', 'clever'],
  clever: ['brilliant', 'ingenious'],
  funny: ['hilarious', 'comical'],
  surprised: ['astonished', 'amazed'],
  clean: ['spotless', 'gleaming'],
  dirty: ['filthy', 'grimy'],
  important: ['essential', 'crucial'],
  nice: ['kind', 'pleasant'],
  easy: ['effortless', 'simple'],
  hard: ['difficult', 'exhausting'],
  difficult: ['demanding', 'gruelling'],
  wet: ['soaked', 'drenched'],
  dry: ['parched', 'bone-dry'],
  bright: ['dazzling', 'brilliant'],
  dark: ['pitch-black', 'gloomy'],
  strong: ['powerful', 'mighty'],
  weak: ['feeble', 'frail'],
  interesting: ['fascinating', 'gripping'],
  boring: ['dull', 'tedious'],
  sure: ['certain', 'positive'],
  ugly: ['hideous', 'grotesque'],
  rich: ['wealthy', 'prosperous'],
  tall: ['towering', 'lofty'],
  thin: ['skinny', 'slender'],
  full: ['packed', 'crammed'],
  crowded: ['packed', 'jammed'],
  empty: ['deserted', 'bare'],
  excited: ['thrilled', 'ecstatic'],
  nervous: ['anxious', 'jittery'],
  worried: ['anxious', 'frantic'],
  shy: ['timid', 'bashful'],
  slow: ['sluggish', 'unhurried'],
  heavy: ['hefty', 'weighty'],
  sharp: ['razor-sharp', 'keen'],
  soft: ['silky', 'velvety'],
  smooth: ['sleek', 'glassy'],
  long: ['endless', 'lengthy'],
  short: ['brief', 'stubby'],
  calm: ['peaceful', 'serene'],
  brave: ['fearless', 'heroic'],
  kind: ['generous', 'caring'],
  mean: ['cruel', 'nasty'],
  tasty: ['delicious', 'mouth-watering'],
  dangerous: ['perilous', 'treacherous'],
  different: ['unusual', 'unique'],
  many: ['countless', 'numerous'],
  quickly: ['rapidly', 'swiftly'],
  slowly: ['sluggishly', 'gradually'],
  carefully: ['cautiously', 'gingerly'],
  quietly: ['silently', 'softly'],
};
/** "the very first", "very well", "very much": not a weak "very". */
const VERY_OK = set('first last same end beginning top bottom best least most much well own few');

const EMOTIONS = new Set<string>(EMOTION_WORDS);
const isLyAdverb = (w: string) => /^[a-z]{4,}ly$/.test(w) && !NOT_LY.has(w);
/** An adjective by list or ending (comparatives and superlatives count as adjectives too). */
export const isAdjective = (w: string) =>
  SHORT.has(w) ||
  LONG.has(w) ||
  COLOURS_AND_MORE.has(w) ||
  EMOTIONS.has(w) ||
  COMPARATIVE.has(w) ||
  SUPERLATIVE.has(w) ||
  (ADJECTIVE_ENDING.test(w) && !NOT_ADJECTIVE.has(w));

const spanOf = (text: string, a: WordToken, b: WordToken = a): Span => ({
  start: a.start,
  end: b.end,
  text: text.slice(a.start, b.end),
});

/** Nothing (or punctuation) after the word, or a word that starts a new phrase. */
function endsHere(text: string, tokens: readonly WordToken[], i: number): boolean {
  const next = tokens[i + 1];
  if (!next) return true;
  const gap = text.slice(tokens[i]!.end, next.start);
  if (/^\s*,\s*$/.test(gap) && isAdjective(next.lower)) return false;
  if (/[,;:.!?)—–-]/.test(gap)) return true;
  return AFTER_ADVERB.has(next.lower);
}

/** The index of the word before `i`, skipping intensifiers ("ran really quick"). */
function before(tokens: readonly WordToken[], i: number): number {
  let j = i - 1;
  while (j >= 0 && INTENSIFIERS.has(tokens[j]!.lower)) j--;
  return j;
}

export interface ModifierHit {
  feature: ModifierFeature;
  span: Span;
}

/** Adjective and adverb features in one sentence's words. */
export function modifierHits(text: string, tokens: readonly WordToken[]): ModifierHit[] {
  const hits: ModifierHit[] = [];
  const add = (feature: ModifierFeature, span: Span) => hits.push({ feature, span });
  const actions = new Set(
    verbHits(text, tokens)
      .filter((h) => h.feature === 'action-verb')
      .map((h) => h.span.start),
  );
  const afterVerb = (i: number) => {
    const v = tokens[before(tokens, i)];
    return v !== undefined && (actions.has(v.start) || BE.has(v.lower));
  };
  tokens.forEach((t, i) => {
    const w = t.lower;
    const prev = tokens[i - 1];
    const next = tokens[i + 1];
    const afterDescriber = prev !== undefined && DESCRIBERS.has(prev.lower);

    // Comparatives and superlatives: taller, more careful, the best, the most famous.
    if (COMPARATIVE.has(w) && !(w === 'less' && next && !isAdjective(next.lower))) {
      add('comparative', spanOf(text, t));
    } else if (/^[a-z]{3,}er$/.test(w) && next?.lower === 'than' && !afterDescriber) {
      add('comparative', spanOf(text, t));
    }
    if (
      (w === 'more' || w === 'less') &&
      next &&
      (isAdjective(next.lower) || isLyAdverb(next.lower))
    ) {
      add('comparative', spanOf(text, t, next));
    }
    if (SUPERLATIVE.has(w) && w !== 'least') add('superlative', spanOf(text, t));
    if (
      (w === 'most' || w === 'least') &&
      next &&
      (isAdjective(next.lower) || isLyAdverb(next.lower))
    ) {
      add('superlative', spanOf(text, t, next));
    }

    // Adjectives: by list or ending ("kind of" and "I mean" aside).
    const flatAdverb =
      (HOW.has(w) || WHEN_AFTER_VERB.has(w)) && afterVerb(i) && !BE.has(prev?.lower ?? '');
    if (
      isAdjective(w) &&
      !flatAdverb &&
      !(w === 'kind' && next?.lower === 'of') &&
      !(w === 'mean' && prev && /^(?:i|you|we|they|to)$/.test(prev.lower)) &&
      !(prev?.lower === 'to' && !afterDescriber)
    ) {
      add('adjective', spanOf(text, t));
    }

    // Adverbs: how, when, where.
    if ((isLyAdverb(w) && !DEGREE.has(w) && !WHEN.has(w)) || (HOW.has(w) && !isAdjective(w))) {
      add('adverb-how', spanOf(text, t));
    } else if (HOW.has(w) && flatAdverb) {
      add('adverb-how', spanOf(text, t));
    }
    if (WHEN.has(w) || (WHEN_AFTER_VERB.has(w) && afterVerb(i) && endsHere(text, tokens, i))) {
      add('adverb-when', spanOf(text, t));
    }
    // "last night", "next week", "this morning" (not "the last night").
    if (/^(?:last|next|this)$/.test(w) && next && TIME_NOUNS.has(next.lower) && !afterDescriber) {
      add('adverb-when', spanOf(text, t, next));
    }
    if (WHERE.has(w)) add('adverb-where', spanOf(text, t));
    else if (WHERE_OR_PHRASE.has(w)) {
      // "There was a dog" points at nothing; "home" is a place only after a verb ("ran home").
      const existential =
        w === 'there' &&
        next !== undefined &&
        /^(?:is|are|was|were|'s|will|has|have|had|seems|seemed|must|might|could|should|would)$/.test(
          next.lower,
        );
      const phraseFollows =
        next !== undefined &&
        !/[,;:.!?)]/.test(text.slice(t.end, next.start)) &&
        !AFTER_ADVERB.has(next.lower) &&
        !WHEN.has(next.lower);
      const homeOk = w !== 'home' || (prev !== undefined && actions.has(prev.start));
      if (!existential && !afterDescriber && homeOk && (w === 'there' || !phraseFollows)) {
        add('adverb-where', spanOf(text, t));
      }
    }
  });
  return hits;
}

// ───────── Mistakes ─────────

/** Made-up comparisons → the right form ("gooder" → better, "beautifuller" → more beautiful). */
const WRONG_FORMS = new Map<string, string>([
  ['gooder', 'better'],
  ['goodest', 'best'],
  ['badder', 'worse'],
  ['baddest', 'worst'],
  ['worser', 'worse'],
  ['worsest', 'worst'],
  ['bestest', 'best'],
  ['betterer', 'better'],
  ['funner', 'more fun'],
  ['funnest', 'most fun'],
  ['manyer', 'more'],
  ['muchier', 'more'],
  ['lesser', 'less'],
]);
for (const adj of LONG) {
  const stem = adj.endsWith('e') ? adj.slice(0, -1) : adj;
  // "beautifuler" and "beautifuller"
  const doubled = /[aeiou][lnt]$/.test(stem) ? `${stem}${stem.at(-1)}` : stem;
  for (const form of new Set([stem, doubled])) {
    WRONG_FORMS.set(`${form}er`, `more ${adj}`);
    WRONG_FORMS.set(`${form}est`, `most ${adj}`);
  }
}
// "lesser" is a real word ("the lesser of two evils").
WRONG_FORMS.delete('lesser');
/** One-syllable (and -y) adjectives that take -er/-est, so "more tall" is wrong. */
const TAKES_ER = new Set(
  [...SHORT].filter(
    (a) =>
      !/^(?:real|sure|clever|simple|gentle|narrow|shallow|deadly|wealthy|thirsty|sticky|strange|fierce|proud|close|fine|huge)$/.test(
        a,
      ),
  ),
);

/** Comparison mistakes, "did good", "ran quick" and "real quick". */
export function findModifierIssues(text: string): GrammarIssue[] {
  const issues: GrammarIssue[] = [];
  for (const s of sentences(text)) {
    const tokens = words(text, s.start, s.end);
    const actions = new Set(
      verbHits(text, tokens)
        .filter((h) => h.feature === 'action-verb')
        .map((h) => h.span.start),
    );
    tokens.forEach((t, i) => {
      const w = t.lower;
      const prev = tokens[i - 1];
      const next = tokens[i + 1];
      const p = prev?.lower ?? '';

      // "gooder", "beautifuller", "more funner".
      const wrong = WRONG_FORMS.get(w);
      if (wrong) {
        const span = p === 'more' || p === 'most' ? spanOf(text, prev!, t) : spanOf(text, t);
        issues.push({
          kind: 'wrong-comparison',
          span,
          fix: wrong,
          message: /^(?:more|most) /.test(wrong)
            ? `Long describing words compare with “more” and “most”, not -er and -est: “${wrong}”.`
            : `“${t.text}” isn’t a word. The right form is “${wrong}”.`,
        });
        return;
      }

      // "more taller", "most biggest", "more better": only one way of comparing.
      const double =
        (p === 'more' || p === 'most') && (COMPARATIVE.has(w) || SUPERLATIVE.has(w))
          ? p === 'more'
            ? COMPARATIVE.has(w)
              ? w
              : compareForms(SUPERLATIVE.get(w)!)[0]
            : SUPERLATIVE.has(w)
              ? w
              : compareForms(COMPARATIVE.get(w)!)[1]
          : undefined;
      if (double && w !== 'less' && w !== 'least' && w !== 'fewer') {
        issues.push({
          kind: 'double-comparison',
          span: spanOf(text, prev!, t),
          fix: double,
          message: `Compare only once: “${t.text}” already compares, so drop “${p}”. Use “${double}”.`,
        });
        return;
      }

      // "more tall than", "the most big": short words take -er and -est.
      if (
        (p === 'more' || p === 'most') &&
        TAKES_ER.has(w) &&
        (next?.lower === 'than' ||
          endsHere(text, tokens, i) ||
          (p === 'most' && tokens[i - 2]?.lower === 'the'))
      ) {
        const [er, est] = compareForms(w);
        const fix = p === 'more' ? er : est;
        issues.push({
          kind: 'comparison-form',
          span: spanOf(text, prev!, t),
          fix,
          message: `Short describing words add -er or -est instead of “${p}”: “${fix}”.`,
        });
        return;
      }

      // "biggest than", "most famous than": comparing two things needs the comparative.
      if (next?.lower === 'than' && (SUPERLATIVE.has(w) || (p === 'most' && isAdjective(w)))) {
        const adj = SUPERLATIVE.get(w);
        const fix = p === 'most' ? `more ${t.text}` : compareForms(adj!)[0];
        issues.push({
          kind: 'comparison-form',
          span: p === 'most' ? spanOf(text, prev!, t) : spanOf(text, t),
          fix,
          message: `“Than” compares two things, so use the comparative: “${fix} than”. Save “${p === 'most' ? 'most' : '-est'}” for three or more.`,
        });
        return;
      }
      // "the tallest of the two": two things → the comparative.
      if (
        (SUPERLATIVE.has(w) || (p === 'most' && isAdjective(w))) &&
        next?.lower === 'of' &&
        tokens[i + 2]?.lower === 'the' &&
        tokens[i + 3]?.lower === 'two'
      ) {
        const adj = SUPERLATIVE.get(w);
        const fix = p === 'most' ? `more ${t.text}` : compareForms(adj!)[0];
        issues.push({
          kind: 'comparison-form',
          span: p === 'most' ? spanOf(text, prev!, t) : spanOf(text, t),
          fix,
          message: `With only two, use the comparative: “the ${fix} of the two”. Superlatives (-est, most) are for three or more.`,
        });
        return;
      }

      // "real quick", "real good" → really.
      if (
        w === 'real' &&
        next &&
        (isAdjective(next.lower) || isLyAdverb(next.lower) || HOW.has(next.lower))
      ) {
        issues.push({
          kind: 'real-really',
          span: spanOf(text, t),
          fix: 'really',
          message: `“Real” describes a noun (“a real diamond”). To make “${next.text}” stronger, use the adverb “really”, or pick one stronger word.`,
        });
        return;
      }

      // "She sings good", "He ran quick": after an action verb, use the adverb.
      // (Not a word in quotes, like the word “happy”, or after punctuation: “dripped, slow and steady”.)
      if (/["“'‘]\s*$/.test(text.slice(s.start, t.start))) return;
      const v = tokens[before(tokens, i)];
      const goes = v !== undefined && /^(?:go|goes|went|gone|going)$/.test(v.lower);
      const afterAction =
        v !== undefined &&
        actions.has(v.start) &&
        !/[,;:.!?—–]/.test(text.slice(v.end, t.start)) &&
        (!LINKING_LIKE.has(v.lower) || (w === 'good' && goes));
      if (v && afterAction && endsHere(text, tokens, i) && w === 'good') {
        issues.push({
          kind: 'good-well',
          span: spanOf(text, t),
          fix: 'well',
          message: `“Good” is an adjective: it describes a noun (a good game). To tell how someone or something ${v.text}, use the adverb “well”.`,
        });
        return;
      }
      // "He ate his lunch quick": the verb, its object, then the describing word at the end.
      const o = tokens[i - 3];
      const withObject =
        o !== undefined &&
        actions.has(o.start) &&
        !LINKING_LIKE.has(o.lower) &&
        !COMPLEMENT_VERBS.has(o.lower) &&
        DESCRIBERS.has(tokens[i - 2]!.lower) &&
        !isAdjective(prev!.lower) &&
        !/[,;:.!?—–]/.test(text.slice(o.end, t.start)) &&
        endsHere(text, tokens, i);
      if (NEEDS_LY.has(w) && ((afterAction && endsHere(text, tokens, i)) || withObject)) {
        const verb = (afterAction ? v : o)!;
        const fix = lyForm(w);
        issues.push({
          kind: 'adjective-for-adverb',
          span: spanOf(text, t),
          fix,
          message: `This word tells how someone or something ${verb.text}, so it’s an adverb: “${fix}”. Adverbs that tell how usually end in -ly.`,
        });
      }
    });
  }
  return issues;
}

/** "very big" → huge: one strong word instead of "very" or "really" + a describing word. */
export function veryPhrases(text: string): GrammarIssue[] {
  const issues: GrammarIssue[] = [];
  for (const s of sentences(text)) {
    const tokens = words(text, s.start, s.end);
    tokens.forEach((t, i) => {
      if (t.lower !== 'very' && t.lower !== 'really') return;
      // "very, very big": look past a repeated "very".
      let j = i + 1;
      while (tokens[j]?.lower === 'very') j++;
      const word = tokens[j];
      if (!word || VERY_OK.has(word.lower) || tokens[i - 1]?.lower === 'very') return;
      const strong = STRONGER[word.lower];
      if (!strong && !(t.lower === 'very' && (isAdjective(word.lower) || isLyAdverb(word.lower)))) {
        return;
      }
      issues.push({
        kind: 'weak-very',
        span: spanOf(text, t, word),
        fix: strong?.[0],
        message: strong
          ? `One strong word beats “${t.lower} ${word.lower}”. Try “${strong[0]}” or “${strong[1]}”.`
          : `One strong word beats “${t.lower} ${word.lower}”. Is there a single word that says it more exactly?`,
      });
    });
  }
  return issues;
}
