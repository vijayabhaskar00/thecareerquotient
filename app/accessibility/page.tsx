import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/marketing/LegalPageLayout";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Accessibility Statement",
  description: "TheCareerQuotient's commitment to a WCAG 2.2 AA accessible website.",
  path: "/accessibility",
});

export default function AccessibilityPage() {
  return (
    <LegalPageLayout title="Accessibility Statement" lastUpdated="Pending counsel review">
      <section>
        <h2 className="text-lg font-semibold text-navy-900">Our Commitment</h2>
        <p className="mt-2 text-sm">
          TheCareerQuotient aims to make this site usable for people of all abilities, targeting WCAG 2.2 Level AA.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-navy-900">Standards We Reference</h2>
        <p className="mt-2 text-sm">This section will describe the accessibility standards this site is built against.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-navy-900">Feedback</h2>
        <p className="mt-2 text-sm">
          If you encounter an accessibility barrier on this site, please let us know through our contact page.
        </p>
      </section>
    </LegalPageLayout>
  );
}
