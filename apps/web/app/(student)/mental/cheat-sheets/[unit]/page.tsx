import { FactSheetView } from '@storyforge/shared';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MathText } from '@/components/math-text';
import { CourseShell } from '@/components/course-shell';
import { PrintButton } from '@/features/math/print-button';
import { serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

/** A Mental Math unit's cheat sheet (mental-math-design.md): the patterns to know, ready to print. */
export default async function MentalCheatSheet({
  params,
}: PageProps<'/mental/cheat-sheets/[unit]'>) {
  const { unit } = await params;
  if (!/^\d{1,2}$/.test(unit)) notFound();
  const view = await serverApi(`/mental/cheat-sheets/${unit}`, FactSheetView);
  if (!view) notFound();

  return (
    <CourseShell track="MENTAL">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link href="/mental" className="text-brand underline">
            ← Mental Math
          </Link>
          <PrintButton />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-widest text-brand uppercase">Cheat sheet</p>
          <h1 className="text-4xl font-bold">
            Mental Math Unit {view.unitNumber}: {view.unitTitle}
          </h1>
        </div>
        {view.sheet.sections.map((s) => (
          <section
            key={s.skill}
            aria-labelledby={`sheet-${s.skill}`}
            className="break-inside-avoid"
          >
            <h2 id={`sheet-${s.skill}`} className="text-2xl font-semibold">
              {s.title}
            </h2>
            <p className="text-sm text-muted">Skill: {view.skillLabels[s.skill] ?? s.skill}</p>
            <ul className="mt-2 ml-5 flex list-disc flex-col gap-1 text-lg">
              {s.facts.map((f, i) => (
                <li key={i}>
                  <MathText text={f} />
                </li>
              ))}
            </ul>
          </section>
        ))}
        <Link href={`/units/${view.unitSlug}`} className="text-brand underline print:hidden">
          Back to the unit
        </Link>
      </div>
    </CourseShell>
  );
}
