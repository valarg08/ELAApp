import { PsatFactSheetView } from '@storyforge/shared';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MathText } from '@/components/math-text';
import { CourseShell } from '@/components/course-shell';
import { PrintButton } from '@/features/math/print-button';
import { serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

/** The PSAT review fact sheet (math-design.md §3.4 D5): PSAT math facts in one page, ready to print. */
export default async function PsatFactSheet() {
  const view = await serverApi('/math/psat-facts', PsatFactSheetView);
  if (!view) notFound();

  return (
    <CourseShell track="MATH">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link href="/math" className="text-brand underline">
            ← Math
          </Link>
          <PrintButton />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-widest text-brand uppercase">Fact sheet</p>
          <h1 className="text-4xl font-bold">PSAT review</h1>
          <p className="mt-2 text-muted">
            The math the PSAT/NMSQT tests most, with the AMC 10 skill to practise for each part.
          </p>
        </div>
        {view.sheet.sections.map((s) => (
          <section
            key={s.skill}
            aria-labelledby={`facts-${s.skill}`}
            className="break-inside-avoid"
          >
            <h2 id={`facts-${s.skill}`} className="text-2xl font-semibold">
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
      </div>
    </CourseShell>
  );
}
