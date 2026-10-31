'use client';

import { BLANK, type LessonActivity, blankMatches } from '@storyforge/shared';
import { useId, useState } from 'react';
import { Button } from '@/components/ui';
import { focusOnMount } from './focus';
import type { ActivityResult } from './types';

type Activity = Extract<LessonActivity, { type: 'FILL_BLANK' }>;

/** Wrong tries before the answer can be shown. */
const REVEAL_AFTER = 2;

/**
 * Fill the blank (DESIGN.md §9.12): one sentence at a time. Pick a word from the choices, or type
 * it when there are none. A wrong try shows the hint; after two, the student can see the answer.
 */
export function FillBlank({
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
  const choices = item.choices ?? activity.choices;
  const isLast = index === activity.items.length - 1;
  const [before, after] = item.sentence.split(BLANK);
  const shown = state === 'revealed' ? item.answers[0] : answer;

  function check(value = answer) {
    if (!item || !value.trim()) return;
    setAttempts((n) => n + 1);
    if (blankMatches(value, item.answers)) setState('solved');
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
      <p className="rounded-xl border border-border bg-card px-4 py-4 text-xl leading-loose">
        {before}
        <span
          className={`mx-1 inline-block min-w-20 rounded-md border-b-4 px-2 text-center font-semibold ${
            state === 'solved'
              ? 'border-ok text-ok'
              : state === 'revealed'
                ? 'border-warn'
                : 'border-brand'
          }`}
        >
          {shown || <span className="sr-only">blank</span>}
          {!shown && <span aria-hidden="true">&nbsp;</span>}
        </span>
        {after}
      </p>

      {state === 'trying' &&
        (choices ? (
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 font-semibold">Choose the word for the blank</legend>
            <div className="flex flex-wrap gap-2">
              {choices.map((c) => (
                <Button
                  key={c}
                  variant="secondary"
                  aria-pressed={answer === c}
                  onClick={() => {
                    setAnswer(c);
                    check(c);
                  }}
                >
                  {c}
                </Button>
              ))}
            </div>
          </fieldset>
        ) : (
          <form
            key={index}
            className="flex flex-wrap items-end gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              check();
            }}
          >
            <div className="flex flex-col gap-1">
              <label htmlFor={`${id}-answer`} className="font-semibold">
                Word for the blank
              </label>
              <input
                ref={focusOnMount}
                id={`${id}-answer`}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                className="rounded-xl border-2 border-border bg-card px-4 py-2 text-lg focus-visible:border-brand focus-visible:outline-none"
              />
            </div>
            <Button type="submit" disabled={!answer.trim()}>
              Check
            </Button>
          </form>
        ))}

      <div aria-live="polite">
        {state === 'solved' && (
          <p className="rounded-xl border border-ok bg-card px-4 py-3">
            <strong className="text-ok">✓ Yes!</strong> {item.explanation}
          </p>
        )}
        {state === 'revealed' && (
          <p className="rounded-xl border border-warn bg-card px-4 py-3">
            The answer is <strong>{item.answers[0]}</strong>. {item.explanation}
          </p>
        )}
        {state === 'trying' && wrong > 0 && (
          <p className="rounded-xl border border-warn bg-card px-4 py-3">
            Not quite. {item.hint ?? 'Read the whole sentence again and try once more.'}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {state === 'trying' ? (
          wrong >= REVEAL_AFTER && (
            <Button variant="secondary" onClick={() => setState('revealed')}>
              Show me the answer
            </Button>
          )
        ) : (
          <Button ref={focusOnMount} onClick={next}>
            {isLast ? 'Done' : 'Next sentence'}
          </Button>
        )}
      </div>
    </div>
  );
}
