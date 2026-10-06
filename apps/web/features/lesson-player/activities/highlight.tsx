'use client';

import type { ActivityContent } from '@storyforge/shared';
import { useState } from 'react';
import { Button } from '@/components/ui';
import { scoreSelection, splitWords } from '@/lib/tokens';
import type { ActivityResult } from './types';

type Activity = Extract<ActivityContent, { type: 'HIGHLIGHT' }>;

/** Tap words in a passage. After two misses the right words are outlined. */
export function Highlight({
  activity,
  onDone,
}: {
  activity: Activity;
  onDone: (r: ActivityResult) => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  const parts = splitWords(activity.text);
  const targets = new Set(activity.targets.map((t) => t.toLowerCase()));
  const reveal = !solved && attempts >= 2;

  function toggle(word: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(word)) next.delete(word);
      else next.add(word);
      return next;
    });
    setFeedback(null);
  }

  function check() {
    setAttempts((n) => n + 1);
    const score = scoreSelection(selected, activity.targets);
    if (score.correct) {
      setSolved(true);
      setFeedback(null);
    } else {
      setFeedback(
        `You found ${score.found.length} of ${targets.size}.${score.extra.length ? ` "${score.extra.join('", "')}" ${score.extra.length === 1 ? "isn't one" : "aren't"} of them.` : ''} Try again!`,
      );
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg">{activity.instructions}</p>
      <p className="rounded-xl border border-border bg-card p-4 text-xl leading-loose">
        {parts.map((p) =>
          p.word ? (
            <button
              key={p.index}
              type="button"
              onClick={() => toggle(p.word ?? '')}
              disabled={solved}
              aria-pressed={selected.has(p.word)}
              className={`rounded px-0.5 transition focus-visible:outline-2 focus-visible:outline-brand ${
                selected.has(p.word)
                  ? solved
                    ? 'bg-ok/20 font-semibold text-ok'
                    : 'bg-brand text-white'
                  : reveal && targets.has(p.word)
                    ? 'underline decoration-ok decoration-4 underline-offset-4'
                    : 'hover:bg-border'
              }`}
            >
              {p.text}
            </button>
          ) : (
            <span key={p.index}>{p.text}</span>
          ),
        )}
      </p>

      <div aria-live="polite">
        {solved ? (
          <p className="rounded-xl border border-ok bg-card px-4 py-3">
            <strong className="text-ok">✓ You got them all!</strong> {activity.explanation}
          </p>
        ) : feedback ? (
          <p className="rounded-xl border border-warn bg-card px-4 py-3">
            {feedback} {reveal && 'The words to find are underlined in green.'}
          </p>
        ) : null}
      </div>

      {solved ? (
        <Button className="self-start" onClick={() => onDone({ correct: true, attempts })}>
          Done
        </Button>
      ) : (
        <Button className="self-start" onClick={check} disabled={selected.size === 0}>
          Check
        </Button>
      )}
    </div>
  );
}
