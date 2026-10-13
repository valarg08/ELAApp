'use client';

import type { WordBankEntry } from '@storyforge/shared';
import { SENSES, senses } from '@storyforge/writing-analysis';
import { SENSE_ICONS } from './sense-icons';

/** Live sense tracker (DESIGN.md §10, Unit 6): which senses the draft uses, updated as you type. */
export function SenseTracker({ text, own = [] }: { text: string; own?: readonly WordBankEntry[] }) {
  const { counts, used } = senses(text, own);
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-semibold">
        Senses so far: {used.length} of 5{used.length === 5 && ' 🎉'}
      </p>
      <ul className="flex flex-wrap gap-2" aria-label="Senses in your writing">
        {SENSES.map((s) => (
          <li
            key={s}
            className={`rounded-full border px-3 py-0.5 text-sm ${
              counts[s] > 0 ? 'border-ok font-semibold text-ok' : 'border-border text-muted'
            }`}
          >
            <span aria-hidden="true">{SENSE_ICONS[s]} </span>
            {s} {counts[s] > 0 ? '✓' : <span className="sr-only">(not yet)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
