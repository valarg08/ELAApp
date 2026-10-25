import { AdminAiUsage } from '@storyforge/shared';
import { Card, PageShell } from '@/components/ui';
import { serverApi } from '@/lib/server-api';
import { cellClass, count, dollars, shortDay, tableClass } from '../format';
import { BudgetForm } from './budget-form';

export const dynamic = 'force-dynamic';

export default async function AiUsagePage() {
  const data = await serverApi('/admin/ai-usage', AdminAiUsage);
  if (!data) return null;
  const total = data.days.reduce((n, d) => n + d.costCents, 0);

  return (
    <PageShell full>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold">AI usage</h1>
          <p className="mt-2 text-muted">
            Estimated from token counts at list prices: {dollars(total)} over the last 14 days.
            Reaching a school’s daily budget pauses Quill’s live checks for that school until
            midnight UTC; submission feedback always runs.
          </p>
        </div>

        <Card>
          <h2 className="mb-4 text-xl font-semibold">Schools today</h2>
          {data.orgsToday.length === 0 ? (
            <p className="text-muted">No schools yet.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {data.orgsToday.map((o) => (
                <li
                  key={o.orgId}
                  className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between"
                >
                  <div>
                    <p className="font-semibold">{o.name}</p>
                    <p className="text-sm text-muted">
                      {dollars(o.costCents)} today
                      {o.aiDailyBudgetCents === null
                        ? ' · no daily budget'
                        : ` of ${dollars(o.aiDailyBudgetCents)}`}
                      {o.aiDailyBudgetCents !== null && o.costCents >= o.aiDailyBudgetCents && (
                        <span className="ml-2 font-semibold text-bad">Live checks paused</span>
                      )}
                    </p>
                  </div>
                  <BudgetForm orgId={o.orgId} name={o.name} cents={o.aiDailyBudgetCents} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 text-xl font-semibold">By day (UTC)</h2>
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th scope="col" className={cellClass}>
                    Day
                  </th>
                  <th scope="col" className={`${cellClass} text-right`}>
                    Calls
                  </th>
                  <th scope="col" className={`${cellClass} text-right`}>
                    Input tokens
                  </th>
                  <th scope="col" className={`${cellClass} text-right`}>
                    Output tokens
                  </th>
                  <th scope="col" className={`${cellClass} text-right`}>
                    Cache reads
                  </th>
                  <th scope="col" className={`${cellClass} text-right`}>
                    Est. cost
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.days.toReversed().map((d) => (
                  <tr key={d.day}>
                    <th scope="row" className={`${cellClass} font-medium`}>
                      {shortDay(d.day)}
                    </th>
                    <td className={`${cellClass} text-right`}>{count(d.calls)}</td>
                    <td className={`${cellClass} text-right`}>{count(d.inputTokens)}</td>
                    <td className={`${cellClass} text-right`}>{count(d.outputTokens)}</td>
                    <td className={`${cellClass} text-right`}>{count(d.cacheReadTokens)}</td>
                    <td className={`${cellClass} text-right`}>{dollars(d.costCents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-xl font-semibold">By check (last 14 days)</h2>
          {data.byAnalyzer.length === 0 ? (
            <p className="text-muted">No AI calls yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className={tableClass}>
                <thead>
                  <tr>
                    <th scope="col" className={cellClass}>
                      Kind
                    </th>
                    <th scope="col" className={cellClass}>
                      Check
                    </th>
                    <th scope="col" className={`${cellClass} text-right`}>
                      Calls
                    </th>
                    <th scope="col" className={`${cellClass} text-right`}>
                      Est. cost
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.byAnalyzer.map((a) => (
                    <tr key={`${a.kind}|${a.analyzer}`}>
                      <td className={cellClass}>{a.kind}</td>
                      <th scope="row" className={`${cellClass} font-medium`}>
                        {a.analyzer}
                      </th>
                      <td className={`${cellClass} text-right`}>{count(a.calls)}</td>
                      <td className={`${cellClass} text-right`}>{dollars(a.costCents)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </PageShell>
  );
}
