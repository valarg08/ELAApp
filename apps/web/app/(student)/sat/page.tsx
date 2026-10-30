import { SAT_DOMAINS, SAT_FORMAT, SAT_RULES, satWeekPlan } from '@storyforge/shared';
import { redirect } from 'next/navigation';
import { CourseShell } from '@/components/course-shell';
import { TrackTabs } from '@/components/track-tabs';
import { getMe } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

/** Questions a content area gets in a week, over the two modules (odd and even weeks differ). */
const perWeek = (domain: (typeof SAT_DOMAINS)[number]['id'], week: number) =>
  satWeekPlan(week).reduce((n, m) => n + m[domain], 0);

/**
 * The SAT Math track (sat-design.md): a full SAT Math section to take every week. The page opens
 * with the rules of the test, then this week's test and what the test covers.
 */
export default async function SatHome() {
  const me = await getMe();
  if (!me) redirect('/join');

  return (
    <CourseShell track="SAT">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-bold">SAT Math</h1>
          <p className="mt-2 text-lg text-muted">
            A full SAT Math section to take every week, built to the rules of the digital SAT, with
            worked solutions and results by skill. For grades 8 to 10.
          </p>
        </div>

        <TrackTabs current="SAT" />

        <section aria-labelledby="sat-rules" className="flex flex-col gap-4">
          <h2 id="sat-rules" className="text-2xl font-semibold">
            The rules of the SAT
          </h2>
          <p className="text-muted">
            Read these once before your first test. They are the same rules you will meet on test
            day, and they are shown again at the start of every test.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {SAT_RULES.map((group, i) => (
              <section
                key={group.title}
                aria-labelledby={`sat-rules-${i}`}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <h3 id={`sat-rules-${i}`} className="text-lg font-bold">
                  {group.title}
                </h3>
                <ul className="mt-2 ml-5 flex list-disc flex-col gap-2">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="sat-week"
          className="rounded-2xl border-2 border-accent bg-card p-5 shadow-sm"
        >
          <h2 id="sat-week" className="text-2xl font-semibold">
            This week’s test
          </h2>
          <p className="mt-1 text-muted">
            The weekly tests are on their way: {SAT_FORMAT.totalQuestions} questions in{' '}
            {SAT_FORMAT.totalMinutes} minutes, two modules of {SAT_FORMAT.questionsPerModule}. The
            first one will appear here.
          </p>
        </section>

        <section aria-labelledby="sat-covers" className="flex flex-col gap-3">
          <h2 id="sat-covers" className="text-2xl font-semibold">
            What the test covers
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">
                The content areas of the SAT Math test, their share of the questions and the skills
                in each
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="border-b border-border px-2 py-2">
                    Content area
                  </th>
                  <th scope="col" className="border-b border-border px-2 py-2">
                    Share
                  </th>
                  <th scope="col" className="border-b border-border px-2 py-2">
                    Questions in a test
                  </th>
                  <th scope="col" className="border-b border-border px-2 py-2">
                    Skills
                  </th>
                </tr>
              </thead>
              <tbody>
                {SAT_DOMAINS.map((d) => {
                  const odd = perWeek(d.id, 1);
                  const even = perWeek(d.id, 2);
                  return (
                    <tr key={d.id}>
                      <th scope="row" className="border-b border-border px-2 py-2 align-top">
                        {d.label}
                      </th>
                      <td className="border-b border-border px-2 py-2 align-top">{d.weight}%</td>
                      <td className="border-b border-border px-2 py-2 align-top">
                        {odd === even ? odd : `${odd} or ${even}`}
                      </td>
                      <td className="border-b border-border px-2 py-2 align-top">
                        <ul className="ml-4 list-disc">
                          {d.skills.map((s) => (
                            <li key={s.id}>{s.label}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </CourseShell>
  );
}
