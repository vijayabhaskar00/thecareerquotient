import type { Metadata } from "next";
import { services } from "@/content/services/data";
import { ServiceCard } from "@/components/marketing/ServiceCard";
import { CTASection } from "@/components/marketing/CTASection";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Workforce Solutions",
  description: "Contingent staffing, direct hire, executive search, and more workforce solutions from TheCareerQuotient.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-display-lg font-bold text-navy-900">Workforce Solutions Built Around Your Needs</h1>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </div>
      <CTASection
        heading="Not sure which service fits?"
        description="Talk to a talent expert and we'll help you find the right engagement model."
        ctaLabel="Talk to a Talent Expert"
        ctaHref="/contact"
      />
    </div>
  );
}
