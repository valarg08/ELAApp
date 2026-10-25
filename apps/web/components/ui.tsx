import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

/** Small, accessible building blocks (DESIGN.md §6: large tap targets, visible focus). */

const focus = 'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand';

const buttonStyles = {
  primary: 'bg-brand text-white hover:opacity-90 disabled:opacity-50',
  secondary: 'border border-border bg-card text-foreground hover:bg-background disabled:opacity-50',
  danger: 'border border-bad text-bad bg-card hover:bg-background disabled:opacity-50',
} as const;

type Variant = keyof typeof buttonStyles;

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ComponentProps<'button'> & { variant?: Variant }) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2 font-semibold transition ${focus} ${buttonStyles[variant]} ${className}`}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = 'primary',
  className = '',
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return (
    <Link
      className={`inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-2 font-semibold transition ${focus} ${buttonStyles[variant]} ${className}`}
      {...props}
    />
  );
}

export function Field({
  label,
  hint,
  id,
  className = '',
  ...input
}: ComponentProps<'input'> & { label: string; hint?: string; id: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-medium">
        {label}
      </label>
      <input
        id={id}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className={`min-h-11 rounded-xl border border-border bg-card px-3 py-2 text-base ${focus} ${className}`}
        {...input}
      />
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-border bg-card p-6 shadow-sm ${className}`}>
      {children}
    </section>
  );
}

export function ErrorMessage({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-xl border border-bad bg-card px-4 py-3 text-bad">
      {message}
    </p>
  );
}

/**
 * A page's main area: `full` spans the window's width (signed-in pages: teacher, admin, tests),
 * otherwise a centred column `width` wide (sign-in forms, short notices).
 */
export function PageShell({
  children,
  width = 'max-w-3xl',
  full = false,
}: {
  children: ReactNode;
  width?: string;
  full?: boolean;
}) {
  return (
    <main className={`mx-auto w-full flex-1 ${full ? 'px-4 py-6 md:px-6' : `${width} px-4 py-10`}`}>
      {children}
    </main>
  );
}
