import { notFound } from 'next/navigation';
import { CourseShell } from '@/components/course-shell';
import { PARALLEL_LINES, PsatParallelLinesTopic } from '@/features/math/psat-parallel-lines-guide';

/** A Parallel Lines sub-module: one chapter's notes and its 50 problems (psat-design.md). */
export default async function PsatParallelLinesTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  if (!PARALLEL_LINES.problems?.[topic]) notFound();
  return (
    <CourseShell track="PSAT" navCurrent={`/psat/parallel-lines/${topic}`}>
      <PsatParallelLinesTopic topicId={topic} />
    </CourseShell>
  );
}
