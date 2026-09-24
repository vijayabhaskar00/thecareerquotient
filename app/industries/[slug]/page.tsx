import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { industries } from "@/content/industries/data";
import { services } from "@/content/services/data";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, faqPageJsonLd } from "@/lib/seo/jsonld";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { ServiceCard } from "@/components/marketing/ServiceCard";
import { FAQAccordion } from "@/components/marketing/FAQAccordion";
import { CTASection } from "@/components/marketing/CTASection";

interface IndustryDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({ params }: IndustryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const industry = industries.find((i) => i.slug === slug);
  if (!industry) return {};
  return buildMetadata({ title: industry.name, description: industry.intro, path: `/industries/${slug}` });
}

export default async function IndustryDetailPage({ params }: IndustryDetailPageProps) {
  const { slug } = await params;
  const industry = industries.find((i) => i.slug === slug);
  if (!industry) notFound();

  const relatedServices = services.filter((s) => industry.services.includes(s.slug));

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Industries", path: "/industries" },
          { name: industry.name, path: `/industries/${slug}` },
        ])}
      />
      <JsonLd data={faqPageJsonLd(industry.faqs)} />
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/industries", label: "Industries" },
          { href: `/industries/${slug}`, label: industry.name },
        ]}
      />
      <h1 className="mt-6 text-display-md font-bold text-navy-900">{industry.name}</h1>
      <p className="mt-6 max-w-3xl text-navy-800">{industry.intro}</p>

      <h2 className="mt-10 text-xl font-semibold text-navy-900">Workforce challenges we solve</h2>
      <ul className="mt-4 space-y-3">
        {industry.challenges.map((challenge) => (
          <li key={challenge} className="flex items-start gap-3 rounded-xl bg-muted p-4 text-sm text-navy-700">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={2} />
            {challenge}
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-xl font-semibold text-navy-900">Roles we recruit</h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {industry.roles.map((role) => (
          <li key={role} className="rounded-full border border-navy-100 px-4 py-2 text-sm text-navy-700">
            {role}
          </li>
        ))}
      </ul>

      {relatedServices.length > 0 && (
        <>
          <h2 className="mt-10 text-xl font-semibold text-navy-900">Services available</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedServices.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </>
      )}

      <h2 className="mt-10 text-xl font-semibold text-navy-900">Frequently asked questions</h2>
      <div className="mt-4">
        <FAQAccordion items={industry.faqs} />
      </div>

      <div className="mt-12">
        <CTASection
          heading={`Ready to hire in ${industry.name}?`}
          description="Talk to a talent expert about your workforce needs."
          ctaLabel="Hire Talent"
          ctaHref="/hire-talent"
        />
      </div>
    </div>
  );
}
