'use client';

import { MathCardResponse, type WorkedExampleCard, checkWorkedStep } from '@storyforge/shared';
import { useEffect, useRef, useState } from 'react';
import { Button, ErrorMessage } from '@/components/ui';
import { MathText } from '@/components/math-text';
import { ApiError, apiJson } from '@/lib/api-client';
import { MATH_COPY } from './copy';
import { AnswerBox } from './answer-box';
import { OwlIcon } from '@/components/owl-icon';

type Step = WorkedExampleCard['steps'][number];

/**
 * A worked example that opens one step at a time (math-design.md §3.1 A4). A step with `try` asks
 * the student to do it first, checked with math-check; "Show me" opens it after two tries. The card
 * is done when every step is open.
 */
export function WorkedExample({
  card,
  frame,
  onSolved,
}: {
  card: WorkedExampleCard;
  frame: string;
  onSolved: () => void;
}) {
  const [open, setOpen] = useState(1);
  const total = card.steps.length;

  const advance = () => setOpen((n) => n + 1);

  return (
    <div className={frame}>
      <h2 className="text-2xl font-bold">{card.title}</h2>
      <p className="mt-3 text-lg leading-relaxed">
        <MathText text={card.problem} />
      </p>
      <ol className="mt-4 flex flex-col gap-3" aria-label="Steps">
        {card.steps.slice(0, open).map((s, i) => (
          <li key={i} className="rounded-xl border border-border bg-background p-4">
            <p className="text-sm font-semibold text-muted">Step {i + 1}</p>
            <StepView
              step={s}
              last={i === open - 1}
              more={i < total - 1}
              onOpen={advance}
              onShown={i === total - 1 ? onSolved : undefined}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}

function StepView({
  step,
  last,
  more,
  onOpen,
  onShown,
}: {
  step: Step;
  last: boolean;
  more: boolean;
  onOpen: () => void;
  /** The final step: the card is done once its text is showing. */
  onShown?: () => void;
}) {
  const [answer, setAnswer] = useState('');
  const [tries, setTries] = useState(0);
  const [shown, setShown] = useState(!step.try);
  const told = useRef(false);
  useEffect(() => {
    if (shown && onShown && !told.current) {
      told.current = true;
      onShown();
    }
  }, [shown, onShown]);
  const [message, setMessage] = useState<{ text: string; good: boolean } | null>(null);

  function check() {
    if (!step.try || !answer.trim()) return;
    const r = checkWorkedStep(step.try, answer);
    if (r.status === 'correct') {
      setShown(true);
      setMessage({ text: MATH_COPY.correct, good: true });
    } else if (r.status === 'wrong') {
      setTries((n) => n + 1);
      setMessage({
        text: `${MATH_COPY.notQuite} Look at the steps above and try again.`,
        good: false,
      });
    } else {
      setMessage({ text: r.message, good: false });
    }
  }

  if (!shown && step.try) {
    return (
      <div className="mt-2 flex flex-col gap-3">
        <p className="font-semibold">
          <MathText text={step.try.prompt ?? 'Your turn: do this step.'} />
        </p>
        <AnswerBox
          value={answer}
          onChange={(v) => {
            setAnswer(v);
            setMessage(null);
          }}
          onSubmit={check}
          form={step.try.form}
          focusOnMount
        />
        {message && (
          <output className={`block font-semibold ${message.good ? 'text-ok' : 'text-warn'}`}>
            {message.text}
          </output>
        )}
        <div className="flex flex-wrap gap-3">
          <Button disabled={!answer.trim()} onClick={check}>
            Check
          </Button>
          {tries >= 2 && (
            <Button variant="secondary" onClick={() => setShown(true)}>
              Show me
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-1 flex flex-col gap-3">
      {message?.good && <output className="block font-semibold text-ok">{message.text}</output>}
      <p className="leading-relaxed">
        <MathText text={step.text} />
      </p>
      {last && more && (
        <Button variant="secondary" className="self-start" onClick={onOpen}>
          Next step
        </Button>
      )}
    </div>
  );
}

/** "Explain it another way" on a Math Learn card (math-design.md §3.3 C2): steps and a key idea. */
export function MathCardTutor({ lessonId, cardIndex }: { lessonId: string; cardIndex: number }) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<MathCardResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ask() {
    setBusy(true);
    setError(null);
    try {
      setResult(
        await apiJson('/ai/math/card', MathCardResponse, 'POST', { lessonId, cardIndex, attempt }),
      );
      setAttempt((a) => Math.min(4, a + 1));
    } catch (e) {
      setError(e instanceof ApiError ? e.userMessage : 'Could not reach Quill. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Button variant="secondary" className="self-start" disabled={busy} onClick={() => void ask()}>
        <OwlIcon className="mr-1" />
        {busy
          ? 'Quill is thinking…'
          : result
            ? 'Explain it yet another way'
            : 'Explain it another way'}
      </Button>
      <ErrorMessage message={error} />
      <div aria-live="polite">
        {result && (
          <div className="flex flex-col gap-3 rounded-2xl border border-brand/40 bg-background p-5">
            <ol className="ml-5 flex list-decimal flex-col gap-1">
              {result.steps.map((s, i) => (
                <li key={i}>
                  <MathText text={s} />
                </li>
              ))}
            </ol>
            <p className="text-sm">
              <strong>Key idea:</strong> <MathText text={result.keyIdea} />
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
