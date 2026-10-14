'use client';

import type { LessonCard, LessonSteps } from '@storyforge/shared';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui';
import { splitWords } from '@/lib/tokens';
import { ExplainAnother } from '../tutor/explain-another';
import { PovSimulator } from './pov-simulator';
import type { StepProps } from './step-props';

type Learn = LessonSteps[1];

/**
 * Mini-lesson cards, one at a time. Clue-hunt cards need every clue found (or "Show me"); the POV
 * simulator needs every version read.
 */
export function LearnStep({
  step,
  done,
  busy,
  onComplete,
  lessonId,
}: StepProps<Learn> & { lessonId: string }) {
  const [index, setIndex] = useState(0);
  const [cardDone, setCardDone] = useState<boolean[]>(
    step.cards.map((c) => done || (c.kind !== 'clue-hunt' && c.kind !== 'pov-simulator')),
  );
  const card = step.cards[index];
  if (!card) return null;
  const isLast = index === step.cards.length - 1;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm font-semibold text-muted" aria-live="polite">
        Card {index + 1} of {step.cards.length}
      </p>
      <CardView
        key={index}
        card={card}
        onSolved={() => setCardDone(cardDone.map((d, i) => (i === index ? true : d)))}
      />
      <ExplainAnother key={`explain-${index}`} lessonId={lessonId} cardIndex={index} />
      <div className="flex gap-3">
        <Button variant="secondary" disabled={index === 0} onClick={() => setIndex(index - 1)}>
          ← Back
        </Button>
        {isLast ? (
          <Button
            disabled={busy || !cardDone[index]}
            onClick={() => onComplete({ cardsViewed: step.cards.length })}
          >
            {done ? 'Next' : 'Got it!'}
          </Button>
        ) : (
          <Button disabled={!cardDone[index]} onClick={() => setIndex(index + 1)}>
            Next card →
          </Button>
        )}
      </div>
    </div>
  );
}

function CardView({ card, onSolved }: { card: LessonCard; onSolved: () => void }) {
  const frame = 'rounded-2xl border border-border bg-card p-6 shadow-sm';
  switch (card.kind) {
    case 'definition':
      return (
        <div className={frame}>
          <h2 className="text-2xl font-bold">{card.title}</h2>
          <p className="mt-3 text-lg leading-relaxed">{card.body}</p>
        </div>
      );
    case 'example':
      return (
        <div className={frame}>
          <h2 className="text-2xl font-bold">{card.title}</h2>
          <blockquote className="mt-3 border-l-4 border-brand pl-4 text-xl whitespace-pre-line italic">
            {card.text}
          </blockquote>
          {card.note && <p className="mt-3 text-muted">{card.note}</p>}
        </div>
      );
    case 'compare':
      return (
        <div className={frame}>
          <h2 className="text-2xl font-bold">{card.title}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border p-4">
              <p className="text-sm font-semibold tracking-wide text-muted uppercase">
                {card.labels?.[0] ?? 'Telling'}
              </p>
              <p className="mt-1 text-lg whitespace-pre-line">{card.telling}</p>
            </div>
            <div className="rounded-xl border-2 border-brand p-4">
              <p className="text-sm font-semibold tracking-wide text-brand uppercase">
                {card.labels?.[1] ?? 'Showing'}
              </p>
              <p className="mt-1 text-lg whitespace-pre-line">{card.showing}</p>
            </div>
          </div>
          {card.note && <p className="mt-3 text-muted">{card.note}</p>}
        </div>
      );
    case 'clue-hunt':
      return <ClueHunt card={card} onSolved={onSolved} frame={frame} />;
    case 'pov-simulator':
      return <PovSimulator card={card} onSolved={onSolved} frame={frame} />;
  }
  const unreachable: never = card;
  return unreachable;
}

function ClueHunt({
  card,
  onSolved,
  frame,
}: {
  card: Extract<LessonCard, { kind: 'clue-hunt' }>;
  onSolved: () => void;
  frame: string;
}) {
  const clues = new Set(card.clues.map((c) => c.toLowerCase()));
  const foundRef = useRef(new Set<string>());
  const [found, setFound] = useState<Set<string>>(new Set());
  const [missTap, setMissTap] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const complete = revealed || found.size === clues.size;

  function tap(word: string) {
    if (complete) return;
    if (!clues.has(word)) {
      setMissTap(word);
      return;
    }
    setMissTap(null);
    // The ref updates immediately, so quick taps in a row are all counted.
    foundRef.current.add(word);
    setFound(new Set(foundRef.current));
    if (foundRef.current.size === clues.size) onSolved();
  }

  return (
    <div className={frame}>
      <h2 className="text-2xl font-bold">{card.title}</h2>
      <p className="mt-2 text-lg">{card.prompt}</p>
      <p className="mt-4 text-xl leading-loose whitespace-pre-line">
        {splitWords(card.text).map((p) =>
          p.word ? (
            <button
              key={p.index}
              type="button"
              onClick={() => tap(p.word ?? '')}
              aria-pressed={found.has(p.word) || (revealed && clues.has(p.word))}
              className={`rounded px-0.5 transition focus-visible:outline-2 focus-visible:outline-brand ${
                found.has(p.word) || (revealed && clues.has(p.word))
                  ? 'bg-brand font-semibold text-white'
                  : 'hover:bg-border'
              }`}
            >
              {p.text}
            </button>
          ) : (
            <span key={p.index}>{p.text}</span>
          ),
        )}
      </p>
      <div aria-live="polite" className="mt-3">
        {complete ? (
          <p className="font-semibold text-ok">
            ✓ {revealed ? 'Here are the clues.' : 'You found them all!'}
          </p>
        ) : (
          <p className="text-muted">
            Found {found.size} of {clues.size}
            {missTap ? ` · "${missTap}" isn't one. Keep looking!` : ''}
          </p>
        )}
      </div>
      {!complete && (
        <Button
          variant="secondary"
          className="mt-3"
          onClick={() => {
            setRevealed(true);
            onSolved();
          }}
        >
          Show me
        </Button>
      )}
    </div>
  );
}
