import { notFound } from 'next/navigation';
import { CourseShell } from '@/components/course-shell';
import { PsatQuadraticsTopic, QUADRATICS } from '@/features/math/psat-quadratics-guide';

/** A Quadratics sub-module: one chapter's notes and its 25 problems (psat-design.md). */
export default async function PsatQuadraticsTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  if (!QUADRATICS.problems?.[topic]) notFound();
  return (
    <CourseShell track="PSAT" navCurrent={`/psat/quadratics/${topic}`}>
      <PsatQuadraticsTopic topicId={topic} />
    </CourseShell>
  );
}
