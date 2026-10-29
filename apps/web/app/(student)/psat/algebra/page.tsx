import { CourseShell } from '@/components/course-shell';
import { PsatAlgebraGuide } from '@/features/math/psat-algebra-guide';

/** The algebra study guide in the PSAT Math track (psat-design.md). */
export default function PsatAlgebra() {
  return (
    <CourseShell track="PSAT" navCurrent="/psat/algebra">
      <PsatAlgebraGuide />
    </CourseShell>
  );
}
