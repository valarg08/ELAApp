'use client';

import { ClassUnitPacing, type UpdatePacingRequest } from '@storyforge/shared';
import { useState } from 'react';
import { Button, Card, ErrorMessage } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';

/** yyyy-mm-dd for a date input, from an ISO timestamp. */
const toDateInput = (iso: string | null) => (iso ? iso.slice(0, 10) : '');
/** End of the chosen day in the teacher's timezone, as ISO. */
const fromDateInput = (value: string) =>
  value ? new Date(`${value}T23:59:00`).toISOString() : null;

export function PacingTable({
  classId,
  units: initial,
}: {
  classId: string;
  units: ClassUnitPacing[];
}) {
  const [units, setUnits] = useState(initial);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function update(unitId: string, change: UpdatePacingRequest) {
    setBusyId(unitId);
    setError(null);
    try {
      const updated = await apiJson(
        `/teacher/classes/${classId}/units/${unitId}`,
        ClassUnitPacing,
        'PUT',
        change,
      );
      setUnits((all) => all.map((u) => (u.unitId === unitId ? updated : u)));
    } catch (e) {
      setError(e instanceof ApiError ? e.userMessage : 'Could not save the change.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Card>
      <ErrorMessage message={error} />
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-sm text-muted">
            <tr>
              <th scope="col" className="py-2 pr-4">
                Unit
              </th>
              <th scope="col" className="py-2 pr-4">
                Status
              </th>
              <th scope="col" className="py-2 pr-4">
                Due date
              </th>
              <th scope="col" className="py-2">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {units.map((u) => (
              <tr key={u.unitId} className="border-t border-border">
                <td className="py-3 pr-4">
                  <span className="text-sm text-muted">Unit {u.number}</span>
                  <p className="font-medium">{u.title}</p>
                  {u.published && <p className="text-sm text-muted">{u.lessonCount} lessons</p>}
                </td>
                <td className="py-3 pr-4">
                  {!u.published ? (
                    <span className="text-muted">⏳ Coming soon</span>
                  ) : u.available ? (
                    <span className="font-semibold text-ok">🔓 Open</span>
                  ) : (
                    <span className="text-muted">🔒 Locked</span>
                  )}
                </td>
                <td className="py-3 pr-4">
                  {u.published && (
                    <>
                      <label htmlFor={`due-${u.unitId}`} className="sr-only">
                        Due date for unit {u.number}
                      </label>
                      <input
                        id={`due-${u.unitId}`}
                        type="date"
                        defaultValue={toDateInput(u.dueAt)}
                        disabled={busyId === u.unitId}
                        onChange={(e) =>
                          void update(u.unitId, { dueAt: fromDateInput(e.target.value) })
                        }
                        className="min-h-11 rounded-xl border border-border bg-card px-3 focus-visible:outline-3 focus-visible:outline-brand"
                      />
                    </>
                  )}
                </td>
                <td className="py-3 text-right">
                  {u.published && (
                    <Button
                      variant={u.available ? 'secondary' : 'primary'}
                      disabled={busyId === u.unitId}
                      onClick={() => void update(u.unitId, { hidden: u.available, unlockAt: null })}
                      aria-label={`${u.available ? 'Lock' : 'Unlock'} unit ${u.number}: ${u.title}`}
                    >
                      {u.available ? 'Lock' : 'Unlock'}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
