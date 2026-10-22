import { MathTestView, TestResult } from '@storyforge/shared';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import { CourseShell } from '@/components/course-shell';
import { MathAttempt } from '@/features/math/test-player';
import { serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

/** A test, sprint or review attempt: carry on with it, or its result once handed in. */
export default async function MathAttemptPage({
  params,
  searchParams,
}: PageProps<'/math/attempts/[id]'>) {
  const { id } = await params;
  // A Unit 15 mock started from its lesson links back to it.
  const lesson = (await searchParams).lesson;
  const lessonId = typeof lesson === 'string' && /^[a-z0-9]{10,40}$/.test(lesson) ? lesson : null;
  const back = lessonId
    ? { href: `/lessons/${lessonId}`, label: 'Back to the lesson' }
    : { href: '/math', label: 'Back to Math' };
  const attempt = await serverApi(
    `/math/tests/attempts/${encodeURIComponent(id)}`,
    z.union([MathTestView, TestResult]),
  );
  if (!attempt) notFound();

  return (
    <CourseShell track="MATH">
      <div className="flex flex-col gap-6">
        <Link href={back.href} className="text-brand underline">
          ← {lessonId ? 'The lesson' : 'Math'}
        </Link>
        <MathAttempt initial={attempt} back={back} />
      </div>
    </CourseShell>
  );
}
