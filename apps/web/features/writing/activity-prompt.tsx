import type { WritingActivity } from '@storyforge/shared';

/** The prompt side of the workspace: what to write, text to start from, and tips. */
export function ActivityPrompt({
  activity,
  headingLevel = 2,
}: {
  activity: WritingActivity;
  headingLevel?: 1 | 2;
}) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2';
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-sm font-semibold tracking-widest text-brand uppercase">
          ✍️ Writing challenge
        </p>
        <Heading className="mt-1 text-2xl font-bold">{activity.title}</Heading>
        <p className="mt-2 text-lg">{activity.prompt}</p>
      </div>

      {activity.starter && activity.starterInEditor && (
        <details className="rounded-xl border border-border bg-background p-4">
          <summary className="cursor-pointer font-semibold">
            The text is in your writing box: edit it there. See the original
          </summary>
          <p className="mt-2 text-lg whitespace-pre-line italic">{activity.starter}</p>
        </details>
      )}

      {activity.starter && !activity.starterInEditor && (
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-sm font-semibold text-muted">Start from this:</p>
          <p className="mt-1 text-lg italic">{activity.starter}</p>
        </div>
      )}

      {activity.tips.length > 0 && (
        <details className="rounded-xl border border-border bg-background p-4">
          <summary className="cursor-pointer font-semibold">💡 Tips</summary>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {activity.tips.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
