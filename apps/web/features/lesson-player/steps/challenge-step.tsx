'use client';

import {
  type ActivityContent,
  type LessonSteps,
  SubmissionDetail,
  type SubmitResponse,
  isWritingActivity,
} from '@storyforge/shared';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ErrorMessage } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';
import { ActivityPrompt } from '@/features/writing/activity-prompt';
import { WritingWorkspace } from '@/features/writing/writing-workspace';

type Challenge = LessonSteps[3];

/** The writing challenge: the prompt plus the writing workspace for the student's working copy. */
export function ChallengeStep({
  step,
  activities,
  activityId,
  onSubmitted,
}: {
  step: Challenge;
  activities: Record<string, ActivityContent>;
  activityId: string;
  onSubmitted: (result: SubmitResponse) => void;
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
          <Link href={`/write/${submission.id}`} className="self-start text-brand underline">
            Open in full screen ↗
          </Link>
        </>
      ) : (
        !error && <p className="text-muted">Opening your writing…</p>
      )}
    </div>
  );
}
