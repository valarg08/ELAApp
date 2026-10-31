import { notFound } from 'next/navigation';
import { CourseShell } from '@/components/course-shell';
import { FACTORING, PsatFactoringTopic } from '@/features/math/psat-factoring-guide';

/** A Factoring sub-module: one chapter's notes and its 25 problems (psat-design.md). */
export default async function PsatFactoringTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  if (!FACTORING.problems?.[topic]) notFound();
  return (
    <CourseShell track="PSAT" navCurrent={`/psat/factoring/${topic}`}>
      <PsatFactoringTopic topicId={topic} />
    </CourseShell>
  );
}
