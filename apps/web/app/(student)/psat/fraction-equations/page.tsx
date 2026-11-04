import { CourseShell } from '@/components/course-shell';
import { PsatFractionEquationsGuide } from '@/features/math/psat-fraction-equations-guide';

/** The equations with fractions study guide in the PSAT Math track (psat-design.md). */
export default function PsatFractionEquations() {
  return (
    <CourseShell track="PSAT" navCurrent="/psat/fraction-equations">
      <PsatFractionEquationsGuide />
    </CourseShell>
  );
}
