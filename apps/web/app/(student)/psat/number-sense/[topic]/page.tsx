import { notFound } from 'next/navigation';
import { CourseShell } from '@/components/course-shell';
import { NUMBER_SENSE, PsatNumberSenseTopic } from '@/features/math/psat-number-sense-guide';

/** A Number Sense sub-module: one chapter's notes and its 25 problems (psat-design.md). */
export default async function PsatNumberSenseTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  if (!NUMBER_SENSE.problems?.[topic]) notFound();
  return (
    <CourseShell track="PSAT" navCurrent={`/psat/number-sense/${topic}`}>
      <PsatNumberSenseTopic topicId={topic} />
    </CourseShell>
  );
}
