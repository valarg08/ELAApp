import { APP_NAME, homePathFor } from '@storyforge/shared';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ButtonLink } from '@/components/ui';
import { getMe } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

export default async function Landing() {
  const me = await getMe().catch(() => null);
  if (me) redirect(homePathFor(me.role));

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-10 px-4 py-16">
      <header className="flex flex-col gap-3">
        <p className="text-5xl" aria-hidden="true">
          🦉
        </p>
        <h1 className="text-4xl font-bold sm:text-5xl">{APP_NAME}</h1>
        <p className="text-xl text-muted">Learn to write amazing stories, one lesson at a time.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <ButtonLink href="/join" className="min-h-20 text-xl">
          🎒 I&apos;m a student
        </ButtonLink>
        <ButtonLink href="/login" variant="secondary" className="min-h-20 text-xl">
          🍎 I&apos;m a teacher
        </ButtonLink>
      </div>

      <p className="text-sm text-muted">
        New teacher?{' '}
        <Link href="/register" className="font-semibold text-brand underline">
          Create an account
        </Link>
        {' · '}
        <Link href="/status" className="underline">
          System status
        </Link>
      </p>
    </main>
  );
}
