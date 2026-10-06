'use client';

import {
  type ActivityContent,
  type LessonSteps,
  checkConstraints,
  describeProblem,
  isWritingActivity,
} from '@storyforge/shared';
import { useState } from 'react';
import { Button, ErrorMessage } from '@/components/ui';
import { ApiError } from '@/lib/api-client';
import type { StepProps } from './step-props';

type Challenge = LessonSteps[3];

/**
 * The writing challenge. A simple text box for now; the full writing workspace (autosave, history,
 * coach panel) replaces it in Phase P3.
 */
export function ChallengeStep({
  step,
  done,
  busy,
  onComplete,
  activities,
  savedText,
}: StepProps<Challenge> & {
  activities: Record<string, ActivityContent>;
  savedText: string | null;
}) {
  const activity = activities[step.activityKey];
  const [text, setText] = useState(savedText ?? '');
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  if (!activity || !isWritingActivity(activity)) {
    return <ErrorMessage message="This challenge is missing. Tell your teacher." />;
  }

  const { constraints } = activity;
  const { wordCount, problems } = checkConstraints(text, constraints);
  const blocked = constraints.enforcement === 'hard' && problems.length > 0;
  const target =
    constraints.exactWords !== undefined
      ? `${constraints.exactWords} words exactly`
      : [
          constraints.minWords && `at least ${constraints.minWords}`,
          constraints.maxWords && `at most ${constraints.maxWords}`,
        ]
          .filter(Boolean)
          .join(', ');

  async function submit() {
    setServerErrors([]);
    try {
      await onComplete({ text });
    } catch (e) {
      if (e instanceof ApiError) setServerErrors(e.problem.errors ?? [e.userMessage]);
      else throw e;
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-sm font-semibold tracking-widest text-brand uppercase">
          ✍️ Writing challenge
        </p>
        <h2 className="mt-1 text-2xl font-bold">{activity.title}</h2>
        <p className="mt-2 text-lg">{activity.prompt}</p>
      </div>

      {activity.starter && (
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm font-semibold text-muted">Start from this:</p>
          <p className="mt-1 text-lg italic">{activity.starter}</p>
        </div>
      )}

      {activity.tips.length > 0 && (
        <details className="rounded-xl border border-border bg-card p-4">
          <summary className="cursor-pointer font-semibold">💡 Tips</summary>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {activity.tips.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </details>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="challenge-text" className="font-medium">
          Your writing
        </label>
        <textarea
          id="challenge-text"
          rows={constraints.exactWords !== undefined && constraints.exactWords <= 10 ? 3 : 10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-describedby="challenge-status"
          className="rounded-xl border border-border bg-card px-4 py-3 text-lg leading-relaxed focus-visible:outline-3 focus-visible:outline-brand"
        />
      </div>

      <div id="challenge-status" aria-live="polite" className="flex flex-col gap-2">
        <p className="text-sm text-muted">
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
          {target ? ` · goal: ${target}` : ''}
        </p>
        {text.trim().length > 0 && problems.length > 0 && (
          <ul className="list-disc space-y-1 pl-5 text-warn">
            {problems.map((p) => (
              <li key={p.rule}>{describeProblem(p)}</li>
            ))}
          </ul>
        )}
        {text.trim().length > 0 && problems.length === 0 && (
          <p className="font-semibold text-ok">✓ Ready to submit!</p>
        )}
      </div>

      {serverErrors.length > 0 && <ErrorMessage message={serverErrors.join(' ')} />}

      <Button
        className="self-start"
        disabled={busy || blocked || text.trim().length === 0}
        onClick={submit}
      >
        {busy ? 'Saving…' : done ? 'Save changes' : 'Submit'}
      </Button>
    </div>
  );
}
