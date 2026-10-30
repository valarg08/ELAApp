'use client';

import { SatAttemptView, SatPracticeView } from '@storyforge/shared';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, ErrorMessage } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';

/** Starts (or resumes) the week's test and opens it. */
export function StartSatTest({ week, label }: { week: number; label: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function start() {
    setBusy(true);
    setError(null);
    try {
      const view = await apiJson(`/sat/weeks/${week}/start`, SatAttemptView, 'POST');
      router.push(`/sat/test/${view.id}`);
    } catch (e) {
      setError(e instanceof ApiError ? e.userMessage : 'Could not start the test. Try again.');
      setBusy(false);
    }
  }
  return (
    <div className="flex flex-col gap-2">
      <Button onClick={() => void start()} disabled={busy}>
        {busy ? 'Opening…' : label}
      </Button>
      <ErrorMessage message={error} />
    </div>
  );
}

/** Starts a set of adaptive practice questions and opens it. */
export function StartPractice({ label }: { label: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function start() {
    setBusy(true);
    setError(null);
    try {
      const view = await apiJson('/sat/practice/start', SatPracticeView, 'POST');
      router.push(`/sat/practice/${view.id}`);
    } catch (e) {
      setError(e instanceof ApiError ? e.userMessage : 'Could not start practice. Try again.');
      setBusy(false);
    }
  }
  return (
    <div className="flex flex-col gap-2">
      <Button onClick={() => void start()} disabled={busy}>
        {busy ? 'Opening…' : label}
      </Button>
      <ErrorMessage message={error} />
    </div>
  );
}
