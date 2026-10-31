import { CourseShell } from '@/components/course-shell';
import { PsatFactoringGuide } from '@/features/math/psat-factoring-guide';

/** The factoring study guide in the PSAT Math track (psat-design.md). */
export default function PsatFactoring() {
  return (
    <CourseShell track="PSAT" navCurrent="/psat/factoring">
      <PsatFactoringGuide />
    </CourseShell>
  );
}
