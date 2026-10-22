/**
 * The Owlery Academy owl (the same drawing as app/icon.svg, the browser tab icon), sized to the
 * text around it. Decorative: the words beside it say what it is.
 */
export function OwlIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      className={`inline-block h-[1.15em] w-[1.15em] shrink-0 align-[-0.2em] ${className}`}
    >
      <rect width="64" height="64" rx="14" fill="#043345" />
      <path d="M14 20 L20 8 L27 17 Z M50 20 L44 8 L37 17 Z" fill="#0d9aac" />
      <ellipse cx="32" cy="36" rx="20" ry="21" fill="#0d9aac" />
      <ellipse cx="32" cy="43" rx="12" ry="11" fill="#00b6c7" />
      <circle cx="23" cy="29" r="8.5" fill="#ffffff" />
      <circle cx="41" cy="29" r="8.5" fill="#ffffff" />
      <circle cx="23.5" cy="29.5" r="4" fill="#043345" />
      <circle cx="40.5" cy="29.5" r="4" fill="#043345" />
      <circle cx="25" cy="28" r="1.3" fill="#ffffff" />
      <circle cx="42" cy="28" r="1.3" fill="#ffffff" />
      <path d="M28.5 36 L35.5 36 L32 42 Z" fill="#00ff99" />
    </svg>
  );
}
