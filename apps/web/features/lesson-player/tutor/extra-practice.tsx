'use client';

import { ExtraPracticeResponse } from '@storyforge/shared';
import { useEffect, useState } from 'react';
import { Button, ErrorMessage } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';
import { MultipleChoice } from '../activities/multiple-choice';

/**
 * Extra practice from Quill: a few new questions on the same skill. Optional, so it never blocks
 * the lesson; `onFinish` returns to where the student was.
 */
export function ExtraPractice({
  lessonId,
  activityKey,
  onFinish,
}: {
  lessonId: string;
  activityKey: string;
  onFinish: () => void;
}) {
  const [practice, setPractice] = useState<ExtraPracticeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [round, setRound] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let live = true;
    apiJson('/ai/practice', ExtraPracticeResponse, 'POST', { lessonId, activityKey })
      .then((next) => {
        if (!live) return;
        setPractice(next);
        setFinished(false);
      })
      .catch((e: unknown) => {
        if (live) setError(e instanceof ApiError ? e.userMessage : 'Could not reach Quill.');
      });
    return () => {
      live = false;
    };
    // round asks for a fresh set.
    // oxlint-disable-next-line react/exhaustive-effect-dependencies
  }, [lessonId, activityKey, round]);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-brand/40 bg-background p-5">
      <p className="font-semibold">
        <span aria-hidden="true">🦉 </span>Extra practice with Quill
      </p>
      <ErrorMessage message={error} />
      {!practice && !error && <p className="text-muted">Quill is writing some questions…</p>}
      {practice && !finished && (
        <MultipleChoice
          key={`${round}-${practice.activity.key}`}
          activity={practice.activity}
          onDone={() => setFinished(true)}
        />
      )}
      {(finished || error) && (
        <div className="flex flex-wrap items-center gap-3">
          {finished && <p className="font-semibold text-ok">✓ Nice work!</p>}
          {!error && (
            <Button
              variant="secondary"
              onClick={() => {
                setPractice(null);
                setRound((r) => r + 1);
              }}
            >
              More questions
            </Button>
          )}
          <Button onClick={onFinish}>Back to the lesson</Button>
        </div>
      )}
      {!finished && !error && (
        <Button variant="secondary" className="self-start" onClick={onFinish}>
          Skip
        </Button>
      )}
    </div>
  );
}
