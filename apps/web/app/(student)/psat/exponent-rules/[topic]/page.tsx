import { notFound } from 'next/navigation';
import { CourseShell } from '@/components/course-shell';
import { EXPONENT_RULES, PsatExponentRulesTopic } from '@/features/math/psat-exponent-rules-guide';

/** An Exponent Rules sub-module: one chapter's notes and its 50 problems (psat-design.md). */
export default async function PsatExponentRulesTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  if (!EXPONENT_RULES.problems?.[topic]) notFound();
  return (
    <CourseShell track="PSAT" navCurrent={`/psat/exponent-rules/${topic}`}>
      <PsatExponentRulesTopic topicId={topic} />
    </CourseShell>
  );
}
