/**
 * A 3x3 grid of the brand's open rings. The dark dots hop out of each opening in a
 * diagonal wave, then snap back in: "the match", repeated. Flat SVG + CSS, so it is
 * crisp at any size, weighs ~2 KB, loops seamlessly and needs no JavaScript.
 * Decorative: hidden from assistive tech.
 */
const PITCH = 96;
const ORIGIN = 46;
const WAVE_STEP_MS = 90;

// Open ring (the brand "C", opening to the right), centred on 0,0.
const RING = "M18.4 -15.4 A24 24 0 1 0 18.4 15.4";

const CELLS = [0, 1, 2].flatMap((row) => [0, 1, 2].map((col) => ({ row, col })));

export function DotWave({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 300" className={`overflow-visible ${className ?? ""}`} aria-hidden="true" focusable="false">
      {CELLS.map(({ row, col }) => (
        <g key={`${row}-${col}`} transform={`translate(${ORIGIN + col * PITCH} ${ORIGIN + row * PITCH})`}>
          <path d={RING} fill="none" stroke="#ECF1E9" strokeWidth="11" strokeLinecap="round" />
          <g className="dot-hop" style={{ animationDelay: `${(row + col) * WAVE_STEP_MS}ms` }}>
            <circle cx="22" cy="0" r="9" fill="#0D2B24" />
            <circle cx="19" cy="-3.6" r="2.6" fill="#ECF1E9" opacity="0.28" />
          </g>
        </g>
      ))}
    </svg>
  );
}
