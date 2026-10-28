/** Native <progress> so assistive tech announces it, styled to match the design. */
export function ProgressBar({
  value,
  max,
  label,
  onCyan = false,
}: {
  value: number;
  max: number;
  label: string;
  /** On the Progress panel: a deep teal bar on a white track. */
  onCyan?: boolean;
}) {
  const colours = onCyan
    ? 'bg-white [&::-moz-progress-bar]:bg-brand [&::-webkit-progress-bar]:bg-white [&::-webkit-progress-value]:bg-brand'
    : 'bg-border [&::-moz-progress-bar]:bg-green [&::-webkit-progress-bar]:bg-border [&::-webkit-progress-value]:bg-green';
  return (
    <progress
      aria-label={label}
      value={value}
      max={Math.max(max, 1)}
      className={`h-2.5 w-full appearance-none overflow-hidden rounded-full [&::-moz-progress-bar]:rounded-full [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:rounded-full ${colours}`}
    />
  );
}
