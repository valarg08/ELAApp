import { CourseShell } from '@/components/course-shell';
import { PsatNumberSenseGuide } from '@/features/math/psat-number-sense-guide';

/** The number sense study guide in the PSAT Math track (psat-design.md). */
export default function PsatNumberSense() {
  return (
    <CourseShell track="PSAT" navCurrent="/psat/number-sense">
      <PsatNumberSenseGuide />
    </CourseShell>
  );
}
