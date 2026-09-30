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
    <article
      className={`group flex h-full flex-col rounded-xl border p-6 transition-colors duration-150 ${
        featured
          ? "border-forest bg-forest text-sage sm:p-9"
          : "border-line bg-surface-2 hover:border-ink"
      }`}
    >
      <div
        className={`flex items-center justify-center rounded-lg ${
          featured ? "size-14 bg-accent text-ink" : "size-11 bg-line-soft text-ink"
        }`}
      >
        <Icon className={featured ? "size-7" : "size-5"} strokeWidth={1.75} />
      </div>

      <h3 className={`mt-6 ${featured ? "text-3xl text-white" : "text-xl text-ink"}`}>{service.name}</h3>
      <p className={`mt-2 ${featured ? "max-w-xl text-lg text-sage/85" : "text-sm text-ink-soft"}`}>{service.tagline}</p>

      <ul
        className={`mt-5 flex-1 space-y-2 text-sm ${
          featured ? "text-sage/85 sm:columns-2" : "hidden text-ink-soft sm:block"
        }`}
      >
        {service.features.slice(0, featured ? 5 : 3).map((feature) => (
          <li key={feature} className="flex gap-2">
            <span
              className={`mt-2 size-1.5 shrink-0 rounded-full ${featured ? "bg-accent" : "bg-ink"}`}
              aria-hidden="true"
            />
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href={`/services/${service.slug}`}
        className={`focus-ring mt-6 inline-flex items-center gap-1 rounded font-semibold transition-all duration-150 hover:gap-2 ${
          featured ? "text-accent" : "text-accent-ink"
        }`}
      >
        {service.ctaLabel}
        <span aria-hidden="true">&rarr;</span>
      </Link>
    </article>
  );
}
