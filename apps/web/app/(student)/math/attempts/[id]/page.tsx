import { MathTestView, TestResult } from '@storyforge/shared';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import { PageShell } from '@/components/ui';
import { MathAttempt } from '@/features/math/test-player';
import { serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

/** A test, sprint or review attempt: carry on with it, or its result once handed in. */
export default async function MathAttemptPage({ params }: PageProps<'/math/attempts/[id]'>) {
  const { id } = await params;
  const attempt = await serverApi(
    `/math/tests/attempts/${encodeURIComponent(id)}`,
    z.union([MathTestView, TestResult]),
  );
  if (!attempt) notFound();

  return (
    <PageShell width="max-w-4xl">
      <div className="flex flex-col gap-6">
        <Link href="/math" className="text-brand underline">
          ← Math
        </Link>
        <MathAttempt initial={attempt} />
      </div>
    </PageShell>
  );
}
