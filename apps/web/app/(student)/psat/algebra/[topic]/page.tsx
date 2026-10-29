import { notFound } from 'next/navigation';
import { CourseShell } from '@/components/course-shell';
import { ALGEBRA, PsatAlgebraTopic } from '@/features/math/psat-algebra-guide';

/** A Algebra sub-module: one chapter's notes and its 25 problems (psat-design.md). */
export default async function PsatAlgebraTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  if (!ALGEBRA.problems?.[topic]) notFound();
  return (
    <CourseShell track="PSAT" navCurrent={`/psat/algebra/${topic}`}>
      <PsatAlgebraTopic topicId={topic} />
    </CourseShell>
  );
}
