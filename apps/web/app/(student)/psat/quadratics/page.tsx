import { CourseShell } from '@/components/course-shell';
import { PsatQuadraticsGuide } from '@/features/math/psat-quadratics-guide';

/** The quadratics study guide in the PSAT Math track (psat-design.md). */
export default function PsatQuadratics() {
  return (
    <CourseShell track="PSAT" navCurrent="/psat/quadratics">
      <PsatQuadraticsGuide />
    </CourseShell>
  );
}
