'use client';

import { type FeedbackPoint, SubmissionFeedback } from '@storyforge/shared';
import type { Span } from '@storyforge/writing-analysis';
import { useEffect, useState } from 'react';
import { apiJson } from '@/lib/api-client';

const POLL_MS = 4000;
const MAX_POLLS = 60;

/**
 * AI feedback on the latest submitted version (DESIGN.md §8.1). Polls while Quill is still
 * reading; shows the holding / teacher-approval messages instead of feedback when needed.
 */
export function FeedbackPanel({
  submissionId,
  version,
  text,
  onShow,
}: {
  submissionId: string;
  /** The submitted version; a new submit reloads the feedback. */
  version: number;
  /** Current editor text, to know whether quoted words are still in place. */
  text: string;
  onShow: (span: Span) => void;
}) {
  const [feedback, setFeedback] = useState<SubmissionFeedback | null>(null);

  useEffect(() => {
    let live = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let polls = 0;
    const load = async () => {
      try {
        const next = await apiJson(
          `/submissions/${encodeURIComponent(submissionId)}/feedback`,
          SubmissionFeedback,
        );
        if (!live) return;
        setFeedback(next);
        if (next.state === 'pending' && polls < MAX_POLLS) {
          polls += 1;
          timer = setTimeout(() => void load(), POLL_MS);
        }
      } catch {
        if (live && polls < MAX_POLLS) {
          polls += 1;
          timer = setTimeout(() => void load(), POLL_MS * 2);
        }
      }
    };
    void load();
    return () => {
      live = false;
      clearTimeout(timer);
    };
    // version is the reload trigger: a new submit means new feedback.
    // oxlint-disable-next-line react/exhaustive-effect-dependencies
  }, [submissionId, version]);

  if (!feedback || feedback.state === 'none') return null;

  return (
    <section
      aria-labelledby="ai-feedback-title"
      className="flex flex-col gap-3 rounded-xl border border-brand/40 bg-background p-4"
    >
      <h2 id="ai-feedback-title" className="text-xl font-bold">
        <span aria-hidden="true">🦉 </span>Feedback from Quill
        {feedback.version !== null && (
          <span className="text-base font-normal text-muted"> · version {feedback.version}</span>
        )}
      </h2>
      <div aria-live="polite" className="flex flex-col gap-3">
        {feedback.state === 'pending' && (
          <p className="flex items-center gap-2 text-muted">
            <span
              className="inline-block size-3 animate-pulse rounded-full bg-brand"
              aria-hidden="true"
            />
            {feedback.message}
          </p>
        )}
        {(feedback.state === 'held' ||
          feedback.state === 'awaiting-teacher' ||
          feedback.state === 'failed') && <p>{feedback.message}</p>}
        {feedback.state === 'ready' && (
          <>
            {feedback.summary && <p className="text-lg">{feedback.summary}</p>}
            <Points
              title="🌟 What’s working"
              points={feedback.strengths}
              text={text}
              onShow={onShow}
            />
            <Points
              title="💡 Try next"
              points={feedback.nextSteps}
              text={text}
              onShow={onShow}
              numbered
            />
            {feedback.nextSteps.length > 0 && (
              <p className="text-sm text-muted">
                Want to make it even better? Try one next step, then press “Submit again”.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export function Points({
  title,
  points,
  text,
  onShow,
  numbered = false,
}: {
  title: string;
  points: FeedbackPoint[];
  text: string;
  onShow: (span: Span) => void;
  numbered?: boolean;
}) {
  if (points.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-semibold">{title}</h3>
      <ul className="flex flex-col gap-2">
        {points.map((p, i) => {
          const located =
            p.quote !== undefined &&
            p.start !== undefined &&
            p.end !== undefined &&
            text.slice(p.start, p.end) === p.quote;
          return (
            <li
              key={`${i}-${p.title}-${p.start ?? ''}`}
              className="rounded-xl border border-border bg-card p-3"
            >
              <p className="font-semibold">
                {numbered && (
                  <span className="text-muted">
                    {i + 1}/{points.length}{' '}
                  </span>
                )}
                {p.title}
              </p>
              {p.quote && <p className="mt-1 text-muted italic">“{p.quote}”</p>}
              <p className="mt-1">{p.message}</p>
              {located && p.quote !== undefined && p.start !== undefined && p.end !== undefined && (
                <button
                  type="button"
                  onClick={() => onShow({ start: p.start!, end: p.end!, text: p.quote! })}
                  className="mt-2 text-sm font-semibold text-brand underline focus-visible:outline-3 focus-visible:outline-brand"
                >
                  Show me in my writing
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
