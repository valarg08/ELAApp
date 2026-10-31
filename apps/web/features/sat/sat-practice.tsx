'use client';

import { SatPracticeResponse, SatPracticeView, satTypedError } from '@storyforge/shared';
import { useState } from 'react';
import { MathText } from '@/components/math-text';
import { Button, ButtonLink, ErrorMessage } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';
import { StartPractice } from './sat-start';
import { Question } from './sat-player';
import { Calculator, ReferenceSheet, ToolDialog } from './sat-tools';

const LEVEL = ['', 'Easier', 'Medium', 'Harder'];

/**
 * An adaptive practice set (sat-design.md §7): one question at a time, checked at once with the
 * worked solution, and the next question chosen from how the student is doing. Untimed.
 */
export function SatPractice({ initial }: { initial: SatPracticeView }) {
  const [view, setView] = useState(initial);
  const [value, setValue] = useState('');
  const [struck, setStruck] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<SatPracticeResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [panel, setPanel] = useState<'calculator' | 'reference' | null>(null);

  const q = view.question;

  async function check() {
    if (!q) return;
    setBusy(true);
    setError(null);
    try {
      setFeedback(
        await apiJson(`/sat/practice/${view.id}/answer`, SatPracticeResponse, 'POST', {
          questionId: q.id,
          answer: value.trim(),
        }),
      );
    } catch (e) {
      setError(e instanceof ApiError ? e.userMessage : 'Could not check that. Try again.');
    }
    setBusy(false);
  }

  function next() {
    if (!feedback) return;
    setView(feedback.next);
    setFeedback(null);
    setValue('');
    setStruck([]);
  }

  if (view.summary) {
    const s = view.summary;
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6">
        <header>
          <p className="text-sm font-semibold tracking-widest text-brand uppercase">
            Practice finished
          </p>
          <h1 className="text-3xl font-bold">
            {s.right} of {s.total} right
          </h1>
        </header>
        <section aria-labelledby="pr-skills" className="flex flex-col gap-2">
          <h2 id="pr-skills" className="text-xl font-semibold">
            By skill
          </h2>
          <ul className="ml-5 list-disc">
            {s.skills.map((k) => (
              <li key={k.id}>
                {k.label}: {k.right} of {k.total}
              </li>
            ))}
          </ul>
        </section>
        <div className="flex flex-wrap items-start gap-2">
          <StartPractice label="Practise again" />
          <ButtonLink href="/sat/practice" variant="secondary">
            My skills
          </ButtonLink>
          <ButtonLink href="/sat/mistakes" variant="secondary">
            My mistakes
          </ButtonLink>
        </div>
      </div>
    );
  }
  if (!q) return null;

  const typedProblem = q.kind === 'typed' ? satTypedError(value) : null;
  const canCheck = !busy && !!value.trim() && !typedProblem;
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-4">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <h1 className="text-xl font-bold">SAT Math practice</h1>
          <p className="text-sm text-muted">
            Untimed. Each question is checked at once, and the next one adapts to you.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setPanel('calculator')}>
            Calculator
          </Button>
          <Button variant="secondary" onClick={() => setPanel('reference')}>
            Reference
          </Button>
        </div>
      </header>

      <section
        aria-labelledby="pr-q"
        className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
      >
        <div>
          <h2 id="pr-q" className="text-lg font-bold">
            Question {q.number} <span className="font-normal text-muted">of {view.size}</span>
          </h2>
          <p className="text-sm text-muted">
            {q.skillLabel} · {LEVEL[q.level] ?? ''}
          </p>
        </div>
        <Question
          q={q}
          value={value}
          struck={struck}
          onChange={(v) => !feedback && setValue(v)}
          onStrike={(letter) =>
            !feedback &&
            setStruck((s) => (s.includes(letter) ? s.filter((l) => l !== letter) : [...s, letter]))
          }
          onEnter={() => (feedback ? next() : canCheck ? void check() : undefined)}
        />
        <ErrorMessage message={error} />
        {feedback ? (
          <output
            className={`block rounded-xl border-2 p-4 ${feedback.correct ? 'border-ok' : 'border-bad'}`}
          >
            <p className={`text-lg font-bold ${feedback.correct ? 'text-ok' : 'text-bad'}`}>
              {feedback.correct ? '✓ Right!' : '✗ Not quite.'}
            </p>
            {!feedback.correct && (
              <p>
                The right answer is <strong>{feedback.correctAnswer}</strong>.
              </p>
            )}
            <p className="mt-2 font-semibold">Solution</p>
            <p>
              <MathText text={feedback.solution} />
            </p>
          </output>
        ) : null}
        <div>
          {feedback ? (
            <Button onClick={next}>
              {feedback.next.summary ? 'See my results' : 'Next question'}
            </Button>
          ) : (
            <Button onClick={() => void check()} disabled={!canCheck}>
              {busy ? 'Checking…' : 'Check my answer'}
            </Button>
          )}
        </div>
      </section>

      <ToolDialog title="Calculator" open={panel === 'calculator'} onClose={() => setPanel(null)}>
        <Calculator />
      </ToolDialog>
      <ToolDialog
        title="Reference sheet"
        open={panel === 'reference'}
        onClose={() => setPanel(null)}
      >
        <ReferenceSheet />
      </ToolDialog>
    </div>
  );
}
