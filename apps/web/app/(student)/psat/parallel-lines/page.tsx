import { CourseShell } from '@/components/course-shell';
import { PsatParallelLinesGuide } from '@/features/math/psat-parallel-lines-guide';

/** The parallel lines and angles study guide in the PSAT Math track (psat-design.md). */
export default function PsatParallelLines() {
  return (
    <CourseShell track="PSAT" navCurrent="/psat/parallel-lines">
      <PsatParallelLinesGuide />
    </CourseShell>
  );
}
