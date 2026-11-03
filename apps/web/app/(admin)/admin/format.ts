/** Estimated cost in cents as dollars, e.g. 123.4 → "$1.23". */
export const dollars = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export const count = (n: number) => n.toLocaleString('en-US');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** A YYYY-MM-DD day as "Oct 22" (no locale APIs, so server and browser match). */
export const shortDay = (day: string) => {
  const [, month, date] = day.split('-');
  return `${MONTHS[Number(month) - 1]} ${Number(date)}`;
};

/** An ISO timestamp as "Nov 1, 2026" in UTC. */
export const shortDate = (iso: string) => {
  const d = new Date(iso);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
};

export const tableClass = 'w-full border-collapse text-left text-sm';
export const cellClass = 'border-b border-border px-3 py-2';
