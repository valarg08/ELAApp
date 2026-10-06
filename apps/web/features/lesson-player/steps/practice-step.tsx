'use client';

import type { ActivityContent, LessonSteps } from '@storyforge/shared';
import { useState } from 'react';
import { Button, ErrorMessage } from '@/components/ui';
import { ApiError } from '@/lib/api-client';
import { Highlight } from '../activities/highlight';
import { MultipleChoice } from '../activities/multiple-choice';
import { ReflectionActivity } from '../activities/reflection-activity';
import { Sort } from '../activities/sort';
import type { ActivityResult } from '../activities/types';
import type { StepProps } from './step-props';

type Practice = LessonSteps[2];

/** Practice activities one after another; the step is saved when all are done. */
export function PracticeStep({
  step,
  done,
  busy,
  onComplete,
  activities,
}: StepProps<Practice> & { activities: Record<string, ActivityContent> }) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Record<string, ActivityResult>>({});
  const [replaying, setReplaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const save = (body: object) =>
    onComplete(body).catch((e: unknown) =>
      setError(e instanceof ApiError ? e.userMessage : 'Could not save. Try again.'),
    );
  const key = step.activityKeys[index];
  const activity = key ? activities[key] : undefined;

  if (done && !replaying) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-lg">✓ You finished this practice. Want to try it again?</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setReplaying(true)}>
            Practice again
          </Button>
          <Button disabled={busy} onClick={() => void save(summary(step.activityKeys, {}))}>
            Next
          </Button>
        </div>
      </div>
    );
  }

  if (!activity || !key)
    return <ErrorMessage message="This activity is missing. Tell your teacher." />;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm font-semibold text-muted" aria-live="polite">
        Activity {Math.min(index + 1, step.activityKeys.length)} of {step.activityKeys.length} ·{' '}
        {activity.title}
      </p>
      <ActivityView
        key={key}
        activity={activity}
        onDone={(result) => {
          const next = { ...results, [key]: result };
          setResults(next);
          if (index < step.activityKeys.length - 1) setIndex(index + 1);
          else void save(summary(step.activityKeys, next));
        }}
      />
      <ErrorMessage message={error} />
    </div>
  );
}

function summary(keys: string[], results: Record<string, ActivityResult>) {
  return {
    results: keys.map((activityKey) => ({
      activityKey,
      correct: true,
      attempts: Math.max(1, results[activityKey]?.attempts ?? 1),
    })),
  };
}

function ActivityView({
  activity,
  onDone,
}: {
  activity: ActivityContent;
  onDone: (r: ActivityResult) => void;
}) {
  switch (activity.type) {
    case 'MULTIPLE_CHOICE':
      return <MultipleChoice activity={activity} onDone={onDone} />;
    case 'SORT':
      return <Sort activity={activity} onDone={onDone} />;
    case 'HIGHLIGHT':
      return <Highlight activity={activity} onDone={onDone} />;
    case 'REFLECTION':
      return <ReflectionActivity activity={activity} onDone={onDone} />;
    default:
      return <ErrorMessage message="This activity type can't be practised here." />;
  }
}
