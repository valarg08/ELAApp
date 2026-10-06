'use client';

import type { ActivityContent } from '@storyforge/shared';
import { useState } from 'react';
import { Button } from '@/components/ui';
import type { ActivityResult } from './types';

type Activity = Extract<ActivityContent, { type: 'SORT' }>;

/**
 * Tap-to-place sorting: every item has a button per group, so it works with keyboard, touch and
 * screen readers. Wrong placements go back to the pile after "Check".
 */
export function Sort({
  activity,
  onDone,
}: {
  activity: Activity;
  onDone: (r: ActivityResult) => void;
}) {
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);

  const unplaced = activity.items.filter((i) => !placed[i.id]);
  const bucketLabel = (id: string) => activity.buckets.find((b) => b.id === id)?.label ?? id;

  function place(itemId: string, bucketId: string) {
    setPlaced((prev) => ({ ...prev, [itemId]: bucketId }));
    setMessage(null);
  }

  function unplace(itemId: string) {
    setPlaced((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  }

  function check() {
    setAttempts((n) => n + 1);
    const wrong = activity.items.filter((i) => placed[i.id] !== i.bucketId);
    if (wrong.length === 0) {
      setSolved(true);
      setMessage(null);
      return;
    }
    const next = { ...placed };
    for (const w of wrong) delete next[w.id];
    setPlaced(next);
    setMessage(
      `${activity.items.length - wrong.length} of ${activity.items.length} right. The ${wrong.length === 1 ? 'one' : wrong.length} that didn't fit went back to the pile. Try again!`,
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-lg">{activity.instructions}</p>

      {unplaced.length > 0 && (
        <section aria-label="Items to sort" className="flex flex-col gap-3">
          {unplaced.map((item) => (
            <div key={item.id} className="rounded-xl border border-border bg-card p-3">
              <p className="mb-2 font-medium">{item.text}</p>
              <div className="flex flex-wrap gap-2">
                {activity.buckets.map((b) => (
                  <Button
                    key={b.id}
                    variant="secondary"
                    className="min-h-10 px-3 text-sm"
                    onClick={() => place(item.id, b.id)}
                    aria-label={`Put "${item.text}" in ${b.label}`}
                  >
                    → {b.label}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      <div
        className={`grid gap-3 ${activity.buckets.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}
      >
        {activity.buckets.map((b) => {
          const items = activity.items.filter((i) => placed[i.id] === b.id);
          return (
            <section
              key={b.id}
              aria-label={b.label}
              className="min-h-24 rounded-xl border-2 border-dashed border-border p-3"
            >
              <h3 className="mb-2 font-semibold">{b.label}</h3>
              <ul className="flex flex-col gap-2">
                {items.map((i) => (
                  <li
                    key={i.id}
                    className={`flex items-center justify-between gap-2 rounded-lg bg-card px-3 py-2 text-sm ${solved ? 'border border-ok' : 'border border-border'}`}
                  >
                    <span>{i.text}</span>
                    {!solved && (
                      <button
                        type="button"
                        onClick={() => unplace(i.id)}
                        className="rounded px-2 text-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-brand"
                        aria-label={`Take "${i.text}" out of ${bucketLabel(b.id)}`}
                      >
                        ✕
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <div aria-live="polite">
        {solved && (
          <p className="rounded-xl border border-ok bg-card px-4 py-3">
            <strong className="text-ok">✓ All sorted!</strong> Nice work.
          </p>
        )}
        {message && <p className="rounded-xl border border-warn bg-card px-4 py-3">{message}</p>}
      </div>

      {solved ? (
        <Button className="self-start" onClick={() => onDone({ correct: true, attempts })}>
          Done
        </Button>
      ) : (
        <Button className="self-start" onClick={check} disabled={unplaced.length > 0}>
          Check
        </Button>
      )}
    </div>
  );
}
