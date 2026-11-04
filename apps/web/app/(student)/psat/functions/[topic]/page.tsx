import { notFound } from 'next/navigation';
import { CourseShell } from '@/components/course-shell';
import { FUNCTIONS, PsatFunctionsTopic } from '@/features/math/psat-functions-guide';

/** A Functions sub-module: one chapter's notes and its 25 problems (psat-design.md). */
export default async function PsatFunctionsTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  if (!FUNCTIONS.problems?.[topic]) notFound();
  return (
    <CourseShell track="PSAT" navCurrent={`/psat/functions/${topic}`}>
      <PsatFunctionsTopic topicId={topic} />
    </CourseShell>
  );
}
