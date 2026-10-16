'use client';

import { MATH_CONFIDENCE, type MathConfidence } from '@storyforge/shared';
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';

/** Sure / Think so / Guessing after answering (math-design.md §3.2 B5). */
export function ConfidenceChips({
  value,
  onChange,
  disabled,
}: {
  value: MathConfidence | undefined;
  onChange: (v: MathConfidence) => void;
  disabled?: boolean;
}) {
  const name = useId();
  return (
    <fieldset className="flex flex-wrap items-center gap-2" disabled={disabled}>
      <legend className="mr-2 float-left text-sm font-semibold text-muted">
        How sure are you?
      </legend>
      {MATH_CONFIDENCE.map((c) => (
        <label
          key={c.value}
          className={`min-h-11 cursor-pointer rounded-full border-2 px-4 py-2 text-sm font-semibold has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-brand ${
            value === c.value ? 'border-brand bg-brand text-white' : 'border-border bg-card'
          }`}
        >
          <input
            type="radio"
            name={name}
            value={c.value}
            checked={value === c.value}
            onChange={() => onChange(c.value)}
            className="sr-only"
          />
          {c.label}
        </label>
      ))}
    </fieldset>
  );
}

// On/off settings kept in this browser only (a page still works when storage is blocked).
const settingListeners = new Set<() => void>();
const memory = new Map<string, boolean>();

function readSetting(key: string, fallback: boolean): boolean {
  if (memory.has(key)) return memory.get(key)!;
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v === 'on';
  } catch {
    return fallback;
  }
}

/** An on/off setting in localStorage (the server render uses `fallback`). */
export function useLocalSetting(key: string, fallback: boolean): [boolean, (on: boolean) => void] {
  const subscribe = useCallback((listener: () => void) => {
    settingListeners.add(listener);
    return () => {
      settingListeners.delete(listener);
    };
  }, []);
  const on = useSyncExternalStore(
    subscribe,
    () => readSetting(key, fallback),
    () => fallback,
  );
  const set = useCallback(
    (value: boolean) => {
      memory.set(key, value);
      try {
        localStorage.setItem(key, value ? 'on' : 'off');
      } catch {
        // Kept in memory for this page.
      }
      for (const l of settingListeners) l();
    },
    [key],
  );
  return [on, set];
}

/** The practice stopwatch setting (off by default). */
export const useStopwatchSetting = () => useLocalSetting('storyforge.math.stopwatch', false);

/** The current time, updated every second while `running`. */
export function useNow(running = true): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!running) return undefined;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [running]);
  return now;
}

/** Seconds since `since` (re-rendered every second while `running`). */
export function useElapsed(since: number, running: boolean): number {
  const now = useNow(running);
  return Math.max(0, Math.round((now - since) / 1000));
}

/**
 * A drawing pad beside a problem (pen, mouse or touch, an eraser and Clear) and a plain-text scratch
 * box for keyboard users (math-design.md §3.2 B6). Both stay in this page's memory: never saved or
 * sent. Remount it (a new `key`) for each problem.
 */
export function Scratchpad() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [notes, setNotes] = useState('');
  const notesId = useId();

  function point(e: React.PointerEvent<HTMLCanvasElement>) {
    const c = canvas.current!;
    const r = c.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * c.width,
      y: ((e.clientY - r.top) / r.height) * c.height,
    };
  }

  function down(e: React.PointerEvent<HTMLCanvasElement>) {
    const ctx = canvas.current?.getContext('2d');
    if (!ctx) return;
    drawing.current = true;
    canvas.current!.setPointerCapture(e.pointerId);
    const { x, y } = point(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    const ctx = canvas.current?.getContext('2d');
    if (!ctx || !drawing.current) return;
    const { x, y } = point(e);
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.lineWidth = tool === 'eraser' ? 18 : 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1f2937';
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function clear() {
    const c = canvas.current;
    c?.getContext('2d')?.clearRect(0, 0, c.width, c.height);
  }

  return (
    <details className="rounded-xl border border-border bg-card p-3">
      <summary className="cursor-pointer font-semibold">Scratchpad</summary>
      <div className="mt-3 flex flex-col gap-3">
        <fieldset className="flex flex-wrap gap-2">
          <legend className="sr-only">Drawing tools</legend>
          {(['pen', 'eraser'] as const).map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={tool === t}
              onClick={() => setTool(t)}
              className={`min-h-11 rounded-lg border px-3 text-sm font-semibold focus-visible:outline-3 focus-visible:outline-brand ${
                tool === t ? 'border-brand bg-brand text-white' : 'border-border'
              }`}
            >
              {t === 'pen' ? 'Pen' : 'Eraser'}
            </button>
          ))}
          <button
            type="button"
            onClick={clear}
            className="min-h-11 rounded-lg border border-border px-3 text-sm font-semibold focus-visible:outline-3 focus-visible:outline-brand"
          >
            Clear
          </button>
        </fieldset>
        {/* The canvas is an aid for pen, mouse or touch; the text box below does the same by keyboard. */}
        <canvas
          ref={canvas}
          width={640}
          height={320}
          aria-hidden="true"
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={() => (drawing.current = false)}
          onPointerLeave={() => (drawing.current = false)}
          className="w-full touch-none rounded-lg border border-border bg-white"
        />
        <label htmlFor={notesId} className="text-sm font-semibold">
          Scratch notes (not saved)
        </label>
        <textarea
          id={notesId}
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="rounded-xl border border-border bg-background px-3 py-2 font-mono focus-visible:outline-3 focus-visible:outline-brand"
        />
      </div>
    </details>
  );
}
