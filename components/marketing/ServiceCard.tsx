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
      className={`group flex flex-col rounded-3xl border border-navy-100 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-navy-100 hover:shadow-soft-lg ${
        featured ? "sm:col-span-2 sm:row-span-2 sm:p-8" : ""
      }`}
    >
      <div
        className={`flex items-center justify-center rounded-2xl bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white ${
          featured ? "size-14" : "size-11"
        }`}
      >
        <Icon className={featured ? "size-7" : "size-5"} strokeWidth={1.75} />
      </div>

      <h3 className={`mt-5 font-semibold text-navy-900 ${featured ? "text-2xl" : "text-lg"}`}>{service.name}</h3>
      <p className={`mt-2 text-navy-700 ${featured ? "text-base" : "text-sm"}`}>{service.tagline}</p>

      <ul className={`mt-4 flex-1 space-y-1.5 text-sm text-navy-700 ${featured ? "" : "hidden sm:block"}`}>
        {service.features.slice(0, featured ? 5 : 3).map((feature) => (
          <li key={feature} className="flex gap-2">
            <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href={`/services/${service.slug}`}
        className="focus-ring mt-5 inline-flex items-center gap-1 rounded font-semibold text-accent transition-transform duration-200 hover:gap-2"
      >
        {service.ctaLabel}
        <span aria-hidden="true">&rarr;</span>
      </Link>
    </article>
  );
}
