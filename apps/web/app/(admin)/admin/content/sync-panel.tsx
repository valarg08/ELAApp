'use client';

import { ContentSyncResponse } from '@storyforge/shared';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, ErrorMessage } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';

/** Check /content (dry run) or load it into the database. */
export function SyncPanel({ invalid }: { invalid: boolean }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function run(dryRun: boolean) {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const r = await apiJson('/admin/content/sync', ContentSyncResponse, 'POST', { dryRun });
      const counts = `${r.units} units, ${r.lessons} lessons, ${r.activities} activities`;
      if (r.errors.length > 0) setError(`The content has ${r.errors.length} problem(s).`);
      else setResult(r.dryRun ? `Valid: ${counts}.` : `Synced ${counts}.`);
      if (r.orphans.length > 0) {
        setResult((s) => `${s ?? ''} No longer in /content (kept): ${r.orphans.join(', ')}.`);
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e.userMessage : 'Could not reach StoryForge.');
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" disabled={busy} onClick={() => void run(true)}>
          Check content
        </Button>
        <Button disabled={busy || invalid} onClick={() => void run(false)}>
          Sync to database
        </Button>
      </div>
      <output className="block text-sm">
        {busy ? 'Working… this can take a few seconds.' : result}
      </output>
      <ErrorMessage message={error} />
    </div>
  );
}
