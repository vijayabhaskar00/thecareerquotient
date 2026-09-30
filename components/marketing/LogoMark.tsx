export function LogoMark({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="cq-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#C6F432" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="13" fill="none" stroke="url(#cq-g)" strokeWidth="3" strokeDasharray="62 20" strokeLinecap="round" />
      <circle cx="16" cy="16" r="4.5" fill="url(#cq-g)" />
    </svg>
  );
}
