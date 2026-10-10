import { anchorQuote } from './anchor.js';
import type { CharacterReadResult } from './analyzers/character-read.js';
import type { SensoryResult } from './analyzers/sensory.js';
import type { ShowVsTellResult } from './analyzers/show-vs-tell.js';
import type { RubricScoreResult } from './analyzers/rubric-score.js';

/** A feedback point shown to the student, anchored to their text when it quotes it. */
export interface FeedbackPoint {
  title: string;
  message: string;
  quote?: string;
  start?: number;
  end?: number;
}

function anchored(text: string, point: FeedbackPoint, quote: string | null | undefined) {
  if (!quote) return point;
  const at = anchorQuote(text, quote);
  // A point that relies on a quote we can't find is dropped (never shown unanchored).
  if (!at) return null;
  return { ...point, quote: text.slice(at.start, at.end), start: at.start, end: at.end };
}

const isPoint = (p: FeedbackPoint | null): p is FeedbackPoint => p !== null;

export function showVsTellPoints(text: string, r: ShowVsTellResult) {
  return {
    strengths: r.showingHighlights
      .slice(0, 2)
      .map((h) => anchored(text, { title: 'You showed it', message: h.why }, h.quote))
      .filter(isPoint),
    nextSteps: r.tellingSentences
      .slice(0, 3)
      .map((t) =>
        anchored(
          text,
          { title: `Show the feeling (${t.feelingNamed})`, message: t.showingIdea },
          t.quote,
        ),
      )
      .filter(isPoint),
  };
}

export function sensoryPoints(text: string, r: SensoryResult) {
  const used = (Object.entries(r.senses) as [string, { count: number; bestQuote: string | null }][])
    .filter(([, f]) => f.count > 0)
    .toSorted((a, b) => b[1].count - a[1].count);
  const best = used[0];
  const strengths = best
    ? [
        anchored(
          text,
          {
            title: `Strong ${best[0]} detail`,
            message: `You used ${used.length} ${used.length === 1 ? 'sense' : 'senses'}: ${used.map(([s]) => s).join(', ')}.`,
          },
          best[1].bestQuote,
        ) ?? {
          title: `${used.length} senses`,
          message: `You used ${used.map(([s]) => s).join(', ')}.`,
        },
      ]
    : [];
  return {
    strengths,
    nextSteps: r.missing.length > 0 ? [{ title: 'Add another sense', message: r.suggestion }] : [],
  };
}

export function rubricPoints(text: string, r: RubricScoreResult) {
  return {
    strengths: r.strengths
      .slice(0, 2)
      .map((s) => anchored(text, { title: 'Strong moment', message: s.comment }, s.quote))
      .filter(isPoint),
    nextSteps: r.nextSteps
      .slice(0, 3)
      .map((n) =>
        anchored(
          text,
          {
            title: 'Next step',
            message: n.exampleIdea ? `${n.action} Example idea: ${n.exampleIdea}` : n.action,
          },
          n.quote,
        ),
      )
      .filter(isPoint),
  };
}

/** "Can your reader tell?": shown traits as strengths, traits not yet shown (and an unclear want or fear) as next steps. */
export function characterReadPoints(text: string, r: CharacterReadResult, checkWantFear: boolean) {
  const strengths: FeedbackPoint[] = [];
  const nextSteps: FeedbackPoint[] = [];
  for (const t of r.targets) {
    if (t.inferred) {
      const point = anchored(
        text,
        {
          title: `Your reader can tell: ${t.trait} ✓`,
          message: 'You showed it without naming it.',
        },
        t.quote,
      );
      strengths.push(
        point ?? {
          title: `Your reader can tell: ${t.trait} ✓`,
          message: 'You showed it without naming it.',
        },
      );
    } else {
      nextSteps.push({
        title: `Not yet clear: ${t.trait}`,
        message:
          t.idea ??
          `You could try an action or a line of dialogue that shows your character is ${t.trait}.`,
      });
    }
  }
  if (checkWantFear) {
    if (!r.want.clear) {
      nextSteps.push({
        title: 'What do they want?',
        message:
          'You could try one sentence that shows what your character wants more than anything.',
      });
    }
    if (!r.fear.clear) {
      nextSteps.push({
        title: 'What do they fear?',
        message:
          'You could try a moment where your character worries about something, or avoids it.',
      });
    }
  }
  if (r.targets.length === 0) {
    for (const o of r.otherTraits.slice(0, 2)) {
      const point = anchored(
        text,
        { title: `A reader sees: ${o.trait}`, message: 'This detail shows who your character is.' },
        o.quote,
      );
      if (point) strengths.push(point);
    }
  }
  return { strengths: strengths.slice(0, 3), nextSteps: nextSteps.slice(0, 3) };
}
