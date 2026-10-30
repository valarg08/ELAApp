'use client';

import { SAT_DOMAINS, type SatBreakdown, type SatResult } from '@storyforge/shared';
import { useState } from 'react';
import { MathText } from '@/components/math-text';
import { Button, ButtonLink } from '@/components/ui';
import { ProblemFigure } from '../math/problem-view';

const skillLabel = (id: string) =>
  SAT_DOMAINS.flatMap((d) =>
    d.skills.map((s) => ({ id: s.id as string, label: s.label as string })),
  ).find((s) => s.id === id)?.label ?? id;

/**
 * The finished test: the raw score by module, then every question with your answer, the right one
 * and the worked solution (the 200–800 estimate and the skill breakdown come in S2).
 */
export function SatResultView({ result }: { result: SatResult }) {
  const [onlyWrong, setOnlyWrong] = useState(false);
  const shown = result.review.filter((r) => !onlyWrong || !r.correct);
  // The skills below 60% right, weakest first (a skill with a single question counts too).
  const weak = result.skills
    .filter((k) => k.correct / k.total < 0.6)
    .toSorted((a, b) => a.correct / a.total - b.correct / b.total)
    .slice(0, 3);
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6">
      <header>
        <p className="text-sm font-semibold tracking-widest text-brand uppercase">Test finished</p>
        <h1 className="text-3xl font-bold">{result.title}</h1>
        <div className="mt-3 rounded-2xl border-2 border-accent bg-card p-5 shadow-sm">
          <p className="text-sm font-semibold tracking-widest text-muted uppercase">
            Estimated Math score
          </p>
          <p className="text-5xl font-bold">{result.score.estimate}</p>
          <p className="mt-1">
            Probably between {result.score.low} and {result.score.high} on the 200–800 scale.
          </p>
          <p className="mt-1 text-sm text-muted">
            This is our estimate, not an official score: the College Board does not publish how it
            converts answers to scores. Watch the trend from week to week more than any one number.
          </p>
        </div>
        <p className="mt-3 text-xl">
          You got <strong>{result.correct}</strong> of <strong>{result.total}</strong> right.
        </p>
        <ul className="mt-2 ml-5 list-disc text-muted">
          {result.modules.map((m, i) => (
            <li key={i}>
              Module {i + 1}
              {i === 1 ? ` (${result.variant === 'hard' ? 'harder' : 'easier'})` : ''}: {m.correct}{' '}
              of {m.total}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <ButtonLink href="/sat">Back to SAT Math</ButtonLink>
          <ButtonLink href="/sat/mistakes" variant="secondary">
            My mistakes
          </ButtonLink>
          <Button
            variant="secondary"
            aria-pressed={onlyWrong}
            onClick={() => setOnlyWrong((v) => !v)}
          >
            {onlyWrong ? 'Show every question' : 'Show only the ones I missed'}
          </Button>
        </div>
      </header>

      <section aria-labelledby="sat-areas" className="flex flex-col gap-3">
        <h2 id="sat-areas" className="text-2xl font-semibold">
          Results by content area
        </h2>
        <Breakdown rows={result.areas} what="Content area" />
      </section>

      <section aria-labelledby="sat-skills" className="flex flex-col gap-3">
        <h2 id="sat-skills" className="text-2xl font-semibold">
          Results by skill
        </h2>
        <Breakdown rows={result.skills} what="Skill" />
        {weak.length > 0 ? (
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="font-semibold">Work on next</p>
            <ul className="mt-1 ml-5 list-disc">
              {weak.map((k) => (
                <li key={k.id}>
                  {k.label} ({k.correct} of {k.total})
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-muted">No weak skill showed up this week. Keep going.</p>
        )}
      </section>

      <section aria-labelledby="sat-review" className="flex flex-col gap-4">
        <h2 id="sat-review" className="text-2xl font-semibold">
          Review
        </h2>
        {shown.length === 0 && <p className="text-muted">You got every question right.</p>}
        <ol className="flex flex-col gap-4">
          {shown.map((r) => (
            <li
              key={r.id}
              className={`rounded-2xl border-2 p-4 ${r.correct ? 'border-ok' : 'border-bad'}`}
            >
              <p className="text-sm font-semibold text-muted">
                Module {r.module} · Question {r.number} · {skillLabel(r.skill)} ·{' '}
                <span className={r.correct ? 'text-ok' : 'text-bad'}>
                  {r.correct ? '✓ Right' : '✗ Wrong'}
                </span>
              </p>
              <p className="mt-1 text-lg">
                <MathText text={r.prompt} />
              </p>
              {r.figure && <ProblemFigure figure={r.figure} />}
              {r.choices && (
                <ol className="mt-2 flex flex-col gap-1" aria-label="Choices">
                  {r.choices.map((c, i) => {
                    const letter = 'ABCD'[i]!;
                    return (
                      <li key={letter}>
                        <strong>{letter}.</strong> <MathText text={c} />
                        {letter === r.correctAnswer && (
                          <span className="text-ok"> ← right answer</span>
                        )}
                        {letter === r.yourAnswer && letter !== r.correctAnswer && (
                          <span className="text-bad"> ← your answer</span>
                        )}
                      </li>
                    );
                  })}
                </ol>
              )}
              {!r.choices && (
                <p className="mt-2">
                  Your answer: <strong>{r.yourAnswer ?? 'none'}</strong>. Right answer:{' '}
                  <strong>{r.correctAnswer}</strong>.
                </p>
              )}
              {r.choices && r.yourAnswer === null && (
                <p className="mt-1 text-bad">You did not answer this one.</p>
              )}
              <div className="mt-2 rounded-xl bg-brand/5 p-3">
                <p className="font-semibold">Solution</p>
                <p>
                  <MathText text={r.solution} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

/** Right answers by area or skill, with a bar for each. */
function Breakdown({ rows, what }: { rows: SatBreakdown[]; what: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">{what}: right answers out of the questions asked</caption>
        <thead>
          <tr>
            <th scope="col" className="border-b border-border px-2 py-2">
              {what}
            </th>
            <th scope="col" className="border-b border-border px-2 py-2">
              Right
            </th>
            <th scope="col" className="border-b border-border px-2 py-2">
              Share
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const share = Math.round((r.correct / r.total) * 100);
            return (
              <tr key={r.id}>
                <th scope="row" className="border-b border-border px-2 py-2 font-normal">
                  {r.label}
                </th>
                <td className="border-b border-border px-2 py-2 whitespace-nowrap">
                  {r.correct} of {r.total}
                </td>
                <td className="w-40 border-b border-border px-2 py-2">
                  {share}%
                  <span
                    aria-hidden="true"
                    className="mt-1 block h-2 overflow-hidden rounded-full bg-border"
                  >
                    <span className="block h-full bg-brand" style={{ width: `${share}%` }} />
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
