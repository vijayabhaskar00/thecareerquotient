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
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="max-w-2xl">
        <div className="flex items-center gap-2">
          <span className="h-px w-8 bg-accent" aria-hidden="true" />
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-accent">{eyebrow}</span>
        </div>
        <h2 className="mt-3 text-display-md font-bold text-navy-900">{title}</h2>
        {description && <p className="mt-3 text-navy-700">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="focus-ring shrink-0 rounded font-semibold text-accent transition-transform duration-200 hover:gap-2"
        >
          {action.label} &rarr;
        </Link>
      )}
    </div>
  );
}
