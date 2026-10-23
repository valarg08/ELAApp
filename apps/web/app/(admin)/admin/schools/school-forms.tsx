'use client';

import { AdminOrg, AdminTeacher, TeacherCredential } from '@storyforge/shared';
import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';
import { Button, ErrorMessage, Field } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';

const selectClass =
  'min-h-11 rounded-xl border border-border bg-card px-3 py-2 focus-visible:outline-3 focus-visible:outline-brand';

export function CreateOrgForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    setBusy(true);
    setError(null);
    try {
      await apiJson('/admin/orgs', AdminOrg, 'POST', {
        name: form.get('name'),
        country: form.get('country') || undefined,
        timezone: form.get('timezone') || 'UTC',
      });
      formEl.reset();
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e.userMessage : 'Could not add the school.');
    }
    setBusy(false);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-4 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-end"
      noValidate
    >
      <Field id="orgName" name="name" label="School name" required maxLength={120} />
      <Field id="orgCountry" name="country" label="Country" maxLength={60} />
      <Field id="orgTimezone" name="timezone" label="Time zone" defaultValue="UTC" maxLength={60} />
      <Button type="submit" disabled={busy}>
        Add school
      </Button>
      <div className="sm:col-span-4">
        <ErrorMessage message={error} />
      </div>
    </form>
  );
}

/** A password shown once, after creating a teacher or resetting their password. */
function NewPassword({
  credential,
  onDone,
}: {
  credential: TeacherCredential;
  onDone: () => void;
}) {
  return (
    <output className="flex flex-col gap-2 rounded-xl border-2 border-accent bg-card p-4">
      <span className="font-semibold">
        Login for {credential.teacher.displayName}. Copy it now: it is not shown again.
      </span>
      <span>
        Email: <strong>{credential.teacher.email}</strong>
      </span>
      <span>
        Password: <code className="text-lg font-bold select-all">{credential.password}</code>
      </span>
      <Button variant="secondary" className="self-start" onClick={onDone}>
        Done
      </Button>
    </output>
  );
}

export function CreateTeacherForm({ orgs }: { orgs: { id: string; name: string }[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState<TeacherCredential | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    setBusy(true);
    setError(null);
    try {
      setCreated(
        await apiJson('/admin/teachers', TeacherCredential, 'POST', {
          displayName: form.get('displayName'),
          email: form.get('email'),
          orgId: form.get('orgId') || null,
        }),
      );
      formEl.reset();
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e.userMessage : 'Could not add the teacher.');
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <form
        onSubmit={onSubmit}
        className="grid gap-4 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end"
        noValidate
      >
        <Field id="teacherName" name="displayName" label="Name" required maxLength={60} />
        <Field id="teacherEmail" name="email" label="Email" type="email" required maxLength={254} />
        <div className="flex flex-col gap-1">
          <label htmlFor="teacherOrg" className="text-sm font-medium">
            School
          </label>
          <select id="teacherOrg" name="orgId" className={selectClass} defaultValue="">
            <option value="">No school</option>
            {orgs.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" disabled={busy}>
          Add teacher
        </Button>
        <div className="sm:col-span-4">
          <ErrorMessage message={error} />
        </div>
      </form>
      {created && <NewPassword credential={created} onDone={() => setCreated(null)} />}
    </div>
  );
}

export function TeacherControls({
  teacher,
  orgs,
}: {
  teacher: AdminTeacher;
  orgs: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [reset, setReset] = useState<TeacherCredential | null>(null);

  async function resetPassword() {
    setBusy(true);
    setError(null);
    try {
      setReset(
        await apiJson(`/admin/teachers/${teacher.id}/reset-password`, TeacherCredential, 'POST'),
      );
    } catch (e) {
      setError(e instanceof ApiError ? e.userMessage : 'Could not reset the password.');
    }
    setBusy(false);
  }

  async function update(body: { orgId?: string | null; active?: boolean }) {
    setBusy(true);
    setError(null);
    try {
      await apiJson(`/admin/teachers/${teacher.id}`, AdminTeacher, 'PATCH', body);
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e.userMessage : 'Could not update the teacher.');
    }
    setBusy(false);
  }

  const selectId = `org-${teacher.id}`;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor={selectId} className="text-sm font-medium">
            School
          </label>
          <select
            id={selectId}
            className={selectClass}
            value={teacher.orgId ?? ''}
            disabled={busy}
            onChange={(e) => void update({ orgId: e.target.value || null })}
          >
            <option value="">No school</option>
            {orgs.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>
        <Button
          variant={teacher.active ? 'danger' : 'secondary'}
          disabled={busy}
          onClick={() => void update({ active: !teacher.active })}
        >
          {teacher.active ? 'Deactivate' : 'Reactivate'}
          <span className="sr-only"> {teacher.displayName}</span>
        </Button>
        <Button variant="secondary" disabled={busy} onClick={() => void resetPassword()}>
          Reset password
          <span className="sr-only"> for {teacher.displayName}</span>
        </Button>
      </div>
      <ErrorMessage message={error} />
      {reset && <NewPassword credential={reset} onDone={() => setReset(null)} />}
    </div>
  );
}
