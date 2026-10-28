import { PsatFactSheetView } from '@storyforge/shared';
import { notFound } from 'next/navigation';
import { CourseShell } from '@/components/course-shell';
import { PsatFactSheet } from '@/features/math/psat-fact-sheet';
import { serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

/** The PSAT review fact sheet in the PSAT Math track (psat-design.md). */
export default async function PsatReview() {
  const view = await serverApi('/math/psat-facts', PsatFactSheetView);
  if (!view) notFound();
  return (
    <CourseShell track="PSAT">
      <PsatFactSheet view={view} back={{ href: '/psat', label: 'PSAT Math' }} />
    </CourseShell>
  );
}
