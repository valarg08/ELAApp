'use client';

import { countWords } from '@storyforge/shared';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui';

/**
 * Shown when the draft was saved somewhere else (another tab or device) since this tab last saved.
 * The student chooses which version continues; nothing is merged silently.
 */
export function ConflictDialog({
  mine,
  theirs,
  onKeepMine,
  onUseTheirs,
}: {
  mine: string;
  theirs: string | null;
  onKeepMine: () => void;
  onUseTheirs: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = theirs !== null;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="conflict-title"
      aria-describedby="conflict-desc"
      // A choice is required, so Escape doesn't close it.
      onCancel={(e) => e.preventDefault()}
      className="m-auto w-[min(56rem,calc(100%-2rem))] rounded-2xl border border-border bg-card p-6 text-foreground shadow-xl backdrop:bg-black/50"
    >
      {open && (
        <div className="flex flex-col gap-4">
          <h2 id="conflict-title" className="text-2xl font-bold">
            This writing changed somewhere else
          </h2>
          <p id="conflict-desc" className="text-muted">
            It was saved in another tab or on another device. Which version do you want to keep? If
            you keep yours, the other one stays in your version history. If you use the other one,
            the changes in this tab are dropped.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <Preview title="Your version (this tab)" text={mine} />
            <Preview title="The other version" text={theirs} />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={onKeepMine}>Keep my version</Button>
            <Button variant="secondary" onClick={onUseTheirs}>
              Use the other version
            </Button>
          </div>
        </div>
      )}
    </dialog>
  );
}

function Preview({ title, text }: { title: string; text: string }) {
  const words = countWords(text);
  return (
    <section className="flex flex-col gap-2">
      <h3 className="font-semibold">
        {title} <span className="font-normal text-muted">· {words} words</span>
      </h3>
      <p className="max-h-60 overflow-y-auto rounded-xl border border-border bg-background p-3 whitespace-pre-wrap">
        {text || <span className="text-muted italic">(empty)</span>}
      </p>
    </section>
  );
}
