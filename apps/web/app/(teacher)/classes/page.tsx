import { ClassSummary } from '@storyforge/shared';
import Link from 'next/link';
import { Card, PageShell } from '@/components/ui';
import { serverApi } from '@/lib/server-api';
import { CreateClassForm } from './create-class-form';

export const dynamic = 'force-dynamic';

export default async function ClassesPage() {
  const classes = (await serverApi('/teacher/classes', ClassSummary.array())) ?? [];

  return (
    <PageShell full>
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold">Your classes</h1>

        {classes.length === 0 ? (
          <p className="text-lg text-muted">No classes yet. Create your first one below.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {classes.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/classes/${c.id}`}
                  className="block rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-brand focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <h2 className="text-xl font-semibold">{c.name}</h2>
                  <p className="mt-1 text-muted">
                    Grade {c.gradeLevel} · {c.studentCount}{' '}
                    {c.studentCount === 1 ? 'student' : 'students'}
                  </p>
                  <p className="mt-3 text-sm">
                    Class code{' '}
                    <span className="font-mono text-lg font-bold tracking-widest">
                      {c.joinCode}
                    </span>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <Card>
          <h2 className="mb-4 text-xl font-semibold">Create a class</h2>
          <CreateClassForm />
        </Card>
      </div>
    </PageShell>
  );
}
