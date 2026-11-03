import { CourseShell } from '@/components/course-shell';
import { PsatRadicalsGuide } from '@/features/math/psat-radicals-guide';

/** The radicals study guide in the PSAT Math track (psat-design.md). */
export default function PsatRadicals() {
  return (
    <CourseShell track="PSAT" navCurrent="/psat/radicals">
      <PsatRadicalsGuide />
    </CourseShell>
  );
}
