import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/marketing/LegalPageLayout";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Employer Terms",
  description: "The terms governing TheCareerQuotient's engagements with employer clients.",
  path: "/employer-terms",
});

export default function EmployerTermsPage() {
  return (
    <LegalPageLayout title="Employer Terms" lastUpdated="Pending counsel review">
      <section>
        <h2 className="text-lg font-semibold text-navy-900">Scope of Services</h2>
        <p className="mt-2 text-sm">This section will describe the staffing services covered by these terms.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-navy-900">Payment Terms</h2>
        <p className="mt-2 text-sm">This section will describe fees, invoicing, and payment timelines.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-navy-900">Confidentiality</h2>
        <p className="mt-2 text-sm">This section will describe how confidential client and candidate information is handled.</p>
      </section>
    </LegalPageLayout>
  );
}
