'use client';

import { AdminOrg } from '@storyforge/shared';
import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';
import { Button, ErrorMessage, Field } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';

/** Set a school's daily AI budget in dollars; empty means no budget. */
export function BudgetForm({
  orgId,
  name,
  cents,
}: {
  orgId: string;
  name: string;
  cents: number | null;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const entry = new FormData(event.currentTarget).get('budget');
    const raw = typeof entry === 'string' ? entry.trim() : '';
    const value = Number(raw);
    if (raw !== '' && (!Number.isFinite(value) || value < 0)) {
      setError('Enter an amount in dollars, or leave it empty for no budget.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await apiJson(`/admin/orgs/${orgId}`, AdminOrg, 'PATCH', {
        aiDailyBudgetCents: raw === '' ? null : Math.round(value * 100),
      });
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e.userMessage : 'Could not save the budget.');
    }
    setBusy(false);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2" noValidate>
      <div className="flex flex-wrap items-end gap-3">
        <Field
          id={`budget-${orgId}`}
          name="budget"
          label={`Daily budget for ${name} ($)`}
          inputMode="decimal"
          defaultValue={cents === null ? '' : (cents / 100).toFixed(2)}
          className="w-32"
        />
        <Button type="submit" variant="secondary" disabled={busy}>
          Save
        </Button>
      </div>
      <ErrorMessage message={error} />
    </form>
  );
}
