'use client';

import { CHOICE_LETTERS } from '@storyforge/math-check';
import type { MathProblemPublic } from '@storyforge/shared';
import { MathText } from '@/components/math-text';
import { AnswerBox } from './answer-box';

/** A problem's figure: a drawn SVG from the content (checked by content:check) with its alt text. */
export function ProblemFigure({ figure }: { figure: NonNullable<MathProblemPublic['figure']> }) {
  if (!figure.svg) return null;
  // As an image, the SVG can never run anything; a white card keeps its lines visible in dark mode.
  return (
    // oxlint-disable-next-line nextjs/no-img-element -- an inline data: SVG, not a file to optimise
    <img
      src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(figure.svg)}`}
      alt={figure.alt}
      className="w-full max-w-xs rounded-xl bg-white p-2 text-black"
    />
  );
}

/**
 * One problem: the prompt (with math), the figure, and either the five choices (A)–(E) or a typed
 * answer box. Used by practice, marked sets and the error log.
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
  /** Marked sets: a chosen answer can be cleared to leave the problem blank. */
  allowBlank?: boolean;
}) {
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
                  name={`problem-${problem.id}`}
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
