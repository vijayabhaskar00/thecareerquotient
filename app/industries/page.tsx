import type { Metadata } from "next";
import { industries } from "@/content/industries/data";
import { IndustryCard } from "@/components/marketing/IndustryCard";
import { CTASection } from "@/components/marketing/CTASection";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Industries We Serve",
  description: "Specialized staffing and workforce solutions across technology, engineering, finance, healthcare, and more.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-display-lg font-bold text-navy-900">Industries We Serve</h1>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((industry) => (
            <IndustryCard key={industry.slug} industry={industry} />
          ))}
        </div>
      </div>
      <CTASection
        heading="Don't see your industry?"
        description="We recruit across a wide range of specialties. Tell us what you need."
        ctaLabel="Talk to a Talent Expert"
        ctaHref="/contact"
      />
    </div>
  );
}
