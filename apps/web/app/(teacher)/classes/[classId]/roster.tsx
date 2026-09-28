'use client';

import {
  MAX_BULK_STUDENTS,
  PICTURES,
  StudentCredential,
  type StudentSecretKind,
  type StudentSummary,
  decodePictureSecret,
} from '@storyforge/shared';
import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';
import { Button, Card, ErrorMessage } from '@/components/ui';
import { ApiError, apiDownload, apiJson } from '@/lib/api-client';

const message = (e: unknown, fallback: string) =>
  e instanceof ApiError ? e.userMessage : fallback;

export function Roster({ classId, students }: { classId: string; students: StudentSummary[] }) {
  const router = useRouter();
  // Secrets exist in plain text only here, right after creation or reset. They are gone on reload.
  const [credentials, setCredentials] = useState<StudentCredential[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function reset(student: StudentSummary) {
    if (!confirm(`Give ${student.displayName} a new password? Their old one will stop working.`))
      return;
    setBusyId(student.id);
    setError(null);
    try {
      const fresh = await apiJson(
        `/teacher/students/${student.id}/reset-secret`,
        StudentCredential,
        'POST',
        {},
      );
      setCredentials((current) => [fresh, ...current.filter((c) => c.id !== fresh.id)]);
      router.refresh();
    } catch (e) {
      setError(message(e, 'Could not reset the password.'));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {credentials.length > 0 && (
        <NewCredentials
          classId={classId}
          credentials={credentials}
          onDone={() => setCredentials([])}
        />
      )}

      <Card>
        <h2 className="mb-4 text-xl font-semibold">
          Students <span className="text-muted">({students.length})</span>
        </h2>
        <ErrorMessage message={error} />
        {students.length === 0 ? (
          <p className="text-muted">No students yet. Add them below.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-sm text-muted">
                <tr>
                  <th scope="col" className="py-2 pr-4">
                    Name
                  </th>
                  <th scope="col" className="py-2 pr-4">
                    Username
                  </th>
                  <th scope="col" className="py-2 pr-4">
                    Last login
                  </th>
                  <th scope="col" className="py-2">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-t border-border">
                    <td className="py-3 pr-4 font-medium">
                      {s.displayName}
                      {s.locked && (
                        <span className="ml-2 rounded-full border border-bad px-2 py-0.5 text-xs text-bad">
                          Locked
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4 font-mono text-sm">{s.username}</td>
                    <td className="py-3 pr-4 text-sm text-muted">
                      {s.lastLoginAt ? new Date(s.lastLoginAt).toLocaleString() : 'Never'}
                    </td>
                    <td className="py-3 text-right">
                      <Button
                        variant="secondary"
                        onClick={() => reset(s)}
                        disabled={busyId === s.id}
                      >
                        {s.locked ? 'Unlock & reset' : 'Reset password'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <AddStudentsForm
        classId={classId}
        onCreated={(created) => {
          setCredentials((current) => [...created, ...current]);
          router.refresh();
        }}
      />
    </div>
  );
}

function AddStudentsForm({
  classId,
  onCreated,
}: {
  classId: string;
  onCreated: (created: StudentCredential[]) => void;
}) {
  const [names, setNames] = useState('');
  const [secretKind, setSecretKind] = useState<StudentSecretKind>('PICTURE');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const list = names
    .split('\n')
    .map((n) => n.trim())
    .filter(Boolean);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const created = await apiJson(
        `/teacher/classes/${classId}/students/bulk`,
        StudentCredential.array(),
        'POST',
        {
          names: list,
          secretKind,
        },
      );
      setNames('');
      onCreated(created);
    } catch (e) {
      setError(message(e, 'Could not add the students.'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <h2 className="mb-1 text-xl font-semibold">Add students</h2>
      <p className="mb-4 text-muted">
        One first name (or nickname) per line, up to {MAX_BULK_STUDENTS}. Usernames and passwords
        are made for you.
      </p>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label htmlFor="names" className="font-medium">
          Student names
        </label>
        <textarea
          id="names"
          value={names}
          onChange={(e) => setNames(e.target.value)}
          rows={6}
          placeholder={'Maya\nLeo\nAarav'}
          className="rounded-xl border border-border bg-card px-3 py-2 focus-visible:outline-3 focus-visible:outline-brand"
        />
        <fieldset className="flex flex-wrap gap-6">
          <legend className="mb-2 font-medium">Password type</legend>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="secretKind"
              checked={secretKind === 'PICTURE'}
              onChange={() => setSecretKind('PICTURE')}
            />
            Picture password (best for younger students)
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="secretKind"
              checked={secretKind === 'WORD'}
              onChange={() => setSecretKind('WORD')}
            />
            6-character code
          </label>
        </fieldset>
        <ErrorMessage message={error} />
        <Button type="submit" disabled={busy || list.length === 0} className="self-start">
          {busy
            ? 'Adding…'
            : list.length === 0
              ? 'Add students'
              : `Add ${list.length} ${list.length === 1 ? 'student' : 'students'}`}
        </Button>
      </form>
    </Card>
  );
}

function NewCredentials({
  classId,
  credentials,
  onDone,
}: {
  classId: string;
  credentials: StudentCredential[];
  onDone: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function downloadCards() {
    setBusy(true);
    setError(null);
    try {
      await apiDownload(
        `/teacher/classes/${classId}/login-cards`,
        { cards: credentials.map((c) => ({ studentId: c.id, secret: c.secret })) },
        'login-cards.pdf',
      );
    } catch (e) {
      setError(message(e, 'Could not make the login cards.'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      aria-labelledby="new-credentials"
      className="rounded-2xl border-2 border-brand bg-card p-6 shadow-sm"
      data-testid="new-credentials"
    >
      <h2 id="new-credentials" className="text-xl font-semibold">
        New login details
      </h2>
      <p className="mt-1 text-muted">
        Print the login cards now. For safety, these passwords are shown only once. If one is lost,
        reset it.
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {credentials.map((c) => (
          <li
            key={c.id}
            className="rounded-xl border border-border p-3"
            data-testid="credential"
            data-username={c.username}
            data-secret={c.secret}
          >
            <p className="font-semibold">{c.displayName}</p>
            <p className="font-mono text-sm text-muted">{c.username}</p>
            <SecretView credential={c} />
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={downloadCards} disabled={busy}>
          {busy ? 'Making cards…' : '🖨️ Download login cards (PDF)'}
        </Button>
        <Button variant="secondary" onClick={onDone}>
          I&apos;ve printed them
        </Button>
      </div>
      <div className="mt-3">
        <ErrorMessage message={error} />
      </div>
    </section>
  );
}

function SecretView({ credential }: { credential: StudentCredential }) {
  if (credential.secretKind === 'WORD') {
    return <p className="mt-2 font-mono text-xl font-bold tracking-widest">{credential.secret}</p>;
  }
  const ids = decodePictureSecret(credential.secret) ?? [];
  return (
    <p
      className="mt-2 flex items-center gap-2 text-3xl"
      aria-label={`Picture password: ${ids.join(', ')}`}
    >
      {ids.map((id, i) => {
        const p = PICTURES.find((x) => x.id === id);
        return (
          <span key={id} className="flex items-center gap-2">
            {i > 0 && (
              <span aria-hidden="true" className="text-base text-muted">
                →
              </span>
            )}
            <span aria-hidden="true" title={p?.label}>
              {p?.emoji}
            </span>
          </span>
        );
      })}
    </p>
  );
}
