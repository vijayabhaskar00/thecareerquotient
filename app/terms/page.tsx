import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/marketing/LegalPageLayout";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description: "The terms governing use of the TheCareerQuotient website.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="Pending counsel review">
      <section>
        <h2 className="text-lg font-semibold text-navy-900">Acceptance of Terms</h2>
        <p className="mt-2 text-sm">This section will describe what using this site means you agree to.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-navy-900">Use of the Site</h2>
        <p className="mt-2 text-sm">This section will describe permitted and prohibited uses of this site.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-navy-900">Limitation of Liability</h2>
        <p className="mt-2 text-sm">This section will describe the limits of TheCareerQuotient&apos;s liability.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-navy-900">Changes to These Terms</h2>
        <p className="mt-2 text-sm">This section will describe how and when these terms may be updated.</p>
      </section>
    </LegalPageLayout>
  );
}
