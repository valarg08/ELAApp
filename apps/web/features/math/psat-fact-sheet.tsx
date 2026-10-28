import type { PsatFactSheetView } from '@storyforge/shared';
import Link from 'next/link';
import { MathText } from '@/components/math-text';
import { PrintButton } from './print-button';

/**
 * The PSAT review fact sheet (math-design.md §3.4 D5, psat-design.md): PSAT math facts on one page,
 * ready to print. Shown in the Math (AMC 10) and PSAT Math tracks.
 */
export function PsatFactSheet({
  view,
  back,
}: {
  view: PsatFactSheetView;
  back: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href={back.href} className="text-brand underline">
          ← {back.label}
        </Link>
        <PrintButton />
      </div>
      <div>
        <p className="text-sm font-semibold tracking-widest text-brand uppercase">Fact sheet</p>
        <h1 className="text-4xl font-bold">PSAT review</h1>
        <p className="mt-2 text-muted">
          The math the PSAT/NMSQT tests most, with the skill to practise for each part.
        </p>
      </div>
      {view.sheet.sections.map((s) => (
        <section key={s.skill} aria-labelledby={`facts-${s.skill}`} className="break-inside-avoid">
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
  );
}
