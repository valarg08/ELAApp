import { CourseShell } from '@/components/course-shell';
import { PsatInequalitiesGuide } from '@/features/math/psat-inequalities-guide';

/** The inequalities study guide in the PSAT Math track (psat-design.md). */
export default function PsatInequalities() {
  return (
    <CourseShell track="PSAT" navCurrent="/psat/inequalities">
      <PsatInequalitiesGuide />
    </CourseShell>
  );
}
