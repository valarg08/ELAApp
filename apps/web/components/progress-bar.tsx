/** Native <progress> so assistive tech announces it, styled to match the design. */
export function ProgressBar({
  value,
  max,
  label,
  onDark = false,
}: {
  value: number;
  max: number;
  label: string;
  /** On the deep teal side panels: a mint bar on a faint track. */
  onDark?: boolean;
}) {
  const colours = onDark
    ? 'bg-white/25 [&::-moz-progress-bar]:bg-mint [&::-webkit-progress-bar]:bg-white/25 [&::-webkit-progress-value]:bg-mint'
    : 'bg-border [&::-moz-progress-bar]:bg-brand [&::-webkit-progress-bar]:bg-border [&::-webkit-progress-value]:bg-brand';
  return (
    <progress
      aria-label={label}
      value={value}
      max={Math.max(max, 1)}
      className={`h-2.5 w-full appearance-none overflow-hidden rounded-full [&::-moz-progress-bar]:rounded-full [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:rounded-full ${colours}`}
    />
  );
}
