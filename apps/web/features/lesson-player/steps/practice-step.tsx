'use client';

import type { LessonActivity, LessonSteps } from '@storyforge/shared';
import { useState } from 'react';
import { Button, ErrorMessage } from '@/components/ui';
import { ApiError } from '@/lib/api-client';
import { Highlight } from '../activities/highlight';
import { MultipleChoice } from '../activities/multiple-choice';
import { Quiz } from '../activities/quiz';
import { ReflectionActivity } from '../activities/reflection-activity';
import { Sequence } from '../activities/sequence';
import { SensoryLab } from '../activities/sensory-lab';
import { Sort } from '../activities/sort';
import { Transform } from '../activities/transform';
import type { ActivityResult } from '../activities/types';
import { ExtraPractice } from '../tutor/extra-practice';
import type { StepProps } from './step-props';

type Practice = LessonSteps[2];

/** Practice activities one after another; the step is saved when all are done. */
export function PracticeStep({
  step,
  done,
  busy,
  onComplete,
  activities,
  lessonId,
}: StepProps<Practice> & { activities: Record<string, LessonActivity>; lessonId: string }) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Record<string, ActivityResult>>({});
  const [replaying, setReplaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** After a tricky activity: offer extra practice before moving on. */
  const [offer, setOffer] = useState<{ key: string; advance: () => void } | null>(null);
  const [extra, setExtra] = useState<string | null>(null);
  const save = (body: object) =>
    onComplete(body).catch((e: unknown) =>
      setError(e instanceof ApiError ? e.userMessage : 'Could not save. Try again.'),
    );
  const key = step.activityKeys[index];
  const activity = key ? activities[key] : undefined;

  const practiceKeys = step.activityKeys.filter((k) => {
    const a = activities[k];
    // Marked quizzes have no extra practice (their questions are a test).
    return a && a.type !== 'REFLECTION' && a.type !== 'QUIZ';
  });

  if (extra) {
    return (
      <ExtraPractice
        lessonId={lessonId}
        activityKey={extra}
        onFinish={() => {
          setExtra(null);
          offer?.advance();
        }}
      />
    );
  }

  if (offer) {
    return (
      <div className="flex flex-col gap-4 rounded-2xl border border-brand/40 bg-background p-5">
        <p className="text-lg">
          <span aria-hidden="true">🦉 </span>That one was tricky! Quill can give you a few more
          questions like it.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => setExtra(offer.key)}>
            Practise more with Quill
          </Button>
          <Button onClick={offer.advance}>Keep going</Button>
        </div>
      </div>
    );
  }

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
        {practiceKeys.length > 0 && (
          <div className="flex flex-col gap-2 border-t border-border pt-4">
            <p className="font-semibold">
              <span aria-hidden="true">🦉 </span>Extra practice with Quill
            </p>
            <div className="flex flex-wrap gap-2">
              {practiceKeys.map((k) => (
                <Button key={k} variant="secondary" onClick={() => setExtra(k)}>
                  {activities[k]?.title}
                </Button>
              ))}
            </div>
          </div>
        )}
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
        lessonId={lessonId}
        activity={activity}
        onDone={(result) => {
          const next = { ...results, [key]: result };
          setResults(next);
          const advance = () => {
            setOffer(null);
            if (index < step.activityKeys.length - 1) setIndex(index + 1);
            else void save(summary(step.activityKeys, next));
          };
          // More attempts than questions means some answers were wrong.
          const baseline =
            activity.type === 'MULTIPLE_CHOICE'
              ? activity.questions.length
              : activity.type === 'TRANSFORM'
                ? activity.items.length
                : 1;
          if (
            activity.type !== 'REFLECTION' &&
            activity.type !== 'QUIZ' &&
            result.attempts > baseline
          ) {
            setOffer({ key, advance });
          } else {
            advance();
          }
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
  lessonId,
  activity,
  onDone,
}: {
  lessonId: string;
  activity: LessonActivity;
  onDone: (r: ActivityResult) => void;
}) {
  switch (activity.type) {
    case 'MULTIPLE_CHOICE':
      return <MultipleChoice activity={activity} onDone={onDone} />;
    case 'SORT':
      return <Sort activity={activity} onDone={onDone} />;
    case 'HIGHLIGHT':
      return <Highlight activity={activity} onDone={onDone} />;
    case 'SEQUENCE':
      return <Sequence activity={activity} onDone={onDone} />;
    case 'SENSORY_LAB':
      return <SensoryLab activity={activity} onDone={onDone} />;
    case 'QUIZ':
      return <Quiz lessonId={lessonId} activity={activity} onDone={onDone} />;
    case 'TRANSFORM':
      return <Transform activity={activity} onDone={onDone} />;
    case 'REFLECTION':
      return <ReflectionActivity activity={activity} onDone={onDone} />;
    default:
      return <ErrorMessage message="This activity type can't be practised here." />;
  }
}
