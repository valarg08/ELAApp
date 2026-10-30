'use client';

import { approx, evaluate } from '@storyforge/math-check';
import { SAT_REFERENCE } from '@storyforge/shared';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { MathText } from '@/components/math-text';
import { Button } from '@/components/ui';

/**
 * A dialog opened from a button: Escape closes it and focus goes back to the button that opened
 * it. `open` is the page's state; the browser's own <dialog> keeps focus inside while it is open.
 */
export function ToolDialog({
  title,
  open,
  onClose,
  children,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      className="m-auto max-h-[90vh] w-[min(92vw,34rem)] overflow-y-auto rounded-2xl bg-card p-5 text-foreground backdrop:bg-black/60"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold">{title}</h2>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
        {children}
      </div>
    </dialog>
  );
}

/** The SAT reference sheet (area, volume, triangles), as on the real test. */
export function ReferenceSheet() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {SAT_REFERENCE.map((group) => (
        <section key={group.title} aria-label={group.title}>
          <h3 className="font-bold">{group.title}</h3>
          <ul className="mt-1 flex flex-col gap-1">
            {group.facts.map((fact) => (
              <li key={fact}>
                <MathText text={fact} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

const KEYS: { label: string; insert: string; name: string }[] = [
  { label: '7', insert: '7', name: '7' },
  { label: '8', insert: '8', name: '8' },
  { label: '9', insert: '9', name: '9' },
  { label: '÷', insert: '/', name: 'divide' },
  { label: '4', insert: '4', name: '4' },
  { label: '5', insert: '5', name: '5' },
  { label: '6', insert: '6', name: '6' },
  { label: '×', insert: '*', name: 'times' },
  { label: '1', insert: '1', name: '1' },
  { label: '2', insert: '2', name: '2' },
  { label: '3', insert: '3', name: '3' },
  { label: '−', insert: '-', name: 'minus' },
  { label: '0', insert: '0', name: '0' },
  { label: '.', insert: '.', name: 'decimal point' },
  { label: '(', insert: '(', name: 'open bracket' },
  { label: ')', insert: ')', name: 'close bracket' },
  { label: '+', insert: '+', name: 'plus' },
  { label: 'xⁿ', insert: '^', name: 'power' },
  { label: '√', insert: 'sqrt(', name: 'square root' },
  { label: 'π', insert: 'pi', name: 'pi' },
];

/** The value of what was typed, as a decimal with up to 10 significant digits, or null. */
export function calculate(expression: string): string | null {
  try {
    const n = approx(evaluate(expression.replace(/[×]/g, '*').replace(/[÷]/g, '/')));
    return Number.isFinite(n) ? String(Number(n.toPrecision(10))) : null;
  } catch {
    return null;
  }
}

/** A small calculator for the test: type or press keys, then = (the answer is a decimal). */
export function Calculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const add = (t: string) => {
    setResult(null);
    setExpression((e) => e + t);
  };
  const equals = () => setResult(expression.trim() ? (calculate(expression) ?? 'Error') : null);
  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-1">
        <span className="font-semibold">Type a calculation</span>
        <input
          value={expression}
          onChange={(e) => {
            setResult(null);
            setExpression(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') equals();
          }}
          inputMode="text"
          autoComplete="off"
          spellCheck={false}
          className="min-h-11 rounded-xl border border-border bg-card px-3 text-lg focus-visible:outline-3 focus-visible:outline-brand"
        />
      </label>
      <p aria-live="polite" className="min-h-8 text-2xl font-bold">
        {result !== null && <>= {result}</>}
      </p>
      <div className="grid grid-cols-4 gap-2">
        {KEYS.map((k) => (
          <Button
            key={k.name}
            variant="secondary"
            aria-label={k.name}
            onClick={() => add(k.insert)}
            className="px-0"
          >
            {k.label}
          </Button>
        ))}
        <Button
          variant="secondary"
          aria-label="clear"
          onClick={() => {
            setExpression('');
            setResult(null);
          }}
          className="px-0"
        >
          C
        </Button>
        <Button
          variant="secondary"
          aria-label="delete the last character"
          onClick={() => {
            setResult(null);
            setExpression((e) => e.slice(0, -1));
          }}
          className="px-0"
        >
          ⌫
        </Button>
        <Button aria-label="equals" onClick={equals} className="col-span-2 px-0">
          =
        </Button>
      </div>
      <p className="text-sm text-muted">
        Use ^ for powers, √( for square roots and π for pi. Answers are decimals.
      </p>
    </div>
  );
}
