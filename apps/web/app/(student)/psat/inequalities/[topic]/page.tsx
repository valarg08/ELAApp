import { notFound } from 'next/navigation';
import { CourseShell } from '@/components/course-shell';
import { INEQUALITIES, PsatInequalitiesTopic } from '@/features/math/psat-inequalities-guide';

/** An Inequalities sub-module: one chapter's notes and its 25 problems (psat-design.md). */
export default async function PsatInequalitiesTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  if (!INEQUALITIES.problems?.[topic]) notFound();
  return (
    <CourseShell track="PSAT" navCurrent={`/psat/inequalities/${topic}`}>
      <PsatInequalitiesTopic topicId={topic} />
    </CourseShell>
  );
}
