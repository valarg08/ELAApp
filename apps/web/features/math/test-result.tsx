'use client';

import {
  ErrorLogEntry,
  MATH_CONFIDENCE,
  type TestResult,
  type TestReviewItem,
} from '@storyforge/shared';
import Link from 'next/link';
import { useState } from 'react';
import { MathText } from '@/components/math-text';
import { Button, ButtonLink, ErrorMessage } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';
import { MATH_COPY, clock, points } from './copy';
import { ProblemView } from './problem-view';
import { QuillMath } from './quill-math';

/** Move focus to the result heading when it appears. */
const focus = (el: HTMLHeadingElement | null) => el?.focus();

const VERDICT = {
  correct: { label: '✓ Right', className: 'text-ok' },
  wrong: { label: '✗ Not right', className: 'text-warn' },
  form: { label: 'Right value, wrong form', className: 'text-warn' },
  blank: { label: 'Left blank', className: 'text-muted' },
} as const;

/**
 * After a test, sprint or review (math-design.md §3.4 D1, D2): the AMC score, the score by question
 * position and by strand, the time sinks, "if you had left your guesses blank", the diagnostic's
 * focus units, and every problem with its solution, Quill and "Add to my error log".
 */
export function TestResultView({ result }: { result: TestResult }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border-2 border-brand bg-card p-5">
        <h1 ref={focus} tabIndex={-1} className="text-3xl font-bold outline-none">
          {result.title}: handed in
        </h1>
        {result.amcScoring ? (
          <p className="mt-2 text-xl">
            <strong>
              {points(result.points)} of {points(result.maxPoints)} points
            </strong>{' '}
            · {result.correct} right · {result.wrong} wrong · {result.blank} blank
          </p>
        ) : (
          <p className="mt-2 text-xl">
            <strong>
              {result.correct} of {result.total} right
            </strong>
          </p>
        )}
        {result.pointsIfGuessesBlank !== null && result.amcScoring && (
          <p className="mt-2">
            If you had left your guesses blank:{' '}
            <strong>{points(result.pointsIfGuessesBlank)}</strong> points.
            {result.pointsIfGuessesBlank > result.points
              ? ' Your guesses cost you points: leave them blank next time.'
              : ' Your guesses paid off this time.'}
          </p>
        )}
        {result.previousPoints !== null && (
          <p className="mt-2 text-muted">
            Last time: {points(result.previousPoints)} points (
            {result.points >= result.previousPoints ? '+' : ''}
            {points(result.points - result.previousPoints)}).
          </p>
        )}
      </div>

      {result.focusUnits.length > 0 && (
        <section aria-labelledby="focus-units" className="flex flex-col gap-2">
          <h2 id="focus-units" className="text-2xl font-semibold">
            Where to focus
          </h2>
          <ul className="flex flex-col gap-2">
            {result.focusUnits.map((u) => (
              <li key={u.number} className="rounded-xl border border-border bg-card p-3">
                <strong>
                  Math Unit {u.number}: {u.title}
                </strong>{' '}
                · {u.reason}
              </li>
            ))}
          </ul>
        </section>
      )}

      {result.amcScoring && result.bands.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <table className="w-full border-collapse text-left">
            <caption className="mb-2 text-left text-lg font-semibold">By question position</caption>
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="py-2">
                  Questions
                </th>
                <th scope="col">Right</th>
                <th scope="col">Points</th>
              </tr>
            </thead>
            <tbody>
              {result.bands.map((b) => (
                <tr key={b.band} className="border-b border-border">
                  <th scope="row" className="py-2 font-normal">
                    {b.band}
                  </th>
                  <td>
                    {b.correct} of {b.total}
                  </td>
                  <td>{points(b.points)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className="w-full border-collapse text-left">
            <caption className="mb-2 text-left text-lg font-semibold">By strand</caption>
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="py-2">
                  Strand
                </th>
                <th scope="col">Right</th>
              </tr>
            </thead>
            <tbody>
              {result.strands.map((s) => (
                <tr key={s.strand} className="border-b border-border">
                  <th scope="row" className="py-2 font-normal">
                    {s.label}
                  </th>
                  <td>
                    {s.correct} of {s.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {result.timeSinks.length > 0 && (
        <section aria-labelledby="time-sinks" className="flex flex-col gap-2">
          <h2 id="time-sinks" className="text-2xl font-semibold">
            Time sinks
          </h2>
          <p className="text-muted">
            Questions that took over 4 minutes. On the AMC, skipping one and coming back often
            scores more.
          </p>
          <ul className="flex flex-wrap gap-2">
            {result.timeSinks.map((t) => (
              <li key={t.number} className="rounded-xl border border-border bg-card px-3 py-2">
                Question {t.number}: {clock(t.seconds)} · {VERDICT[t.verdict].label}
              </li>
            ))}
          </ul>
        </section>
      )}

      <details className="rounded-xl border border-border bg-card p-4" open>
        <summary className="cursor-pointer text-lg font-semibold">
          Every problem with its solution
        </summary>
        <ol className="mt-4 flex flex-col gap-6">
          {result.review.map((item) => (
            <ReviewItem key={item.number} item={item} />
          ))}
        </ol>
      </details>

      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/math">Back to Math</ButtonLink>
        <ButtonLink href="/math/progress" variant="secondary">
          My skills
        </ButtonLink>
      </div>
    </div>
  );
}

function ReviewItem({ item }: { item: TestReviewItem }) {
  const v = VERDICT[item.verdict];
  const [logged, setLogged] = useState<'idle' | 'busy' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function addToLog() {
    setLogged('busy');
    setError(null);
    try {
      await apiJson('/math/error-log', ErrorLogEntry, 'POST', item.locator);
      setLogged('done');
    } catch (e) {
      setLogged('idle');
      setError(e instanceof ApiError ? e.userMessage : 'Could not add it. Try again.');
    }
  }

  return (
    <li className="flex flex-col gap-3 border-b border-border pb-6 last:border-b-0">
      <ProblemView
        problem={item.problem}
        number={item.number}
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
      <p className="text-sm text-muted">
        {clock(item.seconds)}
        {item.confidence !== null &&
          ` · you said: ${MATH_CONFIDENCE.find((c) => c.value === item.confidence)?.label}`}
        {item.flagged && ' · flagged'}
      </p>
      {item.note && (
        <p className="rounded-xl border border-warn/40 bg-background p-3">
          <MathText text={item.note} />
        </p>
      )}
      <details className="rounded-xl bg-background p-3">
        <summary className="cursor-pointer font-semibold">Worked solution</summary>
        <MathText as="p" text={item.solution} className="mt-2 leading-relaxed" />
      </details>
      <div className="flex flex-col gap-2">
        {item.verdict === 'wrong' && item.given && (
          <QuillMath locator={item.locator} mode="mistake" answer={item.given} />
        )}
        <QuillMath locator={item.locator} mode="explain" />
        {item.verdict !== 'correct' && (
          <Button
            variant="secondary"
            className="self-start"
            disabled={logged !== 'idle'}
            onClick={() => void addToLog()}
          >
            {logged === 'done' ? `✓ ${MATH_COPY.inLog}` : MATH_COPY.addToLog}
          </Button>
        )}
        {logged === 'done' && (
          <Link href="/math/error-log" className="text-sm text-brand underline">
            Open my error log
          </Link>
        )}
        <ErrorMessage message={error} />
      </div>
    </li>
  );
}
