import Link from "next/link";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
  className?: string;
  /** Use on dark (forest) backgrounds. */
  tone?: "light" | "dark";
}

export function SectionHeader({ eyebrow, title, description, action, className, tone = "light" }: SectionHeaderProps) {
  const dark = tone === "dark";

  return (
    <div className={cn("flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="max-w-3xl">
        <p className={cn("text-sm font-bold", dark ? "text-accent" : "text-accent-ink")}>{eyebrow}</p>
        <h2 className={`mt-2 text-balance text-display-md uppercase ${dark ? "text-white" : "text-ink"}`}>{title}</h2>
        {description && <p className={cn("mt-4 max-w-xl text-lg", dark ? "text-sage/80" : "text-ink-soft")}>{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="focus-ring shrink-0 rounded-md border border-ink px-4 py-2.5 text-sm font-semibold text-ink transition-colors duration-150 hover:bg-ink hover:text-sage"
        >
          {action.label} &rarr;
        </Link>
      )}
    </div>
  );
}
