/** Open ring (the "C") with a dot sitting in its opening: the match. */
export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#0D2B24" />
      <path
        d="M21.2 10.6A8 8 0 1 0 21.2 21.4"
        fill="none"
        stroke="#E9EEE9"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      <circle cx="22" cy="16" r="2.6" fill="#FF5A1F" />
    </svg>
  );
}
