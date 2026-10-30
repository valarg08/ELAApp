'use client';

import { SAT_DOMAINS, type SatResult } from '@storyforge/shared';
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
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6">
      <header>
        <p className="text-sm font-semibold tracking-widest text-brand uppercase">Test finished</p>
        <h1 className="text-3xl font-bold">{result.title}</h1>
        <p className="mt-2 text-xl">
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
          <Button
            variant="secondary"
            aria-pressed={onlyWrong}
            onClick={() => setOnlyWrong((v) => !v)}
          >
            {onlyWrong ? 'Show every question' : 'Show only the ones I missed'}
          </Button>
        </div>
      </header>

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
