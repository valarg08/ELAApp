import { AdminAnalytics } from '@storyforge/shared';
import { Card, PageShell } from '@/components/ui';
import { serverApi } from '@/lib/server-api';
import { cellClass, count, shortDay, tableClass } from './format';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  const data = await serverApi('/admin/analytics', AdminAnalytics);
  if (!data) return null;
  const totals = [
    ['Schools', data.totals.schools],
    ['Teachers', data.totals.teachers],
    ['Classes', data.totals.classes],
    ['Students', data.totals.students],
    ['Submissions', data.totals.submissions],
  ] as const;

  return (
    <PageShell full>
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold">Platform overview</h1>
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {totals.map(([label, n]) => (
            <div key={label} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <dt className="text-sm text-muted">{label}</dt>
              <dd className="text-2xl font-bold">{count(n)}</dd>
            </div>
          ))}
        </dl>
        <Card>
          <h2 className="mb-4 text-xl font-semibold">The last 14 days (UTC)</h2>
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th scope="col" className={cellClass}>
                    Day
                  </th>
                  <th scope="col" className={`${cellClass} text-right`}>
                    Active students
                  </th>
                  <th scope="col" className={`${cellClass} text-right`}>
                    Lessons completed
                  </th>
                  <th scope="col" className={`${cellClass} text-right`}>
                    Submissions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.days.toReversed().map((d) => (
                  <tr key={d.day}>
                    <th scope="row" className={`${cellClass} font-medium`}>
                      {shortDay(d.day)}
                    </th>
                    <td className={`${cellClass} text-right`}>{count(d.activeStudents)}</td>
                    <td className={`${cellClass} text-right`}>{count(d.lessonsCompleted)}</td>
                    <td className={`${cellClass} text-right`}>{count(d.submissions)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
