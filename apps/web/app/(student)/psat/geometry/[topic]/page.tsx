import { notFound } from 'next/navigation';
import { CourseShell } from '@/components/course-shell';
import { GEOMETRY, PsatGeometryTopic } from '@/features/math/psat-geometry-guide';

/** A Geometry sub-module: one chapter's notes and its 25 problems (psat-design.md). */
export default async function PsatGeometryTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  if (!GEOMETRY.problems?.[topic]) notFound();
  return (
    <CourseShell track="PSAT" navCurrent={`/psat/geometry/${topic}`}>
      <PsatGeometryTopic topicId={topic} />
    </CourseShell>
  );
}
