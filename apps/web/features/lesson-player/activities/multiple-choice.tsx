'use client';

import type { ActivityContent } from '@storyforge/shared';
import { useState } from 'react';
import { Button } from '@/components/ui';
import type { ActivityResult } from './types';

type Activity = Extract<ActivityContent, { type: 'MULTIPLE_CHOICE' }>;

/** One question at a time. After two wrong tries the answer is shown, then the student picks it. */
export function MultipleChoice({
  activity,
  onDone,
}: {
  activity: Activity;
  onDone: (r: ActivityResult) => void;
}) {
  const [qIndex, setQIndex] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const [wrongTries, setWrongTries] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [solved, setSolved] = useState(false);
  const question = activity.questions[qIndex];
  if (!question) return null;
  const isLast = qIndex === activity.questions.length - 1;
  const reveal = wrongTries >= 2;

  function check() {
    if (!choice || !question) return;
    setAttempts((n) => n + 1);
    if (choice === question.correctOptionId) setSolved(true);
    else setWrongTries((n) => n + 1);
  }

  function next() {
    if (isLast) {
      onDone({ correct: true, attempts: Math.max(attempts, activity.questions.length) });
      return;
    }
    setQIndex(qIndex + 1);
    setChoice(null);
    setWrongTries(0);
    setSolved(false);
  }

  const name = `${activity.key}-${question.id}`;
  return (
    <div className="flex flex-col gap-4">
      <fieldset className="flex flex-col gap-3" disabled={solved}>
        <legend className="mb-2 text-lg font-semibold">
          {activity.questions.length > 1 && (
            <span className="mr-2 text-sm text-muted">
              Question {qIndex + 1} of {activity.questions.length}
            </span>
          )}
          {question.prompt}
        </legend>
        {question.options.map((o) => {
          const highlight = (solved || reveal) && o.id === question.correctOptionId;
          return (
            <label
              key={o.id}
              className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border-2 bg-card px-4 py-3 transition has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-brand ${
                highlight ? 'border-ok' : choice === o.id ? 'border-brand' : 'border-border'
              }`}
            >
              <input
                type="radio"
                name={name}
                value={o.id}
                checked={choice === o.id}
                onChange={() => setChoice(o.id)}
                className="h-5 w-5 accent-brand"
              />
              <span>{o.text}</span>
            </label>
          );
        })}
      </fieldset>

      <div aria-live="polite">
        {solved ? (
          <p className="rounded-xl border border-ok bg-card px-4 py-3">
            <strong className="text-ok">✓ Yes!</strong> {question.explanation}
          </p>
        ) : wrongTries > 0 ? (
          <p className="rounded-xl border border-warn bg-card px-4 py-3">
            {reveal
              ? `The answer is highlighted in green. ${question.explanation}`
              : `Not quite. ${question.hint ?? 'Read it again and try once more.'}`}
          </p>
        ) : null}
      </div>

      {solved ? (
        <Button onClick={next} className="self-start">
          {isLast ? 'Done' : 'Next question'}
        </Button>
      ) : (
        <Button onClick={check} disabled={!choice} className="self-start">
          Check
        </Button>
      )}
    </div>
  );
}
