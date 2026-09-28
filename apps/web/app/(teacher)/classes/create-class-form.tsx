'use client';

import { ClassSummary } from '@storyforge/shared';
import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';
import { Button, ErrorMessage, Field } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';

export function CreateClassForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError(null);
    try {
      const created = await apiJson('/teacher/classes', ClassSummary, 'POST', {
        name: form.get('name'),
        gradeLevel: Number(form.get('gradeLevel')),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      router.push(`/classes/${created.id}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e.userMessage : 'Could not create the class.');
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-end"
      noValidate
    >
      <Field
        id="className"
        name="name"
        label="Class name"
        placeholder="e.g. 7B Creative Writing"
        required
        maxLength={80}
      />
      <div className="flex flex-col gap-1">
        <label htmlFor="gradeLevel" className="font-medium">
          Grade
        </label>
        <select
          id="gradeLevel"
          name="gradeLevel"
          defaultValue="7"
          className="min-h-11 rounded-xl border border-border bg-card px-3 py-2 focus-visible:outline-3 focus-visible:outline-brand"
        >
          <option value="6">Grade 6</option>
          <option value="7">Grade 7</option>
          <option value="8">Grade 8</option>
        </select>
      </div>
      <Button type="submit" disabled={busy}>
        {busy ? 'Creating…' : 'Create class'}
      </Button>
      <div className="sm:col-span-3">
        <ErrorMessage message={error} />
      </div>
    </form>
  );
}
