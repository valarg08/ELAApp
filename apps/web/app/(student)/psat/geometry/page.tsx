import { CourseShell } from '@/components/course-shell';
import { PsatGeometryGuide } from '@/features/math/psat-geometry-guide';

/** The geometry study guide in the PSAT Math track (psat-design.md). */
export default function PsatGeometry() {
  return (
    <CourseShell track="PSAT" navCurrent="/psat/geometry">
      <PsatGeometryGuide />
    </CourseShell>
  );
}
