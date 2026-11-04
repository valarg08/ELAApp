import { CourseShell } from '@/components/course-shell';
import { PsatPowersGuide } from '@/features/math/psat-powers-guide';

/** The powers and scientific notation study guide in the PSAT Math track (psat-design.md). */
export default function PsatPowers() {
  return (
    <CourseShell track="PSAT" navCurrent="/psat/powers">
      <PsatPowersGuide />
    </CourseShell>
  );
}
