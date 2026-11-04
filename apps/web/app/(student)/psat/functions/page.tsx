import { CourseShell } from '@/components/course-shell';
import { PsatFunctionsGuide } from '@/features/math/psat-functions-guide';

/** The functions study guide in the PSAT Math track (psat-design.md). */
export default function PsatFunctions() {
  return (
    <CourseShell track="PSAT" navCurrent="/psat/functions">
      <PsatFunctionsGuide />
    </CourseShell>
  );
}
