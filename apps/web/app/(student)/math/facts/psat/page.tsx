import { PsatFactSheetView } from '@storyforge/shared';
import { notFound } from 'next/navigation';
import { CourseShell } from '@/components/course-shell';
import { PsatFactSheet } from '@/features/math/psat-fact-sheet';
import { serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

/** The PSAT review fact sheet in the Math (AMC 10) track (math-design.md §3.4 D5). */
export default async function MathPsatFactSheet() {
  const view = await serverApi('/math/psat-facts', PsatFactSheetView);
  if (!view) notFound();
  return (
    <CourseShell track="MATH">
      <PsatFactSheet view={view} back={{ href: '/math', label: 'Math' }} />
    </CourseShell>
  );
}
