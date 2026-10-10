'use client';

import {
  ErrorCode,
  SubmissionDetail,
  SubmitResponse,
  type VersionSummary,
  checkConstraints,
} from '@storyforge/shared';
import type { Span } from '@storyforge/writing-analysis';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button, ErrorMessage } from '@/components/ui';
import { ApiError, apiJson, apiSend } from '@/lib/api-client';
import { CoachPanel } from './coach-panel';
import { ConflictDialog } from './conflict-dialog';
import { ConstraintsBar } from './constraints-bar';
import { HistoryPanel, formatWhen } from './history-panel';
import { SaveStatusText } from './save-status';
import { useAutosave } from './use-autosave';

type Busy = 'submit' | 'version' | 'restore' | null;

/**
 * The writing workspace (DESIGN.md §6.3) with a plain-text editor: live rules, autosave with an
 * offline safety net, conflict handling, version history, the Coach panel and submit.
 * Remount it (key) for a different submission.
 */
export function WritingWorkspace({
  submission,
  onSubmitted,
  coachTarget,
  onShowInText,
}: {
  submission: SubmissionDetail;
  onSubmitted?: (result: SubmitResponse) => void;
  /**
   * Where the Coach panel goes: `undefined` renders it below the editor; an element renders it
   * there (a side column); `null` means that element isn't mounted yet.
   */
  coachTarget?: HTMLElement | null;
  /** Called before "Show me" selects text, e.g. to switch to the Write tab on phones. */
  onShowInText?: () => void;
}) {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const path = `/submissions/${encodeURIComponent(submission.id)}`;
  const { constraints } = submission.activity.content;
  const [historyKey, setHistoryKey] = useState(0);
  const refreshHistory = () => setHistoryKey((k) => k + 1);
  const { state, controller } = useAutosave(submission, refreshHistory);
  const [showHistory, setShowHistory] = useState(false);
  const [busy, setBusy] = useState<Busy>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [submittedVersion, setSubmittedVersion] = useState(submission.version);
  const [started, setStarted] = useState(false);

  const { wordCount, problems } = checkConstraints(state.text, constraints);
  const blocked =
    wordCount === 0 ||
    state.status === 'conflict' ||
    (constraints.enforcement === 'hard' && problems.length > 0);
  const short = constraints.exactWords !== undefined && constraints.exactWords <= 10;

  function showInText({ start, end }: Span) {
    onShowInText?.();
    requestAnimationFrame(() => {
      const editor = editorRef.current;
      if (!editor) return;
      editor.scrollIntoView({ block: 'center', behavior: 'smooth' });
      editor.focus({ preventScroll: true });
      editor.setSelectionRange(start, end);
    });
  }

  const coach = (
    <CoachPanel text={state.text} activity={submission.activity.content} onShow={showInText} />
  );
  /** Run an action against the server copy once everything is saved. */
  async function withSaved(kind: Exclude<Busy, null>, action: (revision: number) => Promise<void>) {
    setErrors([]);
    setNotice(null);
    setBusy(kind);
    try {
      const revision = await controller.ensureSaved();
      if (revision === null) {
        setErrors(['Your latest changes aren’t saved yet. Check your connection and try again.']);
        return;
      }
      await action(revision);
    } catch (e) {
      if (!(e instanceof ApiError)) {
        setErrors(['Could not reach StoryForge. Check your connection and try again.']);
      } else if (e.problem.code === ErrorCode.SUBMISSION_REVISION_CONFLICT) {
        setErrors(['This writing just changed in another tab. Wait a moment and try again.']);
        void controller.flush();
      } else {
        setErrors(e.problem.errors ?? [e.userMessage]);
      }
    } finally {
      setBusy(null);
    }
  }

  const submit = () =>
    withSaved('submit', async (baseRevision) => {
      const result = await apiJson(`${path}/submit`, SubmitResponse, 'POST', { baseRevision });
      setSubmittedVersion(result.submission.version);
      setNotice(
        result.submission.version > 1
          ? `✓ Submitted again (version ${result.submission.version}).`
          : '✓ Submitted! Nice work.',
      );
      refreshHistory();
      onSubmitted?.(result);
    });

  const saveVersion = () =>
    withSaved('version', async (baseRevision) => {
      await apiSend(`${path}/versions`, 'POST', { baseRevision });
      setNotice('✓ Version saved. Find it in your history.');
      refreshHistory();
    });

  const restore = (version: VersionSummary) =>
    withSaved('restore', async (baseRevision) => {
      const restored = await apiJson(`${path}/restore`, SubmissionDetail, 'POST', {
        versionId: version.id,
        baseRevision,
      });
      controller.replace({
        text: restored.text,
        draftRevision: restored.draftRevision,
        savedAt: restored.updatedAt,
      });
      setNotice(`✓ Restored the version from ${formatWhen(version.createdAt)}.`);
      refreshHistory();
    });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SaveStatusText status={state.status} error={state.error} />
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={saveVersion} disabled={busy !== null}>
            {busy === 'version' ? 'Saving…' : 'Save version'}
          </Button>
          <Button
            variant="secondary"
            aria-expanded={showHistory}
            aria-controls="history-panel"
            onClick={() => setShowHistory((s) => !s)}
          >
            ⟲ History
          </Button>
        </div>
      </div>

      <ConstraintsBar text={state.text} constraints={constraints} started={started} />

      <div className="flex flex-col gap-1">
        <label htmlFor="draft-text" className="font-medium">
          Your writing
        </label>
        <textarea
          ref={editorRef}
          id="draft-text"
          value={state.text}
          onChange={(e) => {
            setStarted(true);
            controller.setText(e.target.value);
          }}
          aria-describedby="rules-status"
          rows={short ? 3 : 12}
          className={`field-sizing-content rounded-xl border border-border bg-card px-4 py-3 text-lg leading-relaxed focus-visible:outline-3 focus-visible:outline-brand ${
            short ? 'min-h-24' : 'min-h-72'
          }`}
        />
      </div>

      {errors.length > 0 && <ErrorMessage message={errors.join(' ')} />}
      {notice && <output className="font-semibold text-ok">{notice}</output>}

      <div className="flex flex-wrap items-center gap-3">
        <Button disabled={busy !== null || blocked} onClick={submit}>
          {busy === 'submit' ? 'Submitting…' : submittedVersion > 0 ? 'Submit again' : 'Submit'}
        </Button>
        {submittedVersion > 0 && (
          <span className="text-sm text-muted">
            Submitted {submittedVersion} {submittedVersion === 1 ? 'time' : 'times'}
          </span>
        )}
      </div>

      {coachTarget === undefined ? (
        <div className="rounded-xl border border-border bg-background p-4">{coach}</div>
      ) : (
        coachTarget && createPortal(coach, coachTarget)
      )}

      {showHistory && (
        <HistoryPanel
          submissionId={submission.id}
          refreshKey={historyKey}
          restoring={busy === 'restore'}
          onRestore={restore}
        />
      )}

      <ConflictDialog
        mine={state.text}
        theirs={state.conflict?.text ?? null}
        onKeepMine={() => void controller.keepMine()}
        onUseTheirs={() => void controller.takeTheirs()}
      />
    </div>
  );
}
