'use client';

import {
  SAT_RULES,
  SAT_TYPED_MAX,
  SAT_TYPED_MAX_NEGATIVE,
  SatAttemptView,
  type SatModuleView,
  type SatQuestionPublic,
  satTypedError,
} from '@storyforge/shared';
import { useEffect, useRef, useState } from 'react';
import { MathText } from '@/components/math-text';
import { Button, ErrorMessage } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';
import { useNow } from '../math/practice-tools';
import { ProblemFigure } from '../math/problem-view';
import { SatResultView } from './sat-result';
import { Calculator, ReferenceSheet, ToolDialog } from './sat-tools';

const LETTERS = ['A', 'B', 'C', 'D'] as const;
/** The clock comes back by itself when this many seconds are left. */
const SHOW_CLOCK_AT = 5 * 60;

const message = (e: unknown, fallback: string) =>
  e instanceof ApiError ? e.userMessage : fallback;

const clock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

type Work = {
  answers: Record<string, string>;
  marked: string[];
  struck: Record<string, string[]>;
};
type Panel = 'list' | 'reference' | 'calculator' | 'rules' | 'confirm' | null;

/** The SAT test as the student meets it: the open module, then the result. */
export function SatTest({ initial }: { initial: SatAttemptView }) {
  const [view, setView] = useState(initial);
  if (view.phase === 'done') return <SatResultView result={view} />;
  return <ModulePlayer key={`${view.id}-${view.module}`} view={view} onView={setView} />;
}

/**
 * One module (sat-design.md §1): the question in front, a question list, mark for review, crossing
 * out choices, the reference sheet and a calculator, and a clock that follows the server's. Work is
 * saved as it changes; the module is handed in with the button or when the time is up.
 */
function ModulePlayer({
  view,
  onView,
}: {
  view: SatModuleView;
  onView: (next: SatAttemptView) => void;
}) {
  const [work, setWork] = useState<Work>({
    answers: view.answers,
    marked: view.marked,
    struck: view.struck,
  });
  const [index, setIndex] = useState(0);
  const [screen, setScreen] = useState<'question' | 'check'>('question');
  const [panel, setPanel] = useState<Panel>(null);
  const [hideClock, setHideClock] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [offset] = useState(() => new Date(view.serverNow).getTime() - Date.now());
  const now = useNow();
  const remaining = Math.max(
    0,
    Math.round((new Date(view.deadline).getTime() - (now + offset)) / 1000),
  );
  const showClock = !hideClock || remaining <= SHOW_CLOCK_AT;
  const questions = view.questions;
  const q = questions[index]!;

  // Autosave: a moment after the last change, and never before the first one.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return undefined;
    }
    const t = setTimeout(() => {
      apiJson(`/sat/attempts/${view.id}/answers`, SatAttemptView, 'PUT', work)
        .then((next) => {
          setError(null);
          if (next.phase === 'done' || next.module !== view.module) onView(next);
        })
        .catch((e) =>
          setError(message(e, 'Could not save just now. Your answers are still on this page.')),
        );
    }, 600);
    return () => clearTimeout(t);
  }, [work, view.id, view.module, onView]);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      await apiJson(`/sat/attempts/${view.id}/answers`, SatAttemptView, 'PUT', work);
      onView(await apiJson(`/sat/attempts/${view.id}/submit`, SatAttemptView, 'POST'));
    } catch (e) {
      setError(message(e, 'Could not hand in the module. Try again.'));
      setBusy(false);
      setPanel(null);
    }
  }

  // Time is up: hand the module in once.
  const timeUp = useRef(false);
  useEffect(() => {
    if (remaining === 0 && !timeUp.current) {
      timeUp.current = true;
      void submit();
    }
    // `submit` reads the latest work through its closure when the clock runs out.
    // oxlint-disable-next-line react/exhaustive-deps
  }, [remaining]);

  const answered = (id: string) => Boolean(work.answers[id]);
  const isMarked = (id: string) => work.marked.includes(id);
  const unanswered = questions.filter((x) => !answered(x.id)).length;
  const markedCount = work.marked.length;

  const setAnswer = (id: string, value: string) =>
    setWork((w) => {
      const answers = { ...w.answers };
      if (value) answers[id] = value;
      else delete answers[id];
      return { ...w, answers };
    });
  const toggleMark = (id: string) =>
    setWork((w) => ({
      ...w,
      marked: w.marked.includes(id) ? w.marked.filter((x) => x !== id) : [...w.marked, id],
    }));
  const toggleStrike = (id: string, letter: string) =>
    setWork((w) => {
      const crossed = w.struck[id] ?? [];
      const next = crossed.includes(letter)
        ? crossed.filter((l) => l !== letter)
        : [...crossed, letter];
      return { ...w, struck: { ...w.struck, [id]: next } };
    });
  const go = (i: number) => {
    setScreen('question');
    setIndex(i);
    setPanel(null);
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-4">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <h1 className="text-xl font-bold">SAT Math · Module {view.module} of 2</h1>
          <p className="text-sm text-muted">{view.title}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {showClock ? (
            <p role="timer" aria-live="off" className="min-w-16 text-center text-xl font-bold">
              <span className="sr-only">Time left: </span>
              {clock(remaining)}
            </p>
          ) : (
            <p className="text-sm text-muted">Clock hidden</p>
          )}
          <Button
            variant="secondary"
            aria-pressed={hideClock}
            onClick={() => setHideClock((h) => !h)}
          >
            {hideClock ? 'Show clock' : 'Hide clock'}
          </Button>
          <Button variant="secondary" onClick={() => setPanel('calculator')}>
            Calculator
          </Button>
          <Button variant="secondary" onClick={() => setPanel('reference')}>
            Reference
          </Button>
          <Button variant="secondary" onClick={() => setPanel('rules')}>
            Rules
          </Button>
        </div>
      </header>

      <ErrorMessage message={error} />

      {screen === 'question' ? (
        <section
          aria-labelledby="sat-q"
          className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="sat-q" className="text-lg font-bold">
              Question {index + 1}{' '}
              <span className="font-normal text-muted">of {questions.length}</span>
            </h2>
            <Button
              variant="secondary"
              aria-pressed={isMarked(q.id)}
              onClick={() => toggleMark(q.id)}
            >
              {isMarked(q.id) ? '⚑ Marked for review' : '⚐ Mark for review'}
            </Button>
          </div>
          <Question
            q={q}
            value={work.answers[q.id] ?? ''}
            struck={work.struck[q.id] ?? []}
            onChange={(v) => setAnswer(q.id, v)}
            onStrike={(letter) => toggleStrike(q.id, letter)}
            onEnter={() => (index === questions.length - 1 ? setScreen('check') : go(index + 1))}
          />
        </section>
      ) : (
        <section
          aria-labelledby="sat-check"
          className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <h2 id="sat-check" className="text-2xl font-bold">
            Check your work
          </h2>
          <p>
            {unanswered === 0
              ? 'Every question has an answer.'
              : `${unanswered} ${unanswered === 1 ? 'question has' : 'questions have'} no answer yet.`}{' '}
            {markedCount > 0 && `${markedCount} marked for review. `}
            Pick a question to go back to it.
          </p>
          <QuestionGrid
            questions={questions}
            index={-1}
            answered={answered}
            isMarked={isMarked}
            onPick={go}
          />
          <p className="text-muted">
            After you hand in module {view.module}
            {view.module === 1 ? ', you cannot come back to it.' : ' the test is over.'}
          </p>
        </section>
      )}

      <footer className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="secondary" onClick={() => setPanel('list')}>
          Question list
        </Button>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            disabled={screen === 'question' && index === 0}
            onClick={() => (screen === 'check' ? go(questions.length - 1) : go(index - 1))}
          >
            Back
          </Button>
          {screen === 'check' ? (
            <Button onClick={() => setPanel('confirm')} disabled={busy}>
              Hand in module {view.module}
            </Button>
          ) : index === questions.length - 1 ? (
            <Button onClick={() => setScreen('check')}>Check your work</Button>
          ) : (
            <Button onClick={() => go(index + 1)}>Next</Button>
          )}
        </div>
      </footer>

      <ToolDialog title="Question list" open={panel === 'list'} onClose={() => setPanel(null)}>
        <QuestionGrid
          questions={questions}
          index={index}
          answered={answered}
          isMarked={isMarked}
          onPick={go}
        />
        <Button
          variant="secondary"
          onClick={() => {
            setScreen('check');
            setPanel(null);
          }}
        >
          Go to Check your work
        </Button>
      </ToolDialog>
      <ToolDialog
        title="Reference sheet"
        open={panel === 'reference'}
        onClose={() => setPanel(null)}
      >
        <ReferenceSheet />
      </ToolDialog>
      <ToolDialog title="Calculator" open={panel === 'calculator'} onClose={() => setPanel(null)}>
        <Calculator />
      </ToolDialog>
      <ToolDialog title="Rules of the test" open={panel === 'rules'} onClose={() => setPanel(null)}>
        <div className="flex flex-col gap-3">
          {SAT_RULES.map((g) => (
            <section key={g.title}>
              <h3 className="font-bold">{g.title}</h3>
              <ul className="ml-5 list-disc">
                {g.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </ToolDialog>
      <ToolDialog
        title={`Hand in module ${view.module}?`}
        open={panel === 'confirm'}
        onClose={() => setPanel(null)}
      >
        <p>
          {unanswered > 0
            ? `${unanswered} ${unanswered === 1 ? 'question has' : 'questions have'} no answer. `
            : ''}
          You cannot change your answers after this.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => void submit()} disabled={busy}>
            {busy ? 'Handing in…' : `Hand in module ${view.module}`}
          </Button>
          <Button variant="secondary" onClick={() => setPanel(null)}>
            Keep working
          </Button>
        </div>
      </ToolDialog>
    </div>
  );
}

/** The question numbers as buttons: answered, marked for review, or still open. */
function QuestionGrid({
  questions,
  index,
  answered,
  isMarked,
  onPick,
}: {
  questions: SatQuestionPublic[];
  index: number;
  answered: (id: string) => boolean;
  isMarked: (id: string) => boolean;
  onPick: (i: number) => void;
}) {
  return (
    <ol className="grid grid-cols-5 gap-2 sm:grid-cols-6">
      {questions.map((x, i) => {
        const done = answered(x.id);
        const mark = isMarked(x.id);
        return (
          <li key={x.id}>
            <button
              type="button"
              onClick={() => onPick(i)}
              aria-current={i === index ? 'true' : undefined}
              className={`relative min-h-11 w-full rounded-xl border-2 font-semibold focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                done ? 'border-brand bg-brand/15' : 'border-dashed border-border'
              } ${i === index ? 'ring-2 ring-brand' : ''}`}
            >
              {i + 1}
              {mark && (
                <span aria-hidden="true" className="absolute top-0 right-1 text-sm">
                  ⚑
                </span>
              )}
              <span className="sr-only">
                {done ? ', answered' : ', not answered'}
                {mark ? ', marked for review' : ''}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

/** A question: its words, the figure and either the four choices or the box for a typed answer. */
export function Question({
  q,
  value,
  struck,
  onChange,
  onStrike,
  onEnter,
}: {
  q: SatQuestionPublic;
  value: string;
  struck: string[];
  onChange: (value: string) => void;
  onStrike: (letter: string) => void;
  /** Enter in the answer box (or on a choice) does this, like pressing the main button. */
  onEnter?: () => void;
}) {
  const error = q.kind === 'typed' ? satTypedError(value) : null;
  const root = useRef<HTMLDivElement>(null);
  // A new question starts with the answer box (or the chosen / first choice) ready to use.
  useEffect(() => {
    const box = root.current?.querySelector<HTMLInputElement>(
      'input[type=radio]:checked, input:not([type=radio])',
    );
    (box ?? root.current?.querySelector<HTMLInputElement>('input[type=radio]'))?.focus();
    // Runs when the question changes; q.id is the trigger, not a value read inside.
    // oxlint-disable-next-line react/exhaustive-deps
  }, [q.id]);
  const enter = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter' || !onEnter) return;
    e.preventDefault();
    onEnter();
  };
  return (
    <div ref={root} className="flex flex-col gap-4">
      <p className="text-lg">
        <MathText text={q.prompt} />
      </p>
      {q.figure && <ProblemFigure figure={q.figure} />}
      {q.kind === 'choice' && q.choices ? (
        <fieldset className="m-0 flex min-w-0 flex-col gap-2 border-0 p-0">
          <legend className="sr-only">Answer choices</legend>
          {q.choices.map((choice, i) => {
            const letter = LETTERS[i]!;
            const on = value === letter;
            const crossed = struck.includes(letter);
            return (
              <div key={letter} className="flex items-stretch gap-2">
                <label
                  className={`flex min-h-12 flex-1 cursor-pointer items-center gap-3 rounded-xl border-2 px-3 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand ${
                    on ? 'border-brand bg-brand/10' : 'border-border hover:border-brand'
                  } ${crossed ? 'opacity-60' : ''}`}
                >
                  <input
                    type="radio"
                    name={q.id}
                    value={letter}
                    checked={on}
                    onChange={() => onChange(letter)}
                    onClick={() => on && onChange('')}
                    onKeyDown={enter}
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full border-2 font-bold ${
                      on ? 'border-brand bg-brand text-white' : 'border-border'
                    }`}
                  >
                    {letter}
                  </span>
                  <span className={crossed ? 'line-through' : ''}>
                    <span className="sr-only">Choice {letter}: </span>
                    <MathText text={choice} />
                  </span>
                </label>
                <button
                  type="button"
                  aria-pressed={crossed}
                  aria-label={`Cross out choice ${letter}`}
                  onClick={() => onStrike(letter)}
                  className="min-h-12 min-w-12 rounded-xl border border-border text-lg hover:border-brand focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <span aria-hidden="true">{crossed ? '↺' : '✕'}</span>
                </button>
              </div>
            );
          })}
        </fieldset>
      ) : (
        <div className="flex flex-col gap-2">
          <label className="flex flex-col gap-1">
            <span className="font-semibold">Your answer</span>
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={enter}
              maxLength={12}
              autoComplete="off"
              spellCheck={false}
              aria-invalid={error ? true : undefined}
              aria-describedby="sat-typed-help"
              className="min-h-12 w-48 rounded-xl border-2 border-border bg-card px-3 text-xl focus-visible:outline-3 focus-visible:outline-brand"
            />
          </label>
          <p id="sat-typed-help" className="text-sm text-muted">
            Type a number or a fraction, like 12, -3.5 or 7/4. At most {SAT_TYPED_MAX} characters (
            {SAT_TYPED_MAX_NEGATIVE} if negative).
          </p>
          <p aria-live="polite" className={`min-h-6 ${error ? 'text-bad' : 'text-muted'}`}>
            {error ?? (value.trim() ? `Your answer: ${value.trim()}` : '')}
          </p>
        </div>
      )}
    </div>
  );
}
