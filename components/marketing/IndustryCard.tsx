import Link from "next/link";
import { Cpu, Wrench, LineChart, HeartPulse, Factory, Car, Megaphone, Building2, type LucideIcon } from "lucide-react";
import type { Industry } from "@/content/industries/types";

const INDUSTRY_ICONS: Record<string, LucideIcon> = {
  technology: Cpu,
  engineering: Wrench,
  "finance-accounting": LineChart,
  healthcare: HeartPulse,
  manufacturing: Factory,
  automotive: Car,
  "sales-marketing": Megaphone,
  "professional-services": Building2,
};

interface IndustryCardProps {
  industry: Industry;
}

export function IndustryCard({ industry }: IndustryCardProps) {
  const Icon = INDUSTRY_ICONS[industry.slug] ?? Building2;

  return (
    <article className="group flex h-full flex-col rounded-xl border border-line bg-surface-2 p-6 transition-colors duration-150 hover:border-ink">
      <div className="flex size-11 items-center justify-center rounded-lg bg-line-soft text-ink">
        <Icon className="size-5" strokeWidth={1.75} />
      </div>
      <h3 className="mt-6 text-xl text-ink">{industry.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{industry.intro}</p>
      <Link
        href={`/industries/${industry.slug}`}
        className="focus-ring mt-6 inline-flex items-center gap-1 rounded font-semibold text-accent-ink transition-all duration-150 hover:gap-2"
      >
        Explore {industry.name}
        <span aria-hidden="true">&rarr;</span>
      </Link>
    </article>
  );
}
