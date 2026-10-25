import { AdminOrg, AdminTeacher } from '@storyforge/shared';
import { Card, PageShell } from '@/components/ui';
import { serverApi } from '@/lib/server-api';
import { cellClass, count, tableClass } from '../format';
import { CreateOrgForm, CreateTeacherForm, TeacherControls } from './school-forms';

export const dynamic = 'force-dynamic';

export default async function SchoolsPage() {
  const [orgs, teachers] = await Promise.all([
    serverApi('/admin/orgs', AdminOrg.array()),
    serverApi('/admin/teachers', AdminTeacher.array()),
  ]);
  if (!orgs || !teachers) return null;
  const choices = orgs.map((o) => ({ id: o.id, name: o.name }));

  return (
    <PageShell full>
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold">Schools & teachers</h1>

        <Card>
          <h2 className="mb-4 text-xl font-semibold">Schools</h2>
          {orgs.length === 0 ? (
            <p className="text-muted">No schools yet. Add the first one below.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className={tableClass}>
                <thead>
                  <tr>
                    <th scope="col" className={cellClass}>
                      School
                    </th>
                    <th scope="col" className={cellClass}>
                      Country · time zone
                    </th>
                    <th scope="col" className={`${cellClass} text-right`}>
                      Teachers
                    </th>
                    <th scope="col" className={`${cellClass} text-right`}>
                      Classes
                    </th>
                    <th scope="col" className={`${cellClass} text-right`}>
                      Students
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orgs.map((o) => (
                    <tr key={o.id}>
                      <th scope="row" className={`${cellClass} font-medium`}>
                        {o.name}
                      </th>
                      <td className={cellClass}>
                        {o.country ?? '—'} · {o.timezone}
                      </td>
                      <td className={`${cellClass} text-right`}>{count(o.teachers)}</td>
                      <td className={`${cellClass} text-right`}>{count(o.classes)}</td>
                      <td className={`${cellClass} text-right`}>{count(o.students)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <h3 className="mt-6 mb-3 text-lg font-semibold">Add a school</h3>
          <CreateOrgForm />
        </Card>

        <Card>
          <h2 className="mb-4 text-xl font-semibold">Teachers</h2>
          {teachers.length === 0 ? (
            <p className="text-muted">No teachers yet. Add the first one below.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {teachers.map((t) => (
                <li
                  key={t.id}
                  className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between"
                >
                  <div>
                    <p className="font-semibold">
                      {t.displayName}
                      {!t.active && (
                        <span className="ml-2 rounded-lg border border-bad px-2 text-sm text-bad">
                          Deactivated
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-muted">
                      {t.email} · {count(t.classes)} {t.classes === 1 ? 'class' : 'classes'} ·{' '}
                      {count(t.students)} {t.students === 1 ? 'student' : 'students'} · last login{' '}
                      {t.lastLoginAt
                        ? new Date(t.lastLoginAt).toLocaleDateString('en-US')
                        : 'never'}
                    </p>
                  </div>
                  <TeacherControls teacher={t} orgs={choices} />
                </li>
              ))}
            </ul>
          )}
          <h3 className="mt-6 mb-3 text-lg font-semibold">Add a teacher</h3>
          <p className="mb-3 text-sm text-muted">
            Use this when teacher sign-up is closed (the public site). The password is shown once;
            give it to the teacher privately.
          </p>
          <CreateTeacherForm orgs={choices} />
        </Card>
      </div>
    </PageShell>
  );
}
