'use client';

import {
  DEVICE_GUIDES,
  type FigurativeHelper as FigurativeHelperConfig,
  fillSubject,
} from '@storyforge/shared';
import type { Device } from '@storyforge/writing-analysis';
import { useId, useState } from 'react';
import { Button } from '@/components/ui';

const SEEDS_SHOWN = 3;

/**
 * The simile / metaphor / personification helper (DESIGN.md §10, Unit 6): a scaffold, not a
 * generator. Pick a subject and a device; get sentence frames with blanks and three idea seeds.
 * "Use this frame" puts the frame at the cursor for the student to finish.
 */
export function FigurativeHelper({
  helper,
  onUseFrame,
}: {
  helper: FigurativeHelperConfig;
  onUseFrame: (frame: string) => void;
}) {
  const id = useId();
  const [subject, setSubject] = useState('');
  const [device, setDevice] = useState<Device>(helper.devices[0] ?? 'simile');
  const [round, setRound] = useState(0);
  const guide = DEVICE_GUIDES[device];
  const seeds = Array.from(
    { length: SEEDS_SHOWN },
    (_, i) => guide.seeds[(round * SEEDS_SHOWN + i) % guide.seeds.length] ?? '',
  );
  const named = subject.trim() !== '';

  return (
    <section
      aria-labelledby={`${id}-title`}
      className="flex flex-col gap-3 rounded-xl border border-brand/40 bg-background p-4"
    >
      <h2 id={`${id}-title`} className="font-semibold">
        <span aria-hidden="true">✨ </span>
        {helper.label}
      </h2>
      <div className="flex flex-col gap-1">
        <label htmlFor={`${id}-subject`} className="text-sm font-medium">
          1. What do you want to describe?
        </label>
        <input
          id={`${id}-subject`}
          value={subject}
          maxLength={40}
          autoComplete="off"
          placeholder="the storm, my little brother, the old bus…"
          onChange={(e) => setSubject(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-2 focus-visible:outline-3 focus-visible:outline-brand"
        />
        {helper.subjects.length > 0 && (
          <div className="flex flex-wrap gap-1.5" aria-label="Subject ideas">
            {helper.subjects.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSubject(s)}
                aria-pressed={subject === s}
                className="rounded-full border border-border bg-card px-2.5 py-0.5 text-sm hover:bg-border focus-visible:outline-3 focus-visible:outline-brand"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
      {helper.devices.length > 1 && (
        <fieldset className="flex flex-col gap-1">
          <legend className="text-sm font-medium">2. Choose a device</legend>
          <div className="flex flex-wrap gap-2">
            {helper.devices.map((d) => (
              <div key={d}>
                <input
                  id={`${id}-${d}`}
                  type="radio"
                  name={`${id}-device`}
                  className="peer sr-only"
                  checked={device === d}
                  onChange={() => {
                    setDevice(d);
                    setRound(0);
                  }}
                />
                <label
                  htmlFor={`${id}-${d}`}
                  className="inline-block cursor-pointer rounded-full border border-border bg-card px-3 py-1 peer-checked:border-brand peer-checked:bg-brand peer-checked:text-white peer-focus-visible:outline-3 peer-focus-visible:outline-brand"
                >
                  <span aria-hidden="true">{DEVICE_GUIDES[d].icon} </span>
                  {DEVICE_GUIDES[d].label}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      )}
      <div className="rounded-lg bg-card p-3" aria-live="polite">
        <p>
          <strong>
            {guide.icon} {guide.label}:
          </strong>{' '}
          {guide.definition} <em>“{guide.example}”</em>
        </p>
        {named ? (
          <>
            <p className="mt-3 text-sm font-semibold">Frames to finish</p>
            <ul className="mt-1 flex flex-col gap-1.5">
              {guide.frames.map((f) => {
                const frame = fillSubject(f, subject);
                return (
                  <li key={f} className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm">{frame}</span>
                    <button
                      type="button"
                      onClick={() => onUseFrame(frame)}
                      className="text-sm font-semibold text-brand underline focus-visible:outline-3 focus-visible:outline-brand"
                    >
                      Use this frame
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-sm font-semibold">Ideas to get you thinking</p>
            <ul className="mt-1 list-disc pl-5 text-sm">
              {seeds.map((s) => (
                <li key={s}>{fillSubject(s, subject)}</li>
              ))}
            </ul>
            <Button variant="secondary" className="mt-2" onClick={() => setRound((r) => r + 1)}>
              More ideas
            </Button>
          </>
        ) : (
          <p className="mt-2 text-sm text-muted">Type a subject to see frames and ideas.</p>
        )}
      </div>
      <p className="text-sm text-muted">
        The frames are starters: fill the blanks with your own words. Quill checks your line when
        you press “Check my writing”.
      </p>
    </section>
  );
}
