import {
  MASTERY_LABELS,
  MATH_STRANDS,
  type MasteryLevel,
  type MathSkillsView,
  type UnitSummary,
} from '@storyforge/shared';
import Link from 'next/link';
import { clock, points } from './copy';

const LEVEL_STYLE: Record<MasteryLevel, string> = {
  new: 'border-border bg-card text-muted',
  learning: 'border-warn/60 bg-background',
  strong: 'border-brand bg-brand/10',
  mastered: 'border-ok bg-ok text-white',
};

/**
 * My skills (math-design.md §3.2 B2, B5, §3.4 D4, §4.15): full-test scores with the AMC-score
 * estimate, the danger zones, then every skill by strand with its mastery level, how sure I was
 * against how often I was right, and my score by question position.
 */
export function SkillsView({ view, units }: { view: MathSkillsView; units: UnitSummary[] }) {
  const slugOf = new Map(units.map((u) => [u.number, u.slug]));
  const skillUnit = new Map(view.skills.map((s) => [s.skill, s.units[0]]));
  const { scores } = view;
  return (
    <div className="flex flex-col gap-8">
      <section aria-labelledby="amc-scores" className="flex flex-col gap-3">
        <h2 id="amc-scores" className="text-2xl font-semibold">
          Full tests and my AMC-score estimate
        </h2>
        {scores.estimate ? (
          <p className="rounded-2xl border-2 border-brand bg-card p-4 text-lg">
            Estimate: about <strong>{points(scores.estimate.points)}</strong> of 150 (likely{' '}
            {points(scores.estimate.low)}–{points(scores.estimate.high)}), from your last{' '}
            {scores.estimate.basedOn === 1 ? 'full test' : `${scores.estimate.basedOn} full tests`}.
            It is a guide from practice papers, not a promise.
          </p>
        ) : (
          <p className="text-muted">
            Take a checkpoint or a Unit 15 mock, or log a past paper, to see an estimate.
          </p>
        )}
        {scores.tests.length > 0 && (
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Full 25-question tests, newest first</caption>
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="py-2">
                  Test
                </th>
                <th scope="col">Date</th>
                <th scope="col">Points</th>
              </tr>
            </thead>
            <tbody>
              {scores.tests.slice(0, 8).map((t, i) => (
                <tr key={i} className="border-b border-border">
                  <th scope="row" className="py-2 font-normal">
                    {t.attemptId ? (
                      <Link
                        href={`/math/attempts/${encodeURIComponent(t.attemptId)}`}
                        className="text-brand underline"
                      >
                        {t.title}
                      </Link>
                    ) : (
                      <>{t.title} (past paper)</>
                    )}
                  </th>
                  <td>{t.date.slice(0, 10)}</td>
                  <td>{points(t.points)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Link href="/math/past-papers" className="self-start text-brand underline">
          My past-paper log
        </Link>
      </section>

      <section aria-labelledby="danger-zones" className="flex flex-col gap-3">
        <h2 id="danger-zones" className="text-2xl font-semibold">
          Danger zones
        </h2>
        {view.dangerZones.length === 0 ? (
          <p className="text-muted">
            None yet. Answer more problems and this shows where points slip away.
          </p>
        ) : (
          <ol className="grid gap-3 md:grid-cols-3">
            {view.dangerZones.map((z, i) => {
              const unit = z.skill ? skillUnit.get(z.skill) : undefined;
              const slug = unit !== undefined ? slugOf.get(unit) : undefined;
              return (
                <li
                  key={i}
                  className="flex flex-col gap-2 rounded-2xl border-2 border-warn/60 bg-card p-4"
                >
                  <p className="font-bold">{z.title}</p>
                  <p className="text-muted">{z.reason}</p>
                  {slug && (
                    <Link href={`/units/${slug}`} className="text-brand underline">
                      Practise this
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </section>

      <section aria-labelledby="skill-mastery" className="flex flex-col gap-4">
        <h2 id="skill-mastery" className="text-2xl font-semibold">
          Skill mastery
        </h2>
        <p className="text-muted">
          New → Learning → Strong → Mastered. A skill is Mastered when you get harder problems on it
          right without hints, on two different days.
        </p>
        {MATH_STRANDS.map((strand) => {
          const skills = view.skills.filter((s) => s.strand === strand.id);
          if (skills.length === 0) return null;
          return (
            <div key={strand.id} className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold">
                <span aria-hidden="true">{strand.emoji} </span>
                {strand.label}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <li
                    key={s.skill}
                    className={`rounded-xl border-2 px-3 py-2 text-sm ${LEVEL_STYLE[s.level]}`}
                  >
                    <span className="font-semibold">{s.label}</span>
                    <span className="block">
                      {MASTERY_LABELS[s.level]}
                      {s.accuracy !== null && ` · ${s.accuracy}%`}
                      {s.medianSeconds !== null && ` · ${clock(s.medianSeconds)} each`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <section aria-labelledby="calibration" className="flex flex-col gap-2">
          <table className="w-full border-collapse text-left">
            <caption id="calibration" className="mb-2 text-left text-xl font-semibold">
              How sure were you?
            </caption>
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="py-2">
                  You said
                </th>
                <th scope="col">Answers</th>
                <th scope="col">Right</th>
              </tr>
            </thead>
            <tbody>
              {view.calibration.map((c) => (
                <tr key={c.confidence} className="border-b border-border">
                  <th scope="row" className="py-2 font-normal">
                    {c.label}
                  </th>
                  <td>{c.answered}</td>
                  <td>{c.percent === null ? '–' : `${c.percent}%`}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {view.calibrationAdvice && <p>{view.calibrationAdvice}</p>}
        </section>

        <section aria-labelledby="positions" className="flex flex-col gap-2">
          <table className="w-full border-collapse text-left">
            <caption id="positions" className="mb-2 text-left text-xl font-semibold">
              By question position (tests and sprints)
            </caption>
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="py-2">
                  Questions
                </th>
                <th scope="col">Answers</th>
                <th scope="col">Right</th>
              </tr>
            </thead>
            <tbody>
              {view.positions.map((p) => (
                <tr key={p.band} className="border-b border-border">
                  <th scope="row" className="py-2 font-normal">
                    {p.band}
                  </th>
                  <td>{p.answered}</td>
                  <td>{p.percent === null ? '–' : `${p.percent}%`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
