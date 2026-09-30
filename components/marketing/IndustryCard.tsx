import Link from "next/link";
import { Cpu, Wrench, LineChart, HeartPulse, Factory, Car, Megaphone, Building2, type LucideIcon } from "lucide-react";
import { SpotlightCard } from "@/components/motion/SpotlightCard";
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
    <SpotlightCard className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40">
      <div className="relative flex size-12 items-center justify-center rounded-2xl border border-line bg-line-soft text-accent transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-black">
        <Icon className="size-6" strokeWidth={1.6} />
      </div>
      <h3 className="relative mt-6 text-xl font-semibold tracking-tight text-ink">{industry.name}</h3>
      <p className="relative mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{industry.intro}</p>
      <Link
        href={`/industries/${industry.slug}`}
        className="focus-ring relative mt-6 inline-flex items-center gap-1 rounded font-semibold text-accent transition-all duration-200 hover:gap-2"
      >
        Explore {industry.name}
        <span aria-hidden="true">&rarr;</span>
      </Link>
    </SpotlightCard>
  );
}
