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
    <article className="group flex h-full flex-col rounded-3xl border border-navy-100 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg">
      <div className="flex size-11 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
        <Icon className="size-5" strokeWidth={1.75} />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-navy-900">{industry.name}</h3>
      <p className="mt-2 text-sm text-navy-700">{industry.intro}</p>
      <Link
        href={`/industries/${industry.slug}`}
        className="focus-ring mt-5 inline-flex items-center gap-1 rounded font-semibold text-accent transition-transform duration-200 hover:gap-2"
      >
        Explore {industry.name}
        <span aria-hidden="true">&rarr;</span>
      </Link>
    </article>
  );
}
