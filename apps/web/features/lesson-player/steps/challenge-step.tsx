'use client';

import {
  type LessonActivity,
  type LessonSteps,
  MathHome,
  SubmissionDetail,
  type SubmitResponse,
  isWritingActivity,
} from '@storyforge/shared';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button, ButtonLink, ErrorMessage } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';
import { ActivityPrompt } from '@/features/writing/activity-prompt';
import { WritingWorkspace } from '@/features/writing/writing-workspace';
import { MathText } from '@/components/math-text';
import { points } from '@/features/math/copy';
import { StartTest } from '@/features/math/test-player';
import { ProblemSet } from '../activities/problem-set';

type Challenge = LessonSteps[3];

interface ChallengeProps {
  step: Challenge;
  activities: Record<string, LessonActivity>;
  activityId: string;
  lessonId: string;
  onSubmitted: (result: SubmitResponse) => void;
  /** Save the step (a Math problem set, once handed in or passed). */
  onComplete: (body: object) => Promise<void>;
  /** The challenge step is complete (submitted at least once). */
  done: boolean;
  onContinue: () => void;
}

/**
 * The challenge: in Story and Essay Writing, the prompt plus the writing workspace (after
 * submitting, the student stays here to read Quill's feedback and can revise and resubmit); in
 * Math, a marked problem set (DESIGN.md §9.13) or a Unit 15 mock (math-design.md §4.15).
 */
export function ChallengeStep(props: ChallengeProps) {
  const activity = props.activities[props.step.activityKey];
  if (activity?.type === 'MOCK_TEST') {
    return (
      <MockChallenge
        lessonId={props.lessonId}
        activity={activity}
        done={props.done}
        onComplete={props.onComplete}
        onContinue={props.onContinue}
      />
    );
  }
  if (activity?.type === 'PROBLEM_SET') {
    return (
      <ProblemSetChallenge
        lessonId={props.lessonId}
        activity={activity}
        onComplete={props.onComplete}
      />
    );
  }
  return <WritingChallenge {...props} />;
}

function ProblemSetChallenge({
  lessonId,
  activity,
  onComplete,
}: {
  lessonId: string;
  activity: Extract<LessonActivity, { type: 'PROBLEM_SET' }>;
  onComplete: (body: object) => Promise<void>;
}) {
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-4">
      <ProblemSet
        lessonId={lessonId}
        activity={activity}
        doneLabel="Continue to Reflect →"
        onDone={() =>
          void onComplete({}).catch((e: unknown) =>
            setError(e instanceof ApiError ? e.userMessage : 'Could not save. Try again.'),
          )
        }
      />
      <ErrorMessage message={error} />
    </div>
  );
}

/**
 * A full mock AMC 10 (Unit 15): it runs in the test player with its server clock, then shows the
 * mistake analysis there. Back here, the step completes once an attempt is handed in.
 */
function MockChallenge({
  lessonId,
  activity,
  done,
  onComplete,
  onContinue,
}: {
  lessonId: string;
  activity: Extract<LessonActivity, { type: 'MOCK_TEST' }>;
  done: boolean;
  onComplete: (body: object) => Promise<void>;
  onContinue: () => void;
}) {
  const [card, setCard] = useState<MathHome['tests'][number] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let live = true;
    apiJson('/math/home', MathHome)
      .then((home) => {
        if (!live) return;
        const found = home.tests.find((t) => t.key === activity.test);
        if (found) setCard(found);
        else setError('This mock is missing. Tell your teacher.');
      })
      .catch((e: unknown) => {
        if (live)
          setError(e instanceof ApiError ? e.userMessage : 'Could not load the mock. Reload.');
      });
    return () => {
      live = false;
    };
  }, [activity.test]);

  async function finish() {
    setBusy(true);
    setError(null);
    try {
      await onComplete({});
    } catch (e) {
      setError(e instanceof ApiError ? e.userMessage : 'Could not save. Try again.');
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">{activity.title}</h2>
      <p className="text-lg">
        <MathText text={activity.instructions} />
      </p>
      <ErrorMessage message={error} />
      {card && (
        <>
          <p className="text-muted">
            {card.problemCount} problems
            {card.timeLimitMinutes ? `, ${card.timeLimitMinutes} minutes` : ''}. The clock runs on
            the server, so it keeps going if you leave the page; at zero the mock is handed in.
          </p>
          {card.best && (
            <p className="rounded-xl border border-border bg-card p-4">
              Your best so far:{' '}
              <strong>
                {points(card.best.points)} of {card.best.total * 6} points
              </strong>{' '}
              ({card.best.correct} of {card.best.total} right).
            </p>
          )}
          {!card.unlocked ? (
            <p className="rounded-2xl border border-dashed border-border p-5">
              {card.lockedReason ?? 'Not open yet.'}
            </p>
          ) : (
            <StartTest
              startKey={card.key}
              lessonId={lessonId}
              label={
                card.openAttemptId
                  ? 'Carry on'
                  : card.attempts > 0
                    ? 'Take it again'
                    : 'Start the mock'
              }
            />
          )}
          <div className="flex flex-wrap items-center gap-3">
            {card.lastAttemptId && (
              <ButtonLink
                href={`/math/attempts/${encodeURIComponent(card.lastAttemptId)}?lesson=${encodeURIComponent(lessonId)}`}
                variant="secondary"
              >
                My mistake analysis
              </ButtonLink>
            )}
            {done ? (
              <Button onClick={onContinue}>Continue to Reflect →</Button>
            ) : (
              card.attempts > 0 && (
                <Button disabled={busy} onClick={() => void finish()}>
                  {busy ? 'Saving…' : 'Continue to Reflect →'}
                </Button>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}

function WritingChallenge({
  step,
  activities,
  activityId,
  onSubmitted,
  done,
  onContinue,
}: ChallengeProps) {
  const activity = activities[step.activityKey];
  const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    apiJson('/submissions', SubmissionDetail, 'POST', { activityId })
      .then((s) => {
        if (live) setSubmission(s);
      })
      .catch((e: unknown) => {
        if (live)
          setError(
            e instanceof ApiError
              ? e.userMessage
              : 'Could not open your writing. Check your connection and reload.',
          );
      });
    return () => {
      live = false;
    };
  }, [activityId]);

  if (!activity || !isWritingActivity(activity)) {
    return <ErrorMessage message="This challenge is missing. Tell your teacher." />;
  }

  return (
    <div className="flex flex-col gap-5">
      <ActivityPrompt activity={activity} />
      <ErrorMessage message={error} />
      {submission ? (
        <>
          <WritingWorkspace submission={submission} onSubmitted={onSubmitted} />
          <div className="flex flex-wrap items-center gap-4">
            {done && <Button onClick={onContinue}>Continue to Reflect →</Button>}
            <Link href={`/write/${submission.id}`} className="text-brand underline">
              Open in full screen ↗
            </Link>
          </div>
        </>
      ) : (
        !error && <p className="text-muted">Opening your writing…</p>
      )}
    </div>
  );
}
