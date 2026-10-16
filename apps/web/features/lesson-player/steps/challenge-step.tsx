'use client';

import {
  type LessonActivity,
  type LessonSteps,
  SubmissionDetail,
  type SubmitResponse,
  isWritingActivity,
} from '@storyforge/shared';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button, ErrorMessage } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';
import { ActivityPrompt } from '@/features/writing/activity-prompt';
import { WritingWorkspace } from '@/features/writing/writing-workspace';
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
 * Math, a marked problem set (DESIGN.md §9.13).
 */
export function ChallengeStep(props: ChallengeProps) {
  const activity = props.activities[props.step.activityKey];
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
