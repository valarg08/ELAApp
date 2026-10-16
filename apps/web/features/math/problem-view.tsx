'use client';

import { CHOICE_LETTERS } from '@storyforge/math-check';
import type { MathProblemPublic } from '@storyforge/shared';
import { useRef } from 'react';
import { MathText } from '@/components/math-text';
import { AnswerBox } from './answer-box';

const svgSrc = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

/**
 * A problem's figure: a drawn SVG from the content (checked by content:check) with its alt text,
 * "Not drawn to scale" unless the figure says it is, and "Enlarge" (a dialog: Esc closes it and
 * focus returns to the button).
 */
export function ProblemFigure({ figure }: { figure: NonNullable<MathProblemPublic['figure']> }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  if (!figure.svg) return null;
  const close = () => {
    dialog.current?.close();
    opener.current?.focus();
  };
  return (
    <figure className="flex flex-col items-start gap-1">
      {/* As an image, the SVG can never run anything; a white card keeps its lines visible in dark mode. */}
      {/* oxlint-disable-next-line nextjs/no-img-element -- an inline data: SVG, not a file to optimise */}
      <img
        src={svgSrc(figure.svg)}
        alt={figure.alt}
        className="w-full max-w-xs rounded-xl bg-white p-2 text-black"
      />
      <figcaption className="flex flex-wrap items-center gap-3 text-sm text-muted">
        {figure.scale !== 'to-scale' && <span>Not drawn to scale</span>}
        <button
          ref={opener}
          type="button"
          onClick={() => dialog.current?.showModal()}
          className="text-brand underline focus-visible:outline-3 focus-visible:outline-brand"
        >
          Enlarge the figure
        </button>
      </figcaption>
      <dialog
        ref={dialog}
        aria-label="Figure, enlarged"
        onClose={() => opener.current?.focus()}
        className="m-auto max-h-[90vh] w-[min(90vw,40rem)] rounded-2xl bg-card p-4 text-foreground backdrop:bg-black/60"
      >
        <div className="flex flex-col gap-3">
          {/* oxlint-disable-next-line nextjs/no-img-element -- an inline data: SVG */}
          <img
            src={svgSrc(figure.svg)}
            alt={figure.alt}
            className="w-full rounded-xl bg-white p-3"
          />
          {figure.scale !== 'to-scale' && <p className="text-sm text-muted">Not drawn to scale</p>}
          <button
            type="button"
            onClick={close}
            className="self-end rounded-xl border border-border px-4 py-2 font-semibold focus-visible:outline-3 focus-visible:outline-brand"
          >
            Close
          </button>
        </div>
      </dialog>
    </figure>
  );
}

/**
 * One problem: the prompt (with math), the figure, and either the five choices (A)–(E) or a typed
 * answer box. Used by practice, marked sets, tests, reviews and the error log.
 */
export function ProblemView({
  problem,
  number,
  answer,
  onAnswer,
  onSubmit,
  disabled,
  allowBlank,
}: {
  problem: MathProblemPublic;
  number?: number;
  answer: string;
  onAnswer: (value: string) => void;
  onSubmit?: () => void;
  disabled?: boolean;
  /** Marked sets and tests: a chosen answer can be cleared to leave the problem blank. */
  allowBlank?: boolean;
}) {
  const name = `problem-${problem.id}-${problem.seed ?? ''}-${number ?? ''}`;
  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg leading-relaxed">
        {number !== undefined && <span className="mr-2 font-bold text-muted">{number}.</span>}
        <MathText text={problem.prompt} />
      </p>
      {problem.figure && <ProblemFigure figure={problem.figure} />}
      {problem.choices ? (
        <fieldset className="flex flex-col gap-2">
          <legend className="sr-only">Choices</legend>
          {problem.choices.map((choice, i) => {
            const letter = CHOICE_LETTERS[i]!;
            const checked = answer === letter;
            return (
              <label
                key={letter}
                className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border-2 bg-card px-4 py-2 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-brand ${
                  checked ? 'border-brand' : 'border-border'
                } ${disabled ? 'cursor-default opacity-80' : ''}`}
              >
                <input
                  type="radio"
                  name={name}
                  value={letter}
                  checked={checked}
                  disabled={disabled}
                  onChange={() => onAnswer(letter)}
                  className="h-5 w-5 accent-brand"
                />
                <span className="font-semibold">({letter})</span>
                <MathText text={choice} />
              </label>
            );
          })}
          {allowBlank && answer && !disabled && (
            <button
              type="button"
              onClick={() => onAnswer('')}
              className="self-start text-sm text-brand underline"
            >
              Clear my choice (leave it blank)
            </button>
          )}
        </fieldset>
      ) : (
        <AnswerBox
          value={answer}
          onChange={onAnswer}
          onSubmit={onSubmit}
          form={problem.form}
          disabled={disabled}
        />
      )}
    </div>
  );
}
