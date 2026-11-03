import { notFound } from 'next/navigation';
import { CourseShell } from '@/components/course-shell';
import { PsatRadicalsTopic, RADICALS } from '@/features/math/psat-radicals-guide';

/** A Radicals sub-module: one chapter's notes and its 25 problems (psat-design.md). */
export default async function PsatRadicalsTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  if (!RADICALS.problems?.[topic]) notFound();
  return (
    <CourseShell track="PSAT" navCurrent={`/psat/radicals/${topic}`}>
      <PsatRadicalsTopic topicId={topic} />
    </CourseShell>
  );
}
