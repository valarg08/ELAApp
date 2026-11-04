import { CourseShell } from '@/components/course-shell';
import { PsatExponentRulesGuide } from '@/features/math/psat-exponent-rules-guide';

/** The exponent rules study guide in the PSAT Math track (psat-design.md). */
export default function PsatExponentRules() {
  return (
    <CourseShell track="PSAT" navCurrent="/psat/exponent-rules">
      <PsatExponentRulesGuide />
    </CourseShell>
  );
}
