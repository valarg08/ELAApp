/** Estimated cost in cents as dollars, e.g. 123.4 → "$1.23". */
export const dollars = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export const count = (n: number) => n.toLocaleString('en-US');

/** A YYYY-MM-DD day as "Oct 22". */
export const shortDay = (day: string) =>
  new Date(`${day}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });

export const tableClass = 'w-full border-collapse text-left text-sm';
export const cellClass = 'border-b border-border px-3 py-2';
