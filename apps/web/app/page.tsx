import { APP_NAME, homePathFor } from '@storyforge/shared';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ButtonLink, Card } from '@/components/ui';
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

      <section aria-labelledby="how-title" className="flex flex-col gap-4">
        <h2 id="how-title" className="text-2xl font-bold">
          How to log in
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold">
              <span aria-hidden="true">🍎 </span>Teachers
            </h3>
            <ol className="flex list-decimal flex-col gap-2 pl-5">
              <li>
                Press <strong>I&apos;m a teacher</strong>.
              </li>
              <li>
                Type your <strong>email</strong> and <strong>password</strong>, then press{' '}
                <strong>Log in</strong>. New here?{' '}
                <Link href="/register" className="font-semibold text-brand underline">
                  Create an account
                </Link>{' '}
                first.
              </li>
              <li>
                Create a class. StoryForge gives it a 6-letter <strong>class code</strong>.
              </li>
              <li>
                Open the class and use <strong>Add students</strong> (one first name per line). Pick
                picture passwords or word codes.
              </li>
              <li>
                Print the <strong>login cards</strong> straight away: passwords are shown only once.
                If a student forgets theirs, use <strong>Reset password</strong> in the roster.
              </li>
            </ol>
          </Card>
          <Card className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold">
              <span aria-hidden="true">🎒 </span>Students
            </h3>
            <ol className="flex list-decimal flex-col gap-2 pl-5">
              <li>
                Press <strong>I&apos;m a student</strong> (or scan the QR code on your login card).
              </li>
              <li>
                Type the 6-letter <strong>class code</strong> from your teacher and press{' '}
                <strong>Next</strong>.
              </li>
              <li>
                Tap <strong>your name</strong>.
              </li>
              <li>
                Tap your <strong>pictures in order</strong>, or type your{' '}
                <strong>secret code</strong>. It&apos;s on your login card.
              </li>
              <li>Forgot it? Ask your teacher for a new one.</li>
            </ol>
          </Card>
        </div>
        {process.env.NODE_ENV !== 'production' && (
          <p className="rounded-lg border border-dashed border-border p-3 text-sm text-muted">
            <strong>Testing on this computer:</strong> after <code>pnpm db:seed</code>, log in as a
            teacher with <code>teacher@storyforge.test</code> / <code>storyforge-teacher</code>. To
            log in as a student, open a class, add a student (or reset one&apos;s password), and use
            the class code and the password it shows. This note only appears in development.
          </p>
        )}
      </section>

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
