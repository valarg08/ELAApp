'use client';

import {
  PICTURES,
  PICTURE_SECRET_LENGTH,
  type PictureId,
  StudentLookupResponse,
  encodePictureSecret,
} from '@storyforge/shared';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type FormEvent, useCallback, useState } from 'react';
import { Button, Card, ErrorMessage, Field } from '@/components/ui';
import { ApiError, apiJson, apiSend } from '@/lib/api-client';

type Student = StudentLookupResponse['students'][number];
type Step = 'code' | 'name' | 'secret';

/**
 * Class code → pick your name → picture password (or word code).
 * Arriving from a login-card QR code, the server has already looked the class up (`initialLookup`),
 * so the flow can start at the right step.
 */
export function JoinFlow({
  initialCode,
  initialLookup,
  initialStudent,
}: {
  initialCode: string;
  initialLookup: StudentLookupResponse | null;
  initialStudent: Student | null;
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(
    initialStudent ? 'secret' : initialLookup ? 'name' : 'code',
  );
  const [joinCode, setJoinCode] = useState(initialCode.toUpperCase());
  const [lookup, setLookup] = useState<StudentLookupResponse | null>(initialLookup);
  const [student, setStudent] = useState<Student | null>(initialStudent);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [attempt, setAttempt] = useState(0);

  // Each step has its own heading element; focusing it on mount lets screen readers announce the step.
  const heading = useCallback((el: HTMLHeadingElement | null) => el?.focus(), []);

  async function findClass(code: string) {
    setBusy(true);
    setError(null);
    try {
      const result = await apiJson('/auth/student/lookup', StudentLookupResponse, 'POST', {
        joinCode: code,
      });
      setLookup(result);
      setStudent(null);
      setStep('name');
    } catch (e) {
      setError(
        e instanceof ApiError ? e.userMessage : 'Could not reach Owlery Academy. Try again.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function login(secret: string) {
    if (!student) return;
    setBusy(true);
    setError(null);
    try {
      await apiSend('/auth/student/login', 'POST', {
        joinCode,
        username: student.username,
        secret,
      });
      router.push('/start');
      router.refresh();
    } catch (e) {
      if (e instanceof ApiError && e.problem.code === 'INVALID_CREDENTIALS') {
        setError(
          student.secretKind === 'PICTURE'
            ? "Those pictures don't match. Try again!"
            : "That code doesn't match. Try again!",
        );
      } else {
        setError(
          e instanceof ApiError ? e.userMessage : 'Could not reach Owlery Academy. Try again.',
        );
      }
      setAttempt((n) => n + 1); // clears the picture grid for a fresh try
      setBusy(false);
    }
  }

  function onCodeSubmit(event: FormEvent) {
    event.preventDefault();
    void findClass(joinCode);
  }

  return (
    <Card className="flex flex-col gap-6">
      {step === 'code' && (
        <form onSubmit={onCodeSubmit} className="flex flex-col gap-5" noValidate>
          <div>
            <h1 ref={heading} tabIndex={-1} className="text-3xl font-bold outline-none">
              🎒 Join your class
            </h1>
            <p className="mt-1 text-muted">Type the class code your teacher gave you.</p>
          </div>
          <Field
            id="joinCode"
            label="Class code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={6}
            className="min-h-14 text-center font-mono text-3xl tracking-[0.4em] uppercase"
            required
          />
          <ErrorMessage message={error} />
          <Button
            type="submit"
            disabled={busy || joinCode.trim().length !== 6}
            className="min-h-14 text-lg"
          >
            {busy ? 'Looking…' : 'Next'}
          </Button>
          <p className="text-sm text-muted">
            Are you a teacher?{' '}
            <Link href="/login" className="text-brand underline">
              Log in here
            </Link>
            .
          </p>
        </form>
      )}

      {step === 'name' && lookup && (
        <div className="flex flex-col gap-5">
          <div>
            <h1 ref={heading} tabIndex={-1} className="text-3xl font-bold outline-none">
              Who are you?
            </h1>
            <p className="mt-1 text-muted">{lookup.className}</p>
          </div>
          {lookup.students.length === 0 ? (
            <p>Your teacher hasn&apos;t added any students yet.</p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {lookup.students.map((s) => (
                <li key={s.username}>
                  <Button
                    variant="secondary"
                    className="min-h-16 w-full text-lg"
                    onClick={() => {
                      setStudent(s);
                      setError(null);
                      setStep('secret');
                    }}
                  >
                    {s.displayName}
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <Button variant="secondary" onClick={() => setStep('code')}>
            ← Different class code
          </Button>
        </div>
      )}

      {step === 'secret' && student && (
        <div className="flex flex-col gap-5">
          <div>
            <h1 ref={heading} tabIndex={-1} className="text-3xl font-bold outline-none">
              Hi, {student.displayName}!
            </h1>
            <p className="mt-1 text-muted">
              {student.secretKind === 'PICTURE'
                ? `Tap your ${PICTURE_SECRET_LENGTH} pictures in order.`
                : 'Type your secret code.'}
            </p>
          </div>
          {student.secretKind === 'PICTURE' ? (
            <PicturePassword key={attempt} busy={busy} onSubmit={login} />
          ) : (
            <WordCode key={attempt} busy={busy} onSubmit={login} />
          )}
          <ErrorMessage message={error} />
          <Button
            variant="secondary"
            onClick={() => {
              setError(null);
              setStep('name');
            }}
          >
            ← That&apos;s not me
          </Button>
        </div>
      )}
    </Card>
  );
}

function PicturePassword({
  busy,
  onSubmit,
}: {
  busy: boolean;
  onSubmit: (secret: string) => void;
}) {
  const [chosen, setChosen] = useState<PictureId[]>([]);
  const full = chosen.length === PICTURE_SECRET_LENGTH;

  function tap(id: PictureId) {
    if (full || chosen.includes(id)) return;
    setChosen([...chosen, id]);
  }

  return (
    <div className="flex flex-col gap-4">
      <div aria-live="polite" className="flex justify-center gap-3" aria-label="Pictures chosen">
        {Array.from({ length: PICTURE_SECRET_LENGTH }, (_, i) => {
          const picture = PICTURES.find((p) => p.id === chosen[i]);
          return (
            <span
              key={i}
              className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-dashed border-border text-4xl"
            >
              {picture ? (
                <>
                  <span aria-hidden="true">{picture.emoji}</span>
                  <span className="sr-only">{picture.label}</span>
                </>
              ) : (
                <span className="sr-only">empty</span>
              )}
            </span>
          );
        })}
      </div>

      <fieldset className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        <legend className="sr-only">Pictures</legend>
        {PICTURES.map((p) => {
          const picked = chosen.includes(p.id);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => tap(p.id)}
              aria-pressed={picked}
              aria-label={p.label}
              disabled={busy || (full && !picked)}
              className={`flex min-h-24 flex-col items-center justify-center gap-1 rounded-2xl border-2 bg-card text-4xl transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-40 ${
                picked ? 'border-brand ring-2 ring-brand' : 'border-border hover:border-brand'
              }`}
            >
              <span aria-hidden="true">{p.emoji}</span>
              <span className="text-sm font-medium">{p.label}</span>
            </button>
          );
        })}
      </fieldset>

      <div className="flex gap-3">
        <Button
          variant="secondary"
          onClick={() => setChosen(chosen.slice(0, -1))}
          disabled={busy || chosen.length === 0}
        >
          ⌫ Undo
        </Button>
        <Button
          className="flex-1 min-h-14 text-lg"
          disabled={busy || !full}
          onClick={() => onSubmit(encodePictureSecret(chosen))}
        >
          {busy ? 'Checking…' : 'Log in'}
        </Button>
      </div>
    </div>
  );
}

function WordCode({ busy, onSubmit }: { busy: boolean; onSubmit: (secret: string) => void }) {
  const [code, setCode] = useState('');
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(code);
      }}
    >
      <Field
        id="wordCode"
        label="Secret code"
        value={code}
        onChange={(e) => setCode(e.target.value.toLowerCase())}
        autoComplete="off"
        spellCheck={false}
        maxLength={6}
        className="min-h-14 text-center font-mono text-3xl tracking-[0.4em]"
      />
      <Button type="submit" className="min-h-14 text-lg" disabled={busy || code.length !== 6}>
        {busy ? 'Checking…' : 'Log in'}
      </Button>
    </form>
  );
}
