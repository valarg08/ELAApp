import { MathTestView, TestResult, isMentalKind } from '@storyforge/shared';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import { CourseShell } from '@/components/course-shell';
import { MathAttempt } from '@/features/math/test-player';
import { serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

/** A Mental Math review, sprint or check: carry on with it, or its result once handed in. */
export default async function MentalAttemptPage({ params }: PageProps<'/mental/attempts/[id]'>) {
  const { id } = await params;
  const attempt = await serverApi(
    `/math/tests/attempts/${encodeURIComponent(id)}`,
    z.union([MathTestView, TestResult]),
  );
  if (!attempt || !isMentalKind(attempt.kind)) notFound();

  return (
    <CourseShell track="MENTAL">
      <div className="flex flex-col gap-6">
        <Link href="/mental" className="text-brand underline">
          ← Mental Math
        </Link>
        <MathAttempt initial={attempt} back={{ href: '/mental', label: 'Back to Mental Math' }} />
      </div>
    </CourseShell>
  );
}
