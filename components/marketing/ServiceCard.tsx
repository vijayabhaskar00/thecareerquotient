import Link from "next/link";
import type { Service } from "@/content/services/types";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="flex flex-col rounded-xl border border-navy-100 bg-white p-6">
      <h3 className="text-lg font-semibold text-navy-900">{service.name}</h3>
      <p className="mt-2 text-sm text-navy-700">{service.tagline}</p>
      <ul className="mt-4 flex-1 space-y-1 text-sm text-navy-700">
        {service.features.slice(0, 3).map((feature) => (
          <li key={feature}>- {feature}</li>
        ))}
      </ul>
      <Link href={`/services/${service.slug}`} className="focus-ring mt-4 inline-block rounded font-semibold text-accent">
        {service.ctaLabel} -&gt;
      </Link>
    </article>
  );
}
