import { notFound } from 'next/navigation';
import { CourseShell } from '@/components/course-shell';
import {
  FRACTION_EQUATIONS,
  PsatFractionEquationsTopic,
} from '@/features/math/psat-fraction-equations-guide';

/** An Equations with Fractions sub-module: one chapter's notes and its 25 problems (psat-design.md). */
export default async function PsatFractionEquationsTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  if (!FRACTION_EQUATIONS.problems?.[topic]) notFound();
  return (
    <CourseShell track="PSAT" navCurrent={`/psat/fraction-equations/${topic}`}>
      <PsatFractionEquationsTopic topicId={topic} />
    </CourseShell>
  );
}
