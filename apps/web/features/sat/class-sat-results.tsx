import { SAT_DOMAINS, type SatClassResults } from '@storyforge/shared';
import Link from 'next/link';

const domainLabel = (id: string) => SAT_DOMAINS.find((d) => d.id === id)?.label ?? id;
const pct = (correct: number, total: number) => Math.round((correct / total) * 100);

/** A share as text and a bar (the bar is only a picture; the number is in the cell). */
function Share({ correct, total }: { correct: number; total: number }) {
  const share = pct(correct, total);
  return (
    <>
      {share}%
      <span aria-hidden="true" className="mt-1 block h-2 overflow-hidden rounded-full bg-border">
        <span
          className={`block h-full ${share < 60 ? 'bg-bad' : 'bg-brand'}`}
          style={{ width: `${share}%` }}
        />
      </span>
    </>
  );
}

/**
 * A class's SAT results (sat-design.md §8): each student's estimated score for every weekly test,
 * their weakest skill, and the class's right answers by content area and by skill.
 */
export function ClassSatResults({ classId, data }: { classId: string; data: SatClassResults }) {
  const finished = data.students.filter((s) => s.average !== null).length;
  const classAverage = (() => {
    const scores = data.students.flatMap((s) => (s.average === null ? [] : [s.average]));
    return scores.length === 0
      ? null
      : Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  })();
  const weak = data.skills.filter((k) => k.correct / k.total < 0.6).slice(0, 3);

  if (data.weeks.length === 0)
    return <p className="text-muted">No SAT weekly tests are published yet.</p>;

  return (
    <div className="flex flex-col gap-8">
      <section aria-labelledby="sat-class-summary">
        <h2 id="sat-class-summary" className="mb-3 text-xl font-semibold">
          SAT Math results
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <Stat
            value={`${finished} / ${data.students.length}`}
            label="Students with a finished test"
          />
          <Stat
            value={classAverage === null ? '—' : String(classAverage)}
            label="Average estimated score"
          />
          <Stat value={String(data.weeks.length)} label="Weekly tests published" />
        </div>
        <p className="mt-2 text-sm text-muted">
          Scores are estimates on the 200–800 Math scale, from each student's finished tests. Open a
          student for the rest of their work.
        </p>
      </section>

      <section aria-labelledby="sat-class-scores" className="flex flex-col gap-3">
        <h2 id="sat-class-scores" className="text-xl font-semibold">
          Scores by student and week
        </h2>
        {data.students.length === 0 ? (
          <p className="text-muted">There are no students in this class yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">
                Each student's estimated SAT Math score for every weekly test
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="border-b border-border px-2 py-2">
                    Student
                  </th>
                  {data.weeks.map((w) => (
                    <th key={w.week} scope="col" className="border-b border-border px-2 py-2">
                      Week {w.week}
                    </th>
                  ))}
                  <th scope="col" className="border-b border-border px-2 py-2">
                    Average
                  </th>
                  <th scope="col" className="border-b border-border px-2 py-2">
                    Weakest skill
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.students.map((s) => (
                  <tr key={s.id}>
                    <th scope="row" className="border-b border-border px-2 py-2 text-left">
                      <Link
                        href={`/classes/${classId}/students/${s.id}`}
                        className="text-brand underline"
                      >
                        {s.displayName}
                      </Link>
                    </th>
                    {s.cells.map((c, i) => (
                      <td key={i} className="border-b border-border px-2 py-2 whitespace-nowrap">
                        {c.status === 'done' ? (
                          <>
                            <strong>{c.score}</strong>
                            <span className="text-sm text-muted">
                              {' '}
                              ({c.correct}/{c.total})
                            </span>
                          </>
                        ) : c.status === 'in-progress' ? (
                          <span className="text-warn">In progress</span>
                        ) : (
                          <span className="text-muted">Not started</span>
                        )}
                      </td>
                    ))}
                    <td className="border-b border-border px-2 py-2 font-semibold">
                      {s.average ?? '—'}
                    </td>
                    <td className="border-b border-border px-2 py-2 text-sm">
                      {s.weakest ? (
                        <>
                          {s.weakest.label}{' '}
                          <span className="text-muted">
                            ({s.weakest.correct}/{s.weakest.total})
                          </span>
                        </>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row" className="px-2 py-2 text-left">
                    Class average
                  </th>
                  {data.weekAverages.map((a, i) => (
                    <td key={i} className="px-2 py-2 font-semibold">
                      {a ?? '—'}
                    </td>
                  ))}
                  <td className="px-2 py-2 font-semibold">{classAverage ?? '—'}</td>
                  <td className="px-2 py-2 text-muted">—</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>

      {data.areas.length > 0 && (
        <section aria-labelledby="sat-class-areas" className="flex flex-col gap-3">
          <h2 id="sat-class-areas" className="text-xl font-semibold">
            Right answers by content area
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full max-w-2xl border-collapse text-left">
              <caption className="sr-only">
                The class's share of right answers in each SAT content area
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="border-b border-border px-2 py-2">
                    Content area
                  </th>
                  <th scope="col" className="border-b border-border px-2 py-2">
                    Right
                  </th>
                  <th scope="col" className="w-48 border-b border-border px-2 py-2">
                    Share
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.areas.map((a) => (
                  <tr key={a.id}>
                    <th scope="row" className="border-b border-border px-2 py-2 font-normal">
                      {a.label}
                    </th>
                    <td className="border-b border-border px-2 py-2 whitespace-nowrap">
                      {a.correct} of {a.total}
                    </td>
                    <td className="border-b border-border px-2 py-2">
                      <Share correct={a.correct} total={a.total} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {data.skills.length > 0 && (
        <section aria-labelledby="sat-class-skills" className="flex flex-col gap-3">
          <h2 id="sat-class-skills" className="text-xl font-semibold">
            Skills, weakest first
          </h2>
          {weak.length > 0 && (
            <p className="rounded-xl border border-border bg-card p-3">
              <strong>Worth reteaching:</strong> {weak.map((k) => k.label).join('; ')}.
            </p>
          )}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">
                The class's right answers in each SAT skill, weakest first
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="border-b border-border px-2 py-2">
                    Skill
                  </th>
                  <th scope="col" className="border-b border-border px-2 py-2">
                    Right
                  </th>
                  <th scope="col" className="w-48 border-b border-border px-2 py-2">
                    Share
                  </th>
                  <th scope="col" className="border-b border-border px-2 py-2">
                    Students under 60%
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.skills.map((k) => (
                  <tr key={k.id}>
                    <th scope="row" className="border-b border-border px-2 py-2 font-normal">
                      {k.label}
                      <span className="block text-sm text-muted">{domainLabel(k.domain)}</span>
                    </th>
                    <td className="border-b border-border px-2 py-2 whitespace-nowrap">
                      {k.correct} of {k.total}
                    </td>
                    <td className="border-b border-border px-2 py-2">
                      <Share correct={k.correct} total={k.total} />
                    </td>
                    <td className="border-b border-border px-2 py-2">{k.studentsBelow}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}
