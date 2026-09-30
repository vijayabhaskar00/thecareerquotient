interface MarqueeProps {
  items: string[];
}

/** Decorative, endlessly scrolling ticker. Hidden from assistive tech. */
export function Marquee({ items }: MarqueeProps) {
  const row = (
    <ul className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-10 whitespace-nowrap font-display text-2xl font-semibold tracking-tight text-ink/80 sm:text-4xl">
          {item}
          <span className="size-2 rounded-full bg-accent" />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y border-line py-6 [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]"
    >
      <div className="animate-marquee flex w-max">
        {row}
        {row}
      </div>
    </div>
  );
}
