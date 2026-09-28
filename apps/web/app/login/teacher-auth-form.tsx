'use client';

import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';
import { Button, ErrorMessage, Field } from '@/components/ui';
import { ApiError, apiSend } from '@/lib/api-client';

/** Login and registration share one form; registration adds a name field. */
export function TeacherAuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError(null);
    try {
      await apiSend(mode === 'login' ? '/auth/login' : '/auth/register', 'POST', {
        email: form.get('email'),
        password: form.get('password'),
        ...(mode === 'register' ? { displayName: form.get('displayName') } : {}),
      });
      router.push('/classes');
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e.userMessage : 'Could not reach StoryForge. Try again.');
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      {mode === 'register' && (
        <Field
          id="displayName"
          name="displayName"
          label="Your name (shown to students)"
          autoComplete="name"
          required
          maxLength={60}
        />
      )}
      <Field id="email" name="email" type="email" label="Email" autoComplete="email" required />
      <Field
        id="password"
        name="password"
        type="password"
        label="Password"
        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        hint={mode === 'register' ? 'At least 10 characters.' : undefined}
        required
        minLength={mode === 'register' ? 10 : undefined}
      />
      <ErrorMessage message={error} />
      <Button type="submit" disabled={busy}>
        {busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
      </Button>
    </form>
  );
}
