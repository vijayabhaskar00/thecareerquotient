import Link from "next/link";
import {
  Users,
  ClipboardList,
  Search,
  Briefcase,
  FileText,
  FileCheck,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { SpotlightCard } from "@/components/motion/SpotlightCard";
import type { Service } from "@/content/services/types";

const SERVICE_ICONS: Record<string, LucideIcon> = {
  "contingent-staffing": Users,
  "contract-to-hire": ClipboardList,
  "direct-hire": Search,
  "executive-search": Briefcase,
  "employer-of-record": FileText,
  "statement-of-work": FileCheck,
  "high-volume-hiring": Rocket,
};

interface ServiceCardProps {
  service: Service;
  featured?: boolean;
}

export function ServiceCard({ service, featured = false }: ServiceCardProps) {
  const Icon = SERVICE_ICONS[service.slug] ?? Users;

  return (
    <SpotlightCard
      className={`group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 ${
        featured ? "sm:p-10" : ""
      }`}
    >
      {featured && (
        <div
          className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-aurora-violet/30 blur-3xl"
          aria-hidden="true"
        />
      )}
      <div
        className={`relative flex items-center justify-center rounded-2xl border border-line bg-line-soft text-accent transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-black ${
          featured ? "size-16" : "size-12"
        }`}
      >
        <Icon className={featured ? "size-8" : "size-6"} strokeWidth={1.6} />
      </div>

      <h3 className={`relative mt-6 font-semibold tracking-tight text-ink ${featured ? "text-3xl" : "text-xl"}`}>
        {service.name}
      </h3>
      <p className={`relative mt-2 text-ink-soft ${featured ? "max-w-xl text-lg" : "text-sm"}`}>{service.tagline}</p>

      <ul className={`relative mt-5 flex-1 space-y-2 text-sm text-ink-soft ${featured ? "sm:columns-2" : "hidden sm:block"}`}>
        {service.features.slice(0, featured ? 5 : 3).map((feature) => (
          <li key={feature} className="flex gap-2">
            <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href={`/services/${service.slug}`}
        className="focus-ring relative mt-6 inline-flex items-center gap-1 rounded font-semibold text-accent transition-all duration-200 hover:gap-2"
      >
        {service.ctaLabel}
        <span aria-hidden="true">&rarr;</span>
      </Link>
    </SpotlightCard>
  );
}
