import { SatSkillStandings } from '@storyforge/shared';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CourseShell } from '@/components/course-shell';
import { StartPractice } from '@/features/sat/sat-start';
import { getMe, serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

const LEVEL = ['', 'Easier', 'Medium', 'Harder'];

/**
 * SAT adaptive practice (sat-design.md §7): the skills from weakest to strongest, and a button
 * that starts a set aimed at the weak ones.
 */
export default async function SatPracticePage() {
  const me = await getMe();
  if (!me) redirect('/join');
  const skills = (await serverApi('/sat/practice/skills', SatSkillStandings)) ?? [];

  return (
    <CourseShell track="SAT">
      <div className="flex flex-col gap-6">
        <Link href="/sat" className="text-brand underline">
          ← SAT Math
        </Link>
        <div>
          <h1 className="text-4xl font-bold">Adaptive practice</h1>
          <p className="mt-2 text-lg text-muted">
            Short sets with no clock. Each question is chosen from the skills you are weakest in,
            and a skill gets harder when you get it right and easier when you do not. You see the
            answer and the solution after every question.
          </p>
        </div>
        <div className="self-start">
          <StartPractice label="Practise my weak skills" />
        </div>

        <section aria-labelledby="skills" className="flex flex-col gap-3">
          <h2 id="skills" className="text-2xl font-semibold">
            Your skills, weakest first
          </h2>
          <p className="text-muted">
            From your latest answers in weekly tests and practice. A skill you have not tried yet
            starts at medium.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">
                The SAT skills with the share of recent answers right and the level practice starts
                at
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="border-b border-border px-2 py-2">
                    Skill
                  </th>
                  <th scope="col" className="border-b border-border px-2 py-2">
                    Recent answers right
                  </th>
                  <th scope="col" className="border-b border-border px-2 py-2">
                    Starts at
                  </th>
                </tr>
              </thead>
              <tbody>
                {skills.map((k) => (
                  <tr key={k.id}>
                    <th scope="row" className="border-b border-border px-2 py-2 font-normal">
                      {k.label}
                      <span className="block text-sm text-muted">{k.domainLabel}</span>
                    </th>
                    <td className="w-48 border-b border-border px-2 py-2">
                      {k.accuracy === null ? (
                        <span className="text-muted">Not tried yet</span>
                      ) : (
                        <>
                          {k.accuracy}% ({k.answered} answers)
                          <span
                            aria-hidden="true"
                            className="mt-1 block h-2 overflow-hidden rounded-full bg-border"
                          >
                            <span
                              className="block h-full bg-brand"
                              style={{ width: `${k.accuracy}%` }}
                            />
                          </span>
                        </>
                      )}
                    </td>
                    <td className="border-b border-border px-2 py-2">{LEVEL[k.level]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </CourseShell>
  );
}
