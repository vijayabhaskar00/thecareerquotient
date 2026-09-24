import type { Metadata } from "next";
import { values } from "@/content/values";
import { team } from "@/content/team";
import { CTASection } from "@/components/marketing/CTASection";
import { EmptyState } from "@/components/states/EmptyState";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description:
    "TheCareerQuotient exists to make hiring and career development more human, more intelligent, and more effective.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-display-md font-bold text-navy-900">Talent Is Personal.</h1>
        <p className="mt-6 text-lg text-navy-700">
          TheCareerQuotient exists to make hiring and career development more human, more intelligent, and more
          effective. We built this company because too much of staffing treats people like line items - a resume
          matched to a keyword, a requisition closed and forgotten. We think hiring works better when it starts from
          the assumption that both sides of the table are making one of the more consequential decisions of their
          year.
        </p>
        <p className="mt-4 text-lg text-navy-700">
          That means recruiters who ask why a role exists before they ask what it requires. It means candidates who
          get real feedback, not silence. And it means we stay in the relationship after the placement is made,
          because that&apos;s when you actually find out if it worked.
        </p>
      </div>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-display-md font-bold text-navy-900">What We Stand For</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="rounded-xl border border-navy-100 p-6">
                <h3 className="font-semibold text-navy-900">{value.title}</h3>
                <p className="mt-2 text-sm text-navy-700">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-display-md font-bold text-navy-900">Leadership</h2>
        {team.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              heading="Leadership profiles coming soon."
              description="We're introducing our leadership team here shortly."
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {team.map((member) => (
              <div key={member.name} className="rounded-xl border border-navy-100 p-6">
                <h3 className="font-semibold text-navy-900">{member.name}</h3>
                <p className="text-sm text-navy-700">{member.role}</p>
                <p className="mt-2 text-sm text-navy-700">{member.bio}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <CTASection
        heading="Want to work with us?"
        description="Whether you're hiring or looking for your next role, we'd like to hear from you."
        ctaLabel="Contact Us"
        ctaHref="/contact"
      />
    </div>
  );
}
