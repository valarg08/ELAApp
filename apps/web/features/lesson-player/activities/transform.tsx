'use client';

import { type LessonActivity, transformMatches } from '@storyforge/shared';
import { useId, useState } from 'react';
import { Button } from '@/components/ui';
import { focusOnMount } from './focus';
import type { ActivityResult } from './types';

type Activity = Extract<LessonActivity, { type: 'TRANSFORM' }>;

/** Wrong tries before the answer can be shown. */
const REVEAL_AFTER = 3;

/**
 * The transformer (DESIGN.md §9.12): rewrite each sentence by the rule (another tense, passive or
 * active, reported speech, formal). Each wrong try shows the next hint; after three, the student
 * can see an answer.
 */
export function Transform({
  activity,
  onDone,
}: {
  activity: Activity;
  onDone: (r: ActivityResult) => void;
}) {
  const id = useId();
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [wrong, setWrong] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [state, setState] = useState<'trying' | 'solved' | 'revealed'>('trying');
  const item = activity.items[index];
  if (!item) return null;
  const isLast = index === activity.items.length - 1;
  const hint = wrong > 0 ? item.hints[Math.min(wrong, item.hints.length) - 1] : undefined;

  function check() {
    if (!item || !answer.trim()) return;
    setAttempts((n) => n + 1);
    if (transformMatches(answer, item.answers)) setState('solved');
    else setWrong((n) => n + 1);
  }

  function next() {
    if (isLast) {
      onDone({ correct: true, attempts: Math.max(attempts, activity.items.length) });
      return;
    }
    setIndex(index + 1);
    setAnswer('');
    setWrong(0);
    setState('trying');
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted">{activity.instructions}</p>
      {activity.items.length > 1 && (
        <p className="text-sm font-semibold text-muted">
          Sentence {index + 1} of {activity.items.length}
        </p>
      )}
      <p className="text-lg font-semibold">{item.task}</p>
      <blockquote className="rounded-xl border-l-4 border-brand bg-card px-4 py-3 text-lg">
        {item.source}
      </blockquote>
      <div className="flex flex-col gap-2">
        <label htmlFor={`${id}-answer`} className="font-semibold">
          Your rewrite
        </label>
        <textarea
          id={`${id}-answer`}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          readOnly={state !== 'trying'}
          rows={2}
          spellCheck
          className="rounded-xl border-2 border-border bg-card px-4 py-3 text-lg focus-visible:border-brand focus-visible:outline-none"
        />
        {state === 'trying' && !answer && (
          <Button variant="secondary" className="self-start" onClick={() => setAnswer(item.source)}>
            Start from the sentence
          </Button>
        )}
      </div>

      <div aria-live="polite">
        {state === 'solved' && (
          <p className="rounded-xl border border-ok bg-card px-4 py-3">
            <strong className="text-ok">✓ Yes!</strong> {item.explanation}
          </p>
        )}
        {state === 'revealed' && (
          <p className="rounded-xl border border-warn bg-card px-4 py-3">
            One answer: <strong>{item.answers[0]}</strong> {item.explanation}
          </p>
        )}
        {state === 'trying' && wrong > 0 && (
          <p className="rounded-xl border border-warn bg-card px-4 py-3">
            Not quite. {hint ?? 'Read the rule again and try once more.'}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {state === 'trying' ? (
          <>
            <Button onClick={check} disabled={!answer.trim()}>
              Check
            </Button>
            {wrong >= REVEAL_AFTER && (
              <Button variant="secondary" onClick={() => setState('revealed')}>
                Show me an answer
              </Button>
            )}
          </>
        ) : (
          <Button ref={focusOnMount} onClick={next}>
            {isLast ? 'Done' : 'Next sentence'}
          </Button>
        )}
      </div>
    </div>
  );
}
