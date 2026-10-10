'use client';

import { ErrorCode, SaveDraftResponse, SubmissionDetail } from '@storyforge/shared';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { ApiError, apiJson, apiSend } from '@/lib/api-client';
import { AutosaveController, type DraftTransport, type SaveResult } from './autosave';
import { pendingDraftStore } from './draft-store';

function transportFor(submissionId: string): DraftTransport {
  const path = `/submissions/${encodeURIComponent(submissionId)}`;
  return {
    async save(text, baseRevision): Promise<SaveResult> {
      try {
        const res = await apiJson(`${path}/draft`, SaveDraftResponse, 'PATCH', {
          text,
          baseRevision,
        });
        return { ok: true, ...res };
      } catch (e) {
        if (!(e instanceof ApiError)) return { ok: false, kind: 'offline' }; // network failure
        if (e.problem.code === ErrorCode.SUBMISSION_REVISION_CONFLICT)
          return { ok: false, kind: 'conflict' };
        // Server trouble is retried like being offline; anything else needs the student.
        if (e.problem.status >= 500) return { ok: false, kind: 'offline' };
        return { ok: false, kind: 'error', message: e.userMessage };
      }
    },
    async load() {
      try {
        const { text, draftRevision } = await apiJson(path, SubmissionDetail);
        return { text, draftRevision };
      } catch {
        return null;
      }
    },
    async snapshot(baseRevision) {
      await apiSend(`${path}/versions`, 'POST', { baseRevision }).catch(() => undefined);
    },
  };
}

/** Connects an AutosaveController to React for one submission (remount the caller per submission). */
export function useAutosave(submission: SubmissionDetail, onSnapshot: () => void) {
  const [controller] = useState(
    () =>
      new AutosaveController(
        {
          text: submission.text,
          draftRevision: submission.draftRevision,
          savedAt: submission.updatedAt,
        },
        transportFor(submission.id),
        pendingDraftStore(submission.id),
      ),
  );
  useEffect(() => {
    controller.setSnapshotListener(onSnapshot);
  });
  const state = useSyncExternalStore(
    controller.subscribe,
    controller.getState,
    controller.getState,
  );

  useEffect(() => {
    void controller.recover();
    const onHidden = () => {
      if (document.visibilityState === 'hidden') void controller.flush();
    };
    window.addEventListener('online', controller.retry);
    document.addEventListener('visibilitychange', onHidden);
    return () => {
      window.removeEventListener('online', controller.retry);
      document.removeEventListener('visibilitychange', onHidden);
      controller.stop();
    };
  }, [controller]);

  return { state, controller };
}
