/** Native <progress> so assistive tech announces it, styled to match the design. */
export function ProgressBar({ value, max, label }: { value: number; max: number; label: string }) {
  return (
    <progress
      aria-label={label}
      value={value}
      max={Math.max(max, 1)}
      className="h-2.5 w-full appearance-none overflow-hidden rounded-full bg-border [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-brand [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-border [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-brand"
    />
  );
}
