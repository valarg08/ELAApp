import { AdminContentStatus } from '@storyforge/shared';
import { Card, PageShell } from '@/components/ui';
import { serverApi } from '@/lib/server-api';
import { cellClass, tableClass } from '../format';
import { SyncPanel } from './sync-panel';

export const dynamic = 'force-dynamic';

const TRACKS: Record<string, string> = {
  STORY: 'Story Writing',
  ESSAY: 'Essay Writing',
  MATH: 'Math',
};
const STATES = { 'in-sync': 'In sync', changed: 'Changed', new: 'Not loaded' } as const;

export default async function ContentPage() {
  const data = await serverApi('/admin/content', AdminContentStatus);
  if (!data) return null;
  const pending = data.units.filter((u) => u.state !== 'in-sync').length;

  return (
    <PageShell full>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold">Curriculum</h1>
          <p className="mt-2 text-muted">
            Units in /content compared with the database.{' '}
            {pending === 0 ? 'Everything is in sync.' : `${pending} unit(s) need a sync.`}
          </p>
        </div>

        <Card>
          <SyncPanel invalid={data.errors.length > 0} />
          {data.errors.length > 0 && (
            <div className="mt-4">
              <h2 className="font-semibold text-bad">Content problems</h2>
              <ul className="mt-2 list-disc pl-6 text-sm">
                {data.errors.slice(0, 50).map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 text-xl font-semibold">Units</h2>
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th scope="col" className={cellClass}>
                    Track
                  </th>
                  <th scope="col" className={cellClass}>
                    Unit
                  </th>
                  <th scope="col" className={cellClass}>
                    Published
                  </th>
                  <th scope="col" className={cellClass}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.units.map((u) => (
                  <tr key={`${u.track}-${u.number}`}>
                    <td className={cellClass}>{TRACKS[u.track] ?? u.track}</td>
                    <th scope="row" className={`${cellClass} font-medium`}>
                      {u.number}. {u.title}
                    </th>
                    <td className={cellClass}>{u.published ? 'Yes' : 'No'}</td>
                    <td
                      className={`${cellClass} ${u.state === 'in-sync' ? 'text-ok' : 'font-semibold text-warn'}`}
                    >
                      {STATES[u.state]}
                    </td>
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
