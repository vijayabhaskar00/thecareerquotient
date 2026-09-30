import Link from "next/link";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
  className?: string;
}

export function SectionHeader({ eyebrow, title, description, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-line-soft px-3 py-1 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-accent">
          <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
          {eyebrow}
        </span>
        <h2 className="mt-5 text-balance text-display-md font-bold text-ink">{title}</h2>
        {description && <p className="mt-4 max-w-xl text-lg text-ink-soft">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="focus-ring group inline-flex shrink-0 items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors duration-200 hover:border-accent hover:text-accent"
        >
          {action.label} &rarr;
        </Link>
      )}
    </div>
  );
}
