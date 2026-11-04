import { notFound } from 'next/navigation';
import { CourseShell } from '@/components/course-shell';
import { POWERS, PsatPowersTopic } from '@/features/math/psat-powers-guide';

/** A Powers sub-module: one chapter's notes and its 25 problems (psat-design.md). */
export default async function PsatPowersTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  if (!POWERS.problems?.[topic]) notFound();
  return (
    <CourseShell track="PSAT" navCurrent={`/psat/powers/${topic}`}>
      <PsatPowersTopic topicId={topic} />
    </CourseShell>
  );
}
