'use client';

import {
  ErrorCode,
  SubmissionDetail,
  SubmitResponse,
  type VersionSummary,
  checkConstraints,
  chosenEssay,
  FIGURATIVE_ACTIVITY_TYPES,
  SENSORY_ACTIVITY_TYPES,
  trackOfActivityKey,
  constraintsWithTraits,
  planComplete,
  toneComplete,
  validTone,
} from '@storyforge/shared';
import type { Span } from '@storyforge/writing-analysis';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button, ErrorMessage } from '@/components/ui';
import { ApiError, apiJson, apiSend } from '@/lib/api-client';
import { CoachPanel } from './coach-panel';
import { FeedbackPanel } from './feedback-panel';
import { ConflictDialog } from './conflict-dialog';
import { ConstraintsBar } from './constraints-bar';
import { HistoryPanel, formatWhen } from './history-panel';
import { SaveStatusText } from './save-status';
import { ConflictPicker } from './conflict-picker';
import { MoodPicker } from './mood-picker';
import { FigurativeHelper } from './figurative-helper';
import { LineBreakView } from './line-break-view';
import { RhythmPanel } from './rhythm-panel';
import { SyllableMeter } from './syllable-meter';
import { PerspectiveGuide } from './perspective-guide';
import { SenseTracker } from './sense-tracker';
import { ProofreadPanel } from './proofread-panel';
import { ChecklistPanel } from './checklist-panel';
import { EssayPicker } from './essay-picker';
import { SentenceSetPanel } from './sentence-set-panel';
import { WordBankPanel } from './word-bank-panel';
import { useWordBank } from './use-word-bank';
import { PlotPlanner } from './plot-planner';
import { ParagraphBuilder } from './paragraph-builder';
import { OutlineBuilder } from './outline-builder';
import { TonePicker } from './tone-picker';
import { TraitPicker } from './trait-picker';
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
  const rawActivity = submission.activity.content;
  // An essay with a choice of prompts is coached as the kind of essay the student chose.
  const [essayType, setEssayType] = useState(submission.essayType);
  const chosen = chosenEssay(rawActivity, essayType);
  // Only an argumentative essay plans a counterclaim.
  const activity = chosen
    ? {
        ...rawActivity,
        essay: chosen,
        outlineBuilder: rawActivity.outlineBuilder && {
          ...rawActivity.outlineBuilder,
          counterclaim: rawActivity.outlineBuilder.counterclaim && chosen.counterclaim,
        },
      }
    : rawActivity;
  const picker = activity.traitPicker;
  const [traits, setTraits] = useState(submission.traits);
  const constraints = constraintsWithTraits(activity, traits);
  const needsTraits = picker !== undefined && traits.length < picker.count;
  const moodPicker = activity.moodPicker;
  const [mood, setMood] = useState(submission.mood);
  const needsMood = moodPicker !== undefined && mood.length < moodPicker.axes.length;
  const conflictPicker = activity.conflictPicker;
  const [conflict, setConflict] = useState(submission.conflict);
  const plotPlanner = activity.plotPlanner;
  const [plot, setPlot] = useState(submission.plot);
  const needsConflict = conflictPicker !== undefined && conflict === null;
  const needsPlot = plotPlanner !== undefined && !planComplete(plot);
  const paragraphBuilder = activity.paragraphBuilder;
  const [paragraph, setParagraph] = useState(submission.paragraph);
  const outlineBuilder = activity.outlineBuilder;
  const [outline, setOutline] = useState(submission.outline);
  const [checklist, setChecklist] = useState(submission.checklist);
  const tonePicker = activity.tonePicker;
  const [tone, setTone] = useState(submission.tone);
  const needsTone = tonePicker !== undefined && !toneComplete(activity, validTone(activity, tone));
  const [historyKey, setHistoryKey] = useState(0);
  const refreshHistory = () => setHistoryKey((k) => k + 1);
  const { state, controller } = useAutosave(submission, refreshHistory);
  const [showHistory, setShowHistory] = useState(false);
  const [busy, setBusy] = useState<Busy>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [submittedVersion, setSubmittedVersion] = useState(submission.version);
  const [started, setStarted] = useState(false);
  const [wordBank, setWordBank] = useWordBank();
  const [syllables, setSyllables] = useState(submission.syllables);

  const { wordCount, problems } = checkConstraints(state.text, constraints, {
    syllableOverrides: syllables,
  });
  const blocked =
    wordCount === 0 ||
    needsTraits ||
    needsMood ||
    needsConflict ||
    needsPlot ||
    needsTone ||
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

  /** Put words at the cursor (word bank, figurative frames), with a space before if needed. */
  function insertAtCursor(snippet: string) {
    const editor = editorRef.current;
    const text = state.text;
    const start = editor?.selectionStart ?? text.length;
    const end = editor?.selectionEnd ?? text.length;
    const before = text.slice(0, start);
    const after = text.slice(end);
    const pad = before !== '' && !/\s$/.test(before) ? ' ' : '';
    const padAfter = after !== '' && !/^[\s.,!?;:)"”’]/.test(after) ? ' ' : '';
    const caret = start + pad.length + snippet.length + padAfter.length;
    setStarted(true);
    controller.setText(before + pad + snippet + padAfter + after);
    requestAnimationFrame(() => {
      editor?.focus();
      editor?.setSelectionRange(caret, caret);
    });
  }

  const coach = (
    <CoachPanel
      text={state.text}
      activity={activity}
      activityId={submission.activity.id}
      traits={traits}
      mood={mood}
      conflict={conflict}
      plot={plot}
      tone={tone}
      syllables={syllables}
      onShow={showInText}
    />
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

      {picker && (
        <TraitPicker
          submissionId={submission.id}
          picker={picker}
          traits={traits}
          onChange={setTraits}
        />
      )}

      {moodPicker && (
        <MoodPicker
          submissionId={submission.id}
          picker={moodPicker}
          mood={mood}
          onChange={setMood}
        />
      )}

      {conflictPicker && (
        <ConflictPicker
          submissionId={submission.id}
          picker={conflictPicker}
          conflict={conflict}
          onChange={setConflict}
          onStarter={
            state.text.trim() === ''
              ? (line) => {
                  setStarted(true);
                  controller.setText(`${line} `);
                  editorRef.current?.focus();
                }
              : undefined
          }
        />
      )}

      {plotPlanner && (
        <PlotPlanner
          submissionId={submission.id}
          planner={plotPlanner}
          plot={plot}
          onChange={setPlot}
        />
      )}

      {paragraphBuilder && (
        <ParagraphBuilder
          submissionId={submission.id}
          builder={paragraphBuilder}
          plan={paragraph}
          onChange={setParagraph}
          draft={state.text}
          onUse={(next) => {
            setStarted(true);
            controller.setText(next);
            showInText({ start: next.length, end: next.length, text: '' });
          }}
        />
      )}

      {activity.essayPrompts && (
        <EssayPicker
          submissionId={submission.id}
          prompts={activity.essayPrompts}
          value={essayType ?? rawActivity.essay?.type ?? null}
          onChange={setEssayType}
        />
      )}

      {outlineBuilder && activity.essay && (
        <OutlineBuilder
          submissionId={submission.id}
          builder={outlineBuilder}
          essay={activity.essay}
          mode={activity.type === 'ESSAY_OUTLINE' ? 'outline' : 'essay'}
          plan={outline}
          onChange={setOutline}
          draft={state.text}
          onUse={(next) => {
            setStarted(true);
            controller.setText(next);
            showInText({ start: next.length, end: next.length, text: '' });
          }}
        />
      )}

      {tonePicker && (
        <TonePicker
          submissionId={submission.id}
          picker={tonePicker}
          tone={tone}
          onChange={setTone}
        />
      )}

      {constraints.perspectives && (
        <PerspectiveGuide
          text={state.text}
          perspectives={constraints.perspectives}
          onAddHeadings={(next) => {
            setStarted(true);
            controller.setText(next);
            showInText({ start: next.length, end: next.length, text: '' });
          }}
        />
      )}

      {activity.figurativeHelper && (
        <FigurativeHelper helper={activity.figurativeHelper} onUseFrame={insertAtCursor} />
      )}

      {/* The sensory word bank belongs to Story Writing. */}
      {trackOfActivityKey(activity.key) === 'STORY' && (
        <WordBankPanel
          open={
            SENSORY_ACTIVITY_TYPES.includes(activity.type) ||
            FIGURATIVE_ACTIVITY_TYPES.includes(activity.type)
          }
          words={wordBank}
          onWordsChange={setWordBank}
          onInsert={insertAtCursor}
        />
      )}

      {activity.sentenceSet && <SentenceSetPanel set={activity.sentenceSet} text={state.text} />}
      {activity.proofread && <ProofreadPanel proofread={activity.proofread} text={state.text} />}
      {activity.checklist && activity.essay && (
        <ChecklistPanel
          submissionId={submission.id}
          checklist={activity.checklist}
          essay={activity.essay}
          text={state.text}
          ticked={checklist}
          onChange={setChecklist}
        />
      )}

      <ConstraintsBar
        text={state.text}
        constraints={constraints}
        started={started}
        context={{ syllableOverrides: syllables }}
      />
      {activity.senseTracker && <SenseTracker text={state.text} own={wordBank ?? []} />}
      {constraints.syllablePattern && (
        <SyllableMeter
          submissionId={submission.id}
          text={state.text}
          pattern={constraints.syllablePattern}
          overrides={syllables}
          onOverridesChange={setSyllables}
        />
      )}

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

      {activity.lineBreakView && <LineBreakView text={state.text} />}
      {activity.rhythmMode && <RhythmPanel submissionId={submission.id} text={state.text} />}

      {errors.length > 0 && <ErrorMessage message={errors.join(' ')} />}
      {notice && <output className="font-semibold text-ok">{notice}</output>}

      <div className="flex flex-wrap items-center gap-3">
        <Button disabled={busy !== null || blocked} onClick={submit}>
          {busy === 'submit' ? 'Submitting…' : submittedVersion > 0 ? 'Submit again' : 'Submit'}
        </Button>
        {needsTraits && (
          <span className="text-sm text-muted">
            Pick {picker.count === 1 ? 'your character’s trait' : `${picker.count} traits`} above to
            submit.
          </span>
        )}
        {needsConflict && (
          <span className="text-sm text-muted">Choose a conflict card above to submit.</span>
        )}
        {needsPlot && (
          <span className="text-sm text-muted">Fill in all five parts of your plan to submit.</span>
        )}
        {needsTone && (
          <span className="text-sm text-muted">
            Set the tone you’re aiming for above to submit.
          </span>
        )}
        {needsMood && (
          <span className="text-sm text-muted">
            Choose the mood of your setting above to submit.
          </span>
        )}
        {submittedVersion > 0 && (
          <span className="text-sm text-muted">
            Submitted {submittedVersion} {submittedVersion === 1 ? 'time' : 'times'}
          </span>
        )}
      </div>

      {submittedVersion > 0 && (
        <FeedbackPanel
          submissionId={submission.id}
          version={submittedVersion}
          text={state.text}
          onShow={showInText}
        />
      )}

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
