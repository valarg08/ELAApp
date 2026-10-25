import { MASTERY_LABELS, type MasteryLevel } from '@storyforge/shared';

/** What the grid needs: Math (ClassMathSkills) and Mental Math (ClassMentalSkills) both fit. */
type SkillsGridData = {
  skills: { skill: string; label: string; unit?: number }[];
  students: { studentId: string; displayName: string; levels: Record<string, MasteryLevel> }[];
  weakest: { skill: string; label: string; struggling: number }[];
};

const CELL: Record<MasteryLevel, { mark: string; style: string }> = {
  new: { mark: '', style: 'border-2 border-border' },
  learning: { mark: 'L', style: 'border-2 border-warn bg-warn/15' },
  strong: { mark: 'S', style: 'border-2 border-brand bg-brand/15' },
  mastered: { mark: 'M', style: 'bg-ok text-white' },
};

/**
 * The teacher's skills view (math-design.md §3.3 C5; Mental Math uses it too): the class's
 * weakest skills, then skills × students.
 */
export function ClassSkillsGrid({
  data,
  trackName = 'Math',
}: {
  data: SkillsGridData;
  trackName?: string;
}) {
  // Only skills someone in the class has met, so the grid stays readable.
  const skills = data.skills.filter((s) =>
    data.students.some((st) => (st.levels[s.skill] ?? 'new') !== 'new'),
  );
  return (
    <section aria-labelledby="skills-heading" className="flex flex-col gap-5">
      <h2 id="skills-heading" className="text-xl font-semibold">
        {trackName} skills
      </h2>
      {data.weakest.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="font-semibold">The class’s weakest skills</p>
          <ol className="mt-2 ml-5 list-decimal">
            {data.weakest.map((w) => (
              <li key={w.skill}>
                {w.label}: {w.struggling} {w.struggling === 1 ? 'student' : 'students'} at New or
                Learning
              </li>
            ))}
          </ol>
        </div>
      )}
      <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted" aria-label="Key">
        {(Object.keys(CELL) as MasteryLevel[]).map((l) => (
          <li key={l} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={`inline-flex size-7 items-center justify-center rounded-md text-xs font-bold ${CELL[l].style}`}
            >
              {CELL[l].mark}
            </span>
            {MASTERY_LABELS[l]}
          </li>
        ))}
      </ul>
      {data.students.length === 0 || skills.length === 0 ? (
        <p className="text-muted">
          {data.students.length === 0
            ? 'No students yet. Add them on the class page.'
            : `No ${trackName} answers yet: the grid fills in as students practise.`}
        </p>
      ) : (
        <section
          className="overflow-x-auto rounded-2xl border border-border bg-card focus-visible:outline-3 focus-visible:outline-brand"
          // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a scrollable region must be keyboard focusable (axe)
          tabIndex={0}
          aria-label="Skills grid"
        >
          <table className="w-full text-left text-sm">
            <caption className="sr-only">
              {trackName} skill mastery: one row per student, one column per skill
            </caption>
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="sticky left-0 z-10 bg-card p-3 font-semibold">
                  Student
                </th>
                {skills.map((s) => (
                  <th key={s.skill} scope="col" className="max-w-24 p-2 text-xs font-semibold">
                    {s.unit !== undefined && (
                      <span className="block font-normal text-muted">Unit {s.unit}</span>
                    )}
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.students.map((st) => (
                <tr key={st.studentId} className="border-t border-border">
                  <th scope="row" className="sticky left-0 z-10 bg-card p-3 font-normal">
                    {st.displayName}
                  </th>
                  {skills.map((s) => {
                    const level = st.levels[s.skill] ?? 'new';
                    return (
                      <td key={s.skill} className="p-2 text-center">
                        <span className="sr-only">
                          {s.label}: {MASTERY_LABELS[level]}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`inline-flex size-7 items-center justify-center rounded-md text-xs font-bold ${CELL[level].style}`}
                        >
                          {CELL[level].mark}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </section>
  );
}
