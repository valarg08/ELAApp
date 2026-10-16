'use client';

import {
  type LessonActivity,
  MATH_CONFIDENCE,
  type MathConfidence,
  type ProblemReviewItem,
  ProblemSetAttemptView,
  ProblemSetResult,
  ProblemSetStatus,
} from '@storyforge/shared';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Button, ErrorMessage } from '@/components/ui';
import { MathText } from '@/components/math-text';
import { MATH_COPY } from '@/features/math/copy';
import { ConfidenceChips } from '@/features/math/practice-tools';
import { ProblemView } from '@/features/math/problem-view';
import { QuillMath } from '@/features/math/quill-math';
import { ApiError, apiJson } from '@/lib/api-client';
import { focusOnMount } from './focus';
import type { ActivityResult } from './types';

type Activity = Extract<LessonActivity, { type: 'PROBLEM_SET' }>;

const message = (e: unknown, fallback: string) =>
  e instanceof ApiError ? e.userMessage : fallback;

const VERDICT = {
  correct: { label: '✓ Right', className: 'text-ok' },
  wrong: { label: '✗ Not right', className: 'text-warn' },
  form: { label: 'Right value, wrong form', className: 'text-warn' },
  blank: { label: 'Left blank', className: 'text-muted' },
} as const;

/**
 * A marked problem set (Math challenges and unit checks, DESIGN.md §9.13). The server hands out the
 * problems (no hints), marks them with math-check and adds every miss to the error log. Blanks are
 * allowed, as on the AMC. With a time limit, the set is handed in when time runs out.
 */
export function ProblemSet({
  lessonId,
  activity,
  onDone,
  doneLabel = 'Continue',
}: {
  lessonId: string;
  activity: Activity;
  onDone: (r: ActivityResult) => void;
  doneLabel?: string;
}) {
  const base = `/lessons/${encodeURIComponent(lessonId)}/problem-sets/${encodeURIComponent(activity.key)}`;
  const [status, setStatus] = useState<ProblemSetStatus | null>(null);
  const [attempt, setAttempt] = useState<ProblemSetAttemptView | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [confidence, setConfidence] = useState<Record<string, MathConfidence>>({});
  const [result, setResult] = useState<ProblemSetResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    apiJson(base, ProblemSetStatus)
      .then((s) => {
        if (live) setStatus(s);
      })
      .catch((e: unknown) => {
        if (live) setError(message(e, 'Could not load the problem set. Try again.'));
      });
    return () => {
      live = false;
    };
  }, [base]);

  async function start() {
    setBusy(true);
    setError(null);
    try {
      setAttempt(await apiJson(`${base}/attempts`, ProblemSetAttemptView, 'POST', {}));
      setAnswers({});
      setConfidence({});
      setResult(null);
    } catch (e) {
      setError(message(e, 'Could not start the set. Try again.'));
    } finally {
      setBusy(false);
    }
  }

  async function submit() {
    if (!attempt) return;
    setBusy(true);
    setError(null);
    try {
      const marked = await apiJson(
        `${base}/attempts/${encodeURIComponent(attempt.attemptId)}/submit`,
        ProblemSetResult,
        'POST',
        { answers, confidence },
      );
      setResult(marked);
      setAttempt(null);
      setStatus((s) =>
        s
          ? {
              ...s,
              attempts: s.attempts + 1,
              done: s.done || marked.passed,
              bestPercent: Math.max(s.bestPercent ?? 0, marked.percent),
              last: marked,
            }
          : s,
      );
    } catch (e) {
      setError(message(e, 'Could not mark the set. Try again.'));
    } finally {
      setBusy(false);
    }
  }

  const finish = () => onDone({ correct: true, attempts: Math.max(1, status?.attempts ?? 1) });

  if (!status) {
    return error ? (
      <ErrorMessage message={error} />
    ) : (
      <p className="text-muted">Loading the problem set…</p>
    );
  }

  if (attempt) {
    const answered = attempt.problems.filter((p) => answers[p.id]?.trim()).length;
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 ref={focusOnMount} tabIndex={-1} className="text-xl font-bold outline-none">
            {activity.title} · try {attempt.attemptNumber}
          </h2>
          {attempt.timeLimitMinutes && (
            <Countdown
              startedAt={attempt.startedAt}
              minutes={attempt.timeLimitMinutes}
              onEnd={() => void submit()}
            />
          )}
        </div>
        <ol className="flex flex-col gap-8">
          {attempt.problems.map((p, i) => (
            <li key={p.id} className="border-b border-border pb-6 last:border-b-0">
              <ProblemView
                problem={p}
                number={i + 1}
                answer={answers[p.id] ?? ''}
                onAnswer={(v) => setAnswers((a) => ({ ...a, [p.id]: v }))}
                allowBlank
              />
              {answers[p.id]?.trim() && (
                <div className="mt-3">
                  <ConfidenceChips
                    value={confidence[p.id]}
                    onChange={(c) => setConfidence((all) => ({ ...all, [p.id]: c }))}
                  />
                </div>
              )}
            </li>
          ))}
        </ol>
        <p className="text-sm text-muted" aria-live="polite">
          {answered} of {attempt.problems.length} answered
          {answered < attempt.problems.length && ' · the others will count as blank'}
        </p>
        <ErrorMessage message={error} />
        <Button className="self-start" disabled={busy} onClick={() => void submit()}>
          {busy ? 'Marking…' : 'Hand it in'}
        </Button>
      </div>
    );
  }

  const shown = result ?? status.last;
  return (
    <div className="flex flex-col gap-5">
      {shown ? (
        <SetReview result={shown} lessonId={lessonId} activityKey={activity.key} />
      ) : (
        <div className="flex flex-col gap-2">
          <h2 ref={focusOnMount} tabIndex={-1} className="text-xl font-bold outline-none">
            <span aria-hidden="true">🧮 </span>
            {activity.title}
          </h2>
          <p>{activity.instructions}</p>
          <p className="text-sm text-muted">
            {status.problemCount} problems
            {status.timeLimitMinutes ? ` · ${status.timeLimitMinutes} minutes` : ''}
            {status.passPercent ? ` · pass mark ${status.passPercent}%` : ''} · no hints · you can
            try again as many times as you like.
          </p>
        </div>
      )}
      <ErrorMessage message={error} />
      <div className="flex flex-wrap gap-3">
        {status.done ? (
          <>
            <Button onClick={finish}>{doneLabel}</Button>
            <Button variant="secondary" disabled={busy} onClick={() => void start()}>
              Try again for practice
            </Button>
          </>
        ) : (
          <Button disabled={busy} onClick={() => void start()}>
            {status.attempts === 0 ? 'Start the set' : 'Try again'}
          </Button>
        )}
      </div>
    </div>
  );
}

function SetReview({
  result,
  lessonId,
  activityKey,
}: {
  result: ProblemSetResult;
  lessonId: string;
  activityKey: string;
}) {
  const missed = result.review.filter((r) => r.verdict !== 'correct');
  const hasPassMark = result.passPercent !== null;
  return (
    <div className="flex flex-col gap-4">
      <div
        className={`rounded-2xl border-2 p-5 ${result.passed ? 'border-ok' : 'border-warn'} bg-card`}
      >
        <h2 ref={focusOnMount} tabIndex={-1} className="text-2xl font-bold outline-none">
          {!hasPassMark
            ? MATH_COPY.handedIn(result.score, result.total)
            : result.passed
              ? MATH_COPY.passed(result.score, result.total, result.percent)
              : MATH_COPY.notYet(result.score, result.total, result.percent)}
        </h2>
        {hasPassMark && <p className="mt-1 text-lg">Pass mark {result.passPercent}%</p>}
        {missed.length > 0 && (
          <p className="mt-2">
            Look again at: <strong>{result.reviewSkills.join(', ')}</strong>.{' '}
            {result.addedToErrorLog > 0 && (
              <>
                {result.addedToErrorLog} {result.addedToErrorLog === 1 ? 'problem' : 'problems'}{' '}
                went to{' '}
                <Link href="/math/error-log" className="text-brand underline">
                  your error log
                </Link>{' '}
                to redo later.
              </>
            )}
          </p>
        )}
      </div>
      <details className="rounded-xl border border-border bg-card p-4" open={missed.length > 0}>
        <summary className="cursor-pointer font-semibold">
          Review every problem with solutions
        </summary>
        <ol className="mt-4 flex flex-col gap-6">
          {result.review.map((r, i) => (
            <ReviewItem
              key={r.problem.id}
              item={r}
              number={i + 1}
              lessonId={lessonId}
              activityKey={activityKey}
            />
          ))}
        </ol>
      </details>
    </div>
  );
}

function ReviewItem({
  item,
  number,
  lessonId,
  activityKey,
}: {
  item: ProblemReviewItem;
  number: number;
  lessonId: string;
  activityKey: string;
}) {
  const v = VERDICT[item.verdict];
  const locator = { lessonId, activityKey, problemId: item.problem.id, seed: item.problem.seed };
  return (
    <li className="flex flex-col gap-3 border-b border-border pb-6 last:border-b-0">
      <ProblemView
        problem={item.problem}
        number={number}
        answer={item.given}
        onAnswer={() => {}}
        disabled
      />
      <p className={`font-semibold ${v.className}`}>
        {v.label}
        {item.verdict !== 'correct' && (
          <span className="font-normal text-foreground">
            {' '}
            · right answer: <MathText text={item.rightAnswer} />
          </span>
        )}
      </p>
      {item.confidence !== null && (
        <p className="text-sm text-muted">
          You said: {MATH_CONFIDENCE.find((c) => c.value === item.confidence)?.label}
        </p>
      )}
      {item.note && (
        <p className="rounded-xl border border-warn/40 bg-background p-3">
          <MathText text={item.note} />
        </p>
      )}
      <div className="rounded-xl bg-background p-3">
        <p className="text-sm font-semibold">Worked solution</p>
        <MathText as="p" text={item.solution} className="leading-relaxed" />
      </div>
      <div className="flex flex-col gap-2">
        {item.verdict === 'wrong' && item.given && (
          <QuillMath locator={locator} mode="mistake" answer={item.given} />
        )}
        <QuillMath locator={locator} mode="explain" />
      </div>
    </li>
  );
}

/** Time left; hands the set in when it reaches zero. Announces 5 and 1 minutes left. */
function Countdown({
  startedAt,
  minutes,
  onEnd,
}: {
  startedAt: string;
  minutes: number;
  onEnd: () => void;
}) {
  const deadline = new Date(startedAt).getTime() + minutes * 60_000;
  const [now, setNow] = useState(() => Date.now());
  const ended = useRef(false);
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const left = Math.max(0, Math.round((deadline - now) / 1000));
  useEffect(() => {
    if (left === 0 && !ended.current) {
      ended.current = true;
      onEnd();
    }
  }, [left, onEnd]);
  const mm = Math.floor(left / 60);
  const ss = String(left % 60).padStart(2, '0');
  const warn = left <= 300;
  return (
    <p className={`font-mono text-lg font-semibold ${warn ? 'text-warn' : 'text-muted'}`}>
      <span className="sr-only">Time left: </span>
      <span aria-hidden="true">⏱ </span>
      {mm}:{ss}
      <span className="sr-only" aria-live="polite">
        {mm === 5 && left % 60 === 0 ? 'Five minutes left.' : ''}
        {mm === 1 && left % 60 === 0 ? 'One minute left.' : ''}
      </span>
    </p>
  );
}
