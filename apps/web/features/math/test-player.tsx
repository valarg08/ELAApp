'use client';

import {
  type MathConfidence,
  type MathTestAnswer,
  MathTestView,
  SKIP_PROMPT_SECONDS,
  SaveTestAnswerResponse,
  type TestItemFeedback,
  TestResult,
  isMentalKind,
} from '@storyforge/shared';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { MathText } from '@/components/math-text';
import { Button, ErrorMessage } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';
import { MATH_COPY, clock } from './copy';
import { ConfidenceChips, Scratchpad, useLocalSetting, useNow } from './practice-tools';
import { ProblemView } from './problem-view';
import { SimpleAnswers } from './simple-answers';
import { TestResultView } from './test-result';

const PROMPT_KEY = 'storyforge.math.skipPrompt';
/** A page can hold this element (the Progress panel's top): the countdown then shows there. */
export const SIDE_TIMER_ID = 'test-side-timer';

const noSubscribe = () => () => {};

const message = (e: unknown, fallback: string) =>
  e instanceof ApiError ? e.userMessage : fallback;

/** An attempt: the player while it is open, the result once it is handed in. */
export function MathAttempt({
  initial,
  back,
}: {
  initial: MathTestView | TestResult;
  /** Where the result's main button goes (a Unit 15 mock returns to its lesson). */
  back?: { href: string; label: string };
}) {
  const [state, setState] = useState(initial);
  // Mental Math answers are plain numbers: the answer box hides the √ π / ^ helpers.
  return (
    <SimpleAnswers value={isMentalKind(state.kind)}>
      {'problems' in state ? (
        <TestPlayer view={state} onFinished={setState} />
      ) : (
        <TestResultView result={state} back={back} />
      )}
    </SimpleAnswers>
  );
}

/**
 * Tests, sprints and reviews (math-design.md §3.2 B3–B4, §3.4 D1): a question map, skip and flag,
 * a countdown, the 2-minute prompt (can be switched off), confidence chips, and instant feedback in
 * the reviews. Answers are saved as they change; the test is handed in at the end or when time
 * runs out.
 */
export function TestPlayer({
  view,
  onFinished,
}: {
  view: MathTestView;
  onFinished: (r: TestResult) => void;
}) {
  const n = view.problems.length;
  const base = `/math/tests/attempts/${encodeURIComponent(view.attemptId)}`;
  const [index, setIndex] = useState(() => {
    const first = view.problems.findIndex((_, i) => !view.answers[String(i)]?.answer);
    return first === -1 ? 0 : first;
  });
  const [answers, setAnswers] = useState<Record<string, MathTestAnswer>>(view.answers);
  const [feedback, setFeedback] = useState<Record<string, TestItemFeedback>>(view.feedback);
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promptOn, setPromptOn] = useLocalSetting(PROMPT_KEY, true);
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());
  const [shownAt, setShownAt] = useState(() => Date.now());
  const now = useNow();
  const dirty = useRef(new Set<number>());
  // The latest answers for saving (kept in step by update and settleTime).
  const answersRef = useRef(view.answers);
  const handingIn = useRef(false);
  const timed = view.timeLimitSeconds !== null;

  const key = String(index);
  const current = answers[key];
  const fb = feedback[key];
  const secondsHere =
    (answers[key]?.seconds ?? 0) + Math.max(0, Math.round((now - shownAt) / 1000));

  /** Add the time on the current problem to its answer (when leaving it or saving). */
  const settleTime = useCallback(() => {
    const k = String(index);
    const at = Date.now();
    const spent = Math.round((at - shownAt) / 1000);
    setShownAt(at);
    if (spent <= 0) return;
    const prev = answersRef.current[k] ?? { answer: '', seconds: 0, flagged: false };
    const next = {
      ...answersRef.current,
      [k]: { ...prev, seconds: Math.min(7200, prev.seconds + spent) },
    };
    answersRef.current = next;
    setAnswers(next);
    dirty.current.add(index);
  }, [index, shownAt]);

  const flush = useCallback(async () => {
    const indexes = [...dirty.current];
    dirty.current.clear();
    for (const i of indexes) {
      const a = answersRef.current[String(i)];
      if (!a || feedback[String(i)]) continue;
      try {
        await apiJson(`${base}/answer`, SaveTestAnswerResponse, 'PUT', {
          index: i,
          answer: a.answer,
          seconds: a.seconds,
          confidence: a.confidence,
          flagged: a.flagged,
          check: false,
        });
      } catch (e) {
        dirty.current.add(i);
        if (e instanceof ApiError && e.problem.status === 409) return;
        setError(message(e, 'Could not save your answer. Check your connection.'));
        return;
      }
    }
  }, [base, feedback]);

  // Save changed answers a moment after the last change.
  useEffect(() => {
    if (dirty.current.size === 0) return undefined;
    const t = setTimeout(() => void flush(), 1200);
    return () => clearTimeout(t);
  }, [answers, flush]);

  function update(change: Partial<MathTestAnswer>) {
    const prev = answersRef.current[key] ?? { answer: '', seconds: 0, flagged: false };
    const next = { ...answersRef.current, [key]: { ...prev, ...change } };
    answersRef.current = next;
    setAnswers(next);
    dirty.current.add(index);
  }

  function go(i: number) {
    if (i === index || i < 0 || i >= n) return;
    settleTime();
    setIndex(i);
    setConfirming(false);
  }

  /** The next unanswered problem after this one (wrapping), for "Skip". */
  function nextOpen(): number {
    for (let step = 1; step <= n; step++) {
      const i = (index + step) % n;
      if (!answersRef.current[String(i)]?.answer && !feedback[String(i)]) return i;
    }
    return (index + 1) % n;
  }

  async function checkNow() {
    if (!current?.answer) return;
    settleTime();
    setBusy(true);
    setError(null);
    try {
      const a = answersRef.current[key]!;
      const r = await apiJson(`${base}/answer`, SaveTestAnswerResponse, 'PUT', {
        index,
        answer: a.answer,
        seconds: a.seconds,
        confidence: a.confidence,
        flagged: a.flagged,
        check: true,
      });
      dirty.current.delete(index);
      if (r.feedback) {
        const f = r.feedback;
        setFeedback((all) => ({ ...all, [key]: f }));
        update({ verdict: f.verdict });
      }
    } catch (e) {
      setError(message(e, 'Could not check it. Try again.'));
    } finally {
      setBusy(false);
    }
  }

  const handIn = useCallback(async () => {
    if (handingIn.current) return;
    handingIn.current = true;
    settleTime();
    setBusy(true);
    setError(null);
    try {
      await flush();
      onFinished(await apiJson(`${base}/submit`, TestResult, 'POST', {}));
    } catch (e) {
      handingIn.current = false;
      // Time ran out on the server: it was handed in there, so load the result.
      if (e instanceof ApiError && e.problem.status === 409) {
        try {
          onFinished(await apiJson(`${base}/review`, TestResult));
          return;
        } catch {
          // Fall through to the message.
        }
      }
      setError(message(e, 'Could not hand it in. Try again.'));
    } finally {
      setBusy(false);
    }
  }, [base, flush, onFinished, settleTime]);

  const deadline = timed
    ? new Date(view.startedAt).getTime() + view.timeLimitSeconds! * 1000
    : null;
  const left = deadline ? Math.max(0, Math.round((deadline - now) / 1000)) : null;

  // Hand it in when time runs out (checked on a timer, outside render).
  const handInRef = useRef(handIn);
  useEffect(() => {
    handInRef.current = handIn;
  }, [handIn]);
  useEffect(() => {
    if (deadline === null) return undefined;
    const t = setInterval(() => {
      if (Date.now() >= deadline) void handInRef.current();
    }, 1000);
    return () => clearInterval(t);
  }, [deadline]);

  const problem = view.problems[index]!;
  const answeredCount = view.problems.filter(
    (_, i) => answers[String(i)]?.answer || feedback[String(i)],
  ).length;
  const blanks = n - answeredCount;
  // Mental Math (ages 7–14) keeps it simple: no confidence chips or skip prompts.
  const mental = isMentalKind(view.kind);
  const showSkipPrompt =
    !mental &&
    timed &&
    promptOn &&
    !view.instant &&
    !current?.answer &&
    !dismissed.has(index) &&
    secondsHere >= SKIP_PROMPT_SECONDS;
  const locked = Boolean(fb);
  // The side slot lives outside this component (none while rendering on the server).
  const side = useSyncExternalStore(
    noSubscribe,
    () => document.getElementById(SIDE_TIMER_ID),
    () => null,
  );
  const low = left !== null && left <= Math.min(300, view.timeLimitSeconds! / 3);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">{view.title}</h1>
          {view.instructions && <p className="mt-1 text-muted">{view.instructions}</p>}
        </div>
        {left !== null && (
          <p
            className={`font-mono text-xl font-semibold tabular-nums ${low ? 'text-warn' : 'text-muted'} ${side ? 'md:hidden' : ''}`}
          >
            <span className="sr-only">Time left: </span>
            {clock(left)}
          </p>
        )}
        {left !== null && (
          <p className="sr-only" aria-live="polite">
            {left === 300 ? 'Five minutes left.' : left === 60 ? 'One minute left.' : ''}
          </p>
        )}
      </div>
      {left !== null &&
        side &&
        createPortal(
          <section
            aria-label="Timer"
            className={`mb-5 hidden rounded-xl border-2 bg-card p-4 text-center md:block ${low ? 'border-warn' : 'border-brand/30'}`}
          >
            <p className="text-sm font-semibold">Time left</p>
            <p
              className={`font-mono text-4xl font-bold tabular-nums ${low ? 'text-warn' : 'text-brand'}`}
            >
              {clock(left)}
            </p>
            <div aria-hidden="true" className="mt-2 h-2 overflow-hidden rounded-full bg-background">
              <div
                className={`h-full rounded-full ${low ? 'bg-warn' : 'bg-primary'}`}
                style={{ width: `${(100 * left) / view.timeLimitSeconds!}%` }}
              />
            </div>
            <p className="mt-2 text-sm">
              {answeredCount} of {n} answered
            </p>
          </section>,
          side,
        )}

      {view.facts.length > 0 && (
        <details className="rounded-2xl border border-border bg-card p-4" open>
          <summary className="cursor-pointer font-semibold">Read these first</summary>
          <ul className="mt-3 flex flex-col gap-2">
            {view.facts.map((f, i) => (
              <li key={i} className="rounded-xl bg-background p-3">
                <span className="font-semibold">{f.title}: </span>
                <MathText text={f.text} />
              </li>
            ))}
          </ul>
        </details>
      )}

      <nav aria-label="Questions">
        <ol className="flex flex-wrap gap-2">
          {view.problems.map((_, i) => {
            const a = answers[String(i)];
            const f = feedback[String(i)];
            const state = f
              ? f.verdict === 'correct'
                ? 'right'
                : 'checked'
              : a?.answer
                ? 'answered'
                : 'not answered';
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-current={i === index ? 'step' : undefined}
                  aria-label={`Question ${i + 1}, ${state}${a?.flagged ? ', flagged' : ''}${view.redo[i] ? ', a redo' : ''}`}
                  className={`relative h-11 w-11 rounded-lg border-2 font-semibold focus-visible:outline-3 focus-visible:outline-brand ${
                    i === index ? 'border-brand' : 'border-border'
                  } ${
                    f
                      ? f.verdict === 'correct'
                        ? 'bg-ok text-white'
                        : 'bg-warn text-white'
                      : a?.answer
                        ? 'bg-brand/15'
                        : 'bg-card'
                  }`}
                >
                  {i + 1}
                  {a?.flagged && (
                    <span aria-hidden="true" className="absolute -top-1 -right-1 text-xs">
                      ⚑
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <section aria-label={`Question ${index + 1} of ${n}`} className="flex flex-col gap-4">
        <p className="text-sm font-semibold text-muted" aria-live="polite">
          Question {index + 1} of {n}
          {view.redo[index] && ' · from your error log'}
        </p>
        <ProblemView
          key={index}
          problem={problem}
          number={index + 1}
          answer={current?.answer ?? ''}
          onAnswer={(v) => update({ answer: v })}
          onSubmit={
            view.instant ? () => void checkNow() : index < n - 1 ? () => go(index + 1) : undefined
          }
          focus
          disabled={locked || busy}
          allowBlank={!view.instant}
        />
        {current?.answer && !locked && !mental && (
          <ConfidenceChips
            value={current.confidence}
            onChange={(c: MathConfidence) => update({ confidence: c })}
          />
        )}
        {showSkipPrompt && (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-warn/50 bg-background p-3">
            <output className="font-semibold">{MATH_COPY.skipPrompt}</output>
            <Button variant="secondary" onClick={() => go(nextOpen())}>
              Skip for now
            </Button>
            <Button variant="secondary" onClick={() => setDismissed((d) => new Set(d).add(index))}>
              Keep going
            </Button>
            <button
              type="button"
              onClick={() => setPromptOn(false)}
              className="text-sm text-brand underline focus-visible:outline-3 focus-visible:outline-brand"
            >
              Turn off these prompts
            </button>
          </div>
        )}

        {fb && <Feedback fb={fb} />}

        <div className="flex flex-wrap gap-3">
          {view.instant && !locked && (
            <Button disabled={busy || !current?.answer} onClick={() => void checkNow()}>
              {busy ? 'Checking…' : 'Check'}
            </Button>
          )}
          <Button variant="secondary" disabled={index === 0} onClick={() => go(index - 1)}>
            ← Previous
          </Button>
          {index < n - 1 && (
            <Button variant="secondary" onClick={() => go(index + 1)}>
              Next →
            </Button>
          )}
          {!view.instant && !current?.answer && blanks > 1 && (
            <Button variant="secondary" onClick={() => go(nextOpen())}>
              Skip
            </Button>
          )}
          {!locked && (
            <Button
              variant="secondary"
              aria-pressed={Boolean(current?.flagged)}
              onClick={() => update({ flagged: !current?.flagged })}
            >
              {current?.flagged ? '⚑ Flagged' : 'Flag to come back'}
            </Button>
          )}
        </div>
        {!locked && <Scratchpad key={`pad-${index}`} />}
      </section>

      <div className="flex flex-col gap-3 border-t border-border pt-5">
        <p className="text-sm text-muted" aria-live="polite">
          {answeredCount} of {n} answered
          {!view.instant &&
            blanks > 0 &&
            ` · blanks score ${view.amcScoring ? '1.5 points each' : 'nothing'}`}
        </p>
        <ErrorMessage message={error} />
        {confirming ? (
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-semibold">
              {blanks > 0
                ? `${blanks} left blank. Hand it in anyway?`
                : 'Hand it in? You can’t change answers after.'}
            </p>
            <Button disabled={busy} onClick={() => void handIn()}>
              {busy ? 'Handing in…' : 'Yes, hand it in'}
            </Button>
            <Button variant="secondary" onClick={() => setConfirming(false)}>
              Not yet
            </Button>
          </div>
        ) : (
          <Button className="self-start" disabled={busy} onClick={() => setConfirming(true)}>
            {view.instant ? 'Finish' : 'Hand it in'}
          </Button>
        )}
      </div>
    </div>
  );
}

function Feedback({ fb }: { fb: TestItemFeedback }) {
  const good = fb.verdict === 'correct';
  return (
    <div
      aria-live="polite"
      className={`flex flex-col gap-2 rounded-xl border-2 bg-card p-4 ${good ? 'border-ok' : 'border-warn'}`}
    >
      <p className={`font-semibold ${good ? 'text-ok' : 'text-warn'}`}>{fb.message}</p>
      {fb.note && (
        <p>
          <MathText text={fb.note} />
        </p>
      )}
      {!good && (
        <p>
          Right answer: <MathText text={fb.rightAnswer} />
        </p>
      )}
      <details className="rounded-xl bg-background p-3">
        <summary className="cursor-pointer font-semibold">Worked solution</summary>
        <MathText as="p" text={fb.solution} className="mt-2 leading-relaxed" />
      </details>
    </div>
  );
}

/** "Start" for a test, sprint or review: starts (or continues) the attempt, then opens it. */
export function StartTest({
  startKey,
  label,
  lessonId,
  attemptsPath = '/math/attempts',
}: {
  startKey: string;
  label: string;
  /** Started from a lesson (a Unit 15 mock): the attempt links back to it. */
  lessonId?: string;
  /** Where attempts open (Mental Math has its own pages). */
  attemptsPath?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setBusy(true);
    setError(null);
    try {
      const v = await apiJson(
        `/math/tests/${encodeURIComponent(startKey)}/start`,
        MathTestView,
        'POST',
        {},
      );
      router.push(
        `${attemptsPath}/${encodeURIComponent(v.attemptId)}${lessonId ? `?lesson=${encodeURIComponent(lessonId)}` : ''}`,
      );
    } catch (e) {
      setError(message(e, 'Could not start it. Try again.'));
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <ErrorMessage message={error} />
      <Button className="self-start" disabled={busy} onClick={() => void start()}>
        {busy ? 'Starting…' : label}
      </Button>
    </div>
  );
}
