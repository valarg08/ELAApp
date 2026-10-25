import type { ClassMentalSkills } from '@storyforge/shared';
import { clock } from './copy';

const midnight = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

function LastPractice({ at }: { at: string | null }) {
  if (!at) return <span className="text-muted">Never</span>;
  // Calendar days, so an evening two days ago is not "Yesterday".
  const days = Math.round((midnight(new Date()) - midnight(new Date(at))) / (24 * 60 * 60 * 1000));
  return (
    <time dateTime={at}>{days <= 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days} days ago`}</time>
  );
}

/**
 * The teacher's Mental Math practice table (mental-math-design.md Part 9): each student's
 * placement level, level badges, daily review streak, best sprint and last practice.
 */
export function ClassMentalPractice({ data }: { data: ClassMentalSkills }) {
  return (
    <section aria-labelledby="practice-heading" className="flex flex-col gap-4">
      <h2 id="practice-heading" className="text-xl font-semibold">
        Mental Math practice
      </h2>
      {data.students.length === 0 ? (
        <p className="text-muted">No students yet. Add them on the class page.</p>
      ) : (
        <section
          className="overflow-x-auto rounded-2xl border border-border bg-card focus-visible:outline-3 focus-visible:outline-brand"
          // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a scrollable region must be keyboard focusable (axe)
          tabIndex={0}
          aria-label="Practice table"
        >
          <table className="w-full min-w-2xl text-left text-sm">
            <caption className="sr-only">
              Mental Math practice: one row per student, with the placement level, level badges,
              daily review streak, best sprint and last practice
            </caption>
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="sticky left-0 z-10 bg-card p-3 font-semibold">
                  Student
                </th>
                <th scope="col" className="p-3 font-semibold">
                  Placement
                </th>
                <th scope="col" className="p-3 font-semibold">
                  Level badges
                </th>
                <th scope="col" className="p-3 font-semibold">
                  Review streak
                </th>
                <th scope="col" className="p-3 font-semibold">
                  Best sprint
                </th>
                <th scope="col" className="p-3 font-semibold">
                  Last practice
                </th>
              </tr>
            </thead>
            <tbody>
              {data.students.map((s) => (
                <tr key={s.studentId} className="border-t border-border">
                  <th scope="row" className="sticky left-0 z-10 bg-card p-3 font-normal">
                    {s.displayName}
                  </th>
                  <td className="p-3">
                    {s.startLevel ? (
                      `Level ${s.startLevel}`
                    ) : (
                      <span className="text-muted">Not taken</span>
                    )}
                  </td>
                  <td className="p-3">
                    {s.badges.length > 0 ? (
                      <>
                        <span aria-hidden="true">🏅 </span>
                        {s.badges.map((b) => `Level ${b}`).join(', ')}
                      </>
                    ) : (
                      <span className="text-muted">None yet</span>
                    )}
                  </td>
                  <td className="p-3">
                    {s.streak > 0 ? (
                      <>
                        <span aria-hidden="true">🔥 </span>
                        {s.streak} {s.streak === 1 ? 'day' : 'days'}
                      </>
                    ) : (
                      <span className="text-muted">0 days</span>
                    )}
                  </td>
                  <td className="p-3">
                    {s.sprintBest ? (
                      `${s.sprintBest.correct} right in ${clock(s.sprintBest.seconds)}`
                    ) : (
                      <span className="text-muted">Not yet</span>
                    )}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <LastPractice at={s.lastPracticeAt} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </section>
  );
}
