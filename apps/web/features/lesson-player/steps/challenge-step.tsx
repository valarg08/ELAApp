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

type Challenge = LessonSteps[3];

/**
 * The writing challenge: the prompt plus the writing workspace. After submitting, the student stays
 * here to read Quill's feedback and can revise and resubmit before moving on.
 */
export function ChallengeStep({
  step,
  activities,
  activityId,
  onSubmitted,
  done,
  onContinue,
}: {
  step: Challenge;
  activities: Record<string, LessonActivity>;
  activityId: string;
  onSubmitted: (result: SubmitResponse) => void;
  /** The challenge step is complete (submitted at least once). */
  done: boolean;
  onContinue: () => void;
}) {
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
