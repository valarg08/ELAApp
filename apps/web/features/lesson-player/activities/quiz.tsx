'use client';

import { type LessonActivity, QuizAttemptView, QuizResult, QuizStatus } from '@storyforge/shared';
import { useEffect, useState } from 'react';
import { Button, ErrorMessage } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';
import { focusAnswer } from '@/features/math/focus';
import { focusOnMount } from './focus';
import type { ActivityResult } from './types';

type Activity = Extract<LessonActivity, { type: 'QUIZ' }>;

const message = (e: unknown, fallback: string) =>
  e instanceof ApiError ? e.userMessage : fallback;

/**
 * A marked quiz (Essay Writing unit checks, DESIGN.md §9.12). The server hands out the questions
 * and marks them. At the pass mark (80% by default) the student moves on; below it they see what
 * to review and try again with new questions.
 */
export function Quiz({
  lessonId,
  activity,
  onDone,
}: {
  lessonId: string;
  activity: Activity;
  onDone: (r: ActivityResult) => void;
}) {
  const base = `/lessons/${encodeURIComponent(lessonId)}/quizzes/${encodeURIComponent(activity.key)}`;
  const [status, setStatus] = useState<QuizStatus | null>(null);
  const [attempt, setAttempt] = useState<QuizAttemptView | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    apiJson(base, QuizStatus)
      .then((s) => {
        if (live) setStatus(s);
      })
      .catch((e: unknown) => {
        if (live) setError(message(e, 'Could not load the quiz. Try again.'));
      });
    return () => {
      live = false;
    };
  }, [base]);

  async function start() {
    setBusy(true);
    setError(null);
    try {
      setAttempt(await apiJson(`${base}/attempts`, QuizAttemptView, 'POST', {}));
      setAnswers({});
      setResult(null);
    } catch (e) {
      setError(message(e, 'Could not start the quiz. Try again.'));
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
        QuizResult,
        'POST',
        { answers },
      );
      setResult(marked);
      setAttempt(null);
      setStatus((s) =>
        s
          ? {
              ...s,
              attempts: s.attempts + 1,
              passed: s.passed || marked.passed,
              bestPercent: Math.max(s.bestPercent ?? 0, marked.percent),
              last: marked,
            }
          : s,
      );
    } catch (e) {
      setError(message(e, 'Could not mark the quiz. Try again.'));
    } finally {
      setBusy(false);
    }
  }

  const finish = () => onDone({ correct: true, attempts: Math.max(1, status?.attempts ?? 1) });

  if (!status) {
    return error ? (
      <ErrorMessage message={error} />
    ) : (
      <p className="text-muted">Loading the quiz…</p>
    );
  }

  if (attempt) {
    const answered = attempt.questions.filter((q) => answers[q.id]).length;
    return (
      <div className="flex flex-col gap-5">
        <h2 ref={focusOnMount} tabIndex={-1} className="text-xl font-bold outline-none">
          {activity.title} · try {attempt.attemptNumber}
        </h2>
        <ol className="flex flex-col gap-5">
          {attempt.questions.map((q, i) => (
            <li key={q.id}>
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-1 font-semibold">
                  <span className="mr-2 text-sm text-muted">{i + 1}.</span>
                  {q.prompt}
                </legend>
                {q.options.map((o) => (
                  <label
                    key={o.id}
                    className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border-2 bg-card px-4 py-2 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-brand ${
                      answers[q.id] === o.id ? 'border-brand' : 'border-border'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`${attempt.attemptId}-${q.id}`}
                      value={o.id}
                      checked={answers[q.id] === o.id}
                      onChange={() => setAnswers((a) => ({ ...a, [q.id]: o.id }))}
                      onKeyDown={(e) => {
                        if (e.key !== 'Enter') return;
                        e.preventDefault();
                        // Enter goes to the next question's choices; on the last one it hands the quiz in.
                        const groups = [
                          ...(e.currentTarget.closest('ol')?.querySelectorAll('fieldset') ?? []),
                        ];
                        const next =
                          groups[groups.indexOf(e.currentTarget.closest('fieldset')!) + 1];
                        if (next) focusAnswer(next);
                        else if (!busy && answered === attempt.questions.length) void submit();
                      }}
                      className="h-5 w-5 accent-brand"
                    />
                    <span>{o.text}</span>
                  </label>
                ))}
              </fieldset>
            </li>
          ))}
        </ol>
        <p className="text-sm text-muted" aria-live="polite">
          {answered} of {attempt.questions.length} answered
        </p>
        <ErrorMessage message={error} />
        <Button
          className="self-start"
          disabled={busy || answered < attempt.questions.length}
          onClick={() => void submit()}
        >
          {busy ? 'Marking…' : 'Hand it in'}
        </Button>
      </div>
    );
  }

  const shown = result ?? status.last;
  return (
    <div className="flex flex-col gap-5">
      {shown ? (
        <QuizReview result={shown} />
      ) : (
        <div className="flex flex-col gap-2">
          <h2 ref={focusOnMount} tabIndex={-1} className="text-xl font-bold outline-none">
            <span aria-hidden="true">📝 </span>
            {activity.title}
          </h2>
          <p>{activity.instructions}</p>
          <p className="text-sm text-muted">
            {status.questionCount} questions · pass mark {status.passPercent}% · you can try as many
            times as you need, with new questions each time.
          </p>
        </div>
      )}
      <ErrorMessage message={error} />
      <div className="flex flex-wrap gap-3">
        {status.passed ? (
          <>
            <Button onClick={finish}>Continue</Button>
            <Button variant="secondary" disabled={busy} onClick={() => void start()}>
              Try again for practice
            </Button>
          </>
        ) : (
          <Button disabled={busy} onClick={() => void start()}>
            {status.attempts === 0 ? 'Start the quiz' : 'Try again with new questions'}
          </Button>
        )}
      </div>
    </div>
  );
}

function QuizReview({ result }: { result: QuizResult }) {
  const wrong = result.review.filter((r) => !r.correct);
  return (
    <div className="flex flex-col gap-4">
      <div
        className={`rounded-2xl border-2 p-5 ${result.passed ? 'border-ok' : 'border-warn'} bg-card`}
      >
        <h2 ref={focusOnMount} tabIndex={-1} className="text-2xl font-bold outline-none">
          {result.passed ? '🎉 You passed!' : 'Not yet: keep going'}
        </h2>
        <p className="mt-1 text-lg">
          {result.score} of {result.total} right ·{' '}
          <strong className={result.passed ? 'text-ok' : 'text-warn'}>{result.percent}%</strong>{' '}
          (pass mark {result.passPercent}%)
        </p>
        {!result.passed && result.reviewSkills.length > 0 && (
          <p className="mt-2">
            Look again at: <strong>{result.reviewSkills.join(', ')}</strong>. The Learn step has the
            rules.
          </p>
        )}
      </div>
      {wrong.length > 0 && (
        <details className="rounded-xl border border-border bg-card p-4">
          <summary className="cursor-pointer font-semibold">
            See the {wrong.length} {wrong.length === 1 ? 'question' : 'questions'} to fix
          </summary>
          <ol className="mt-3 flex flex-col gap-4">
            {wrong.map((r) => (
              <li key={r.questionId} className="flex flex-col gap-1">
                <p className="font-semibold">{r.prompt}</p>
                <p>Your answer: {r.options.find((o) => o.id === r.chosenOptionId)?.text ?? '—'}</p>
                <p>
                  <span className="text-ok">✓ Right answer:</span>{' '}
                  {r.options.find((o) => o.id === r.correctOptionId)?.text}
                </p>
                <p className="text-sm text-muted">{r.explanation}</p>
              </li>
            ))}
          </ol>
        </details>
      )}
    </div>
  );
}
