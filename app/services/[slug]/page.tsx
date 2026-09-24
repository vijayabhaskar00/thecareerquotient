import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { services } from "@/content/services/data";
import { industries } from "@/content/industries/data";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { CTASection } from "@/components/marketing/CTASection";
import { IndustryCard } from "@/components/marketing/IndustryCard";

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return buildMetadata({ title: service.name, description: service.summary, path: `/services/${slug}` });
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const relatedIndustries = industries.filter((industry) => industry.services.includes(service.slug)).slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.name, path: `/services/${slug}` },
        ])}
      />
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/services", label: "Services" },
          { href: `/services/${slug}`, label: service.name },
        ]}
      />
      <h1 className="mt-6 text-display-md font-bold text-navy-900">{service.name}</h1>
      <p className="mt-2 text-lg text-navy-700">{service.tagline}</p>
      <p className="mt-6 max-w-3xl text-navy-800">{service.summary}</p>

      <h2 className="mt-10 text-xl font-semibold text-navy-900">What&apos;s included</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {service.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-3 rounded-xl bg-muted p-4 text-sm text-navy-700"
          >
            <Check className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={2.5} />
            {feature}
          </li>
        ))}
      </ul>

      {relatedIndustries.length > 0 && (
        <>
          <h2 className="mt-10 text-xl font-semibold text-navy-900">Industries we apply this to</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            {relatedIndustries.map((industry) => (
              <IndustryCard key={industry.slug} industry={industry} />
            ))}
          </div>
        </>
      )}

      <div className="mt-12">
        <CTASection
          heading={`Ready to get started with ${service.name}?`}
          description="Talk to a talent expert today."
          ctaLabel={service.ctaLabel}
          ctaHref="/hire-talent"
        />
      </div>
    </div>
  );
}
