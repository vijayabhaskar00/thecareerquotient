import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/marketing/LegalPageLayout";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Candidate Privacy Notice",
  description: "How TheCareerQuotient handles resumes and candidate information.",
  path: "/candidate-privacy",
});

export default function CandidatePrivacyPage() {
  return (
    <LegalPageLayout title="Candidate Privacy Notice" lastUpdated="Pending counsel review">
      <section>
        <h2 className="text-lg font-semibold text-navy-900">Information Collected From Candidates</h2>
        <p className="mt-2 text-sm">This section will describe the resume and profile information collected from candidates.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-navy-900">How Resume Data Is Used</h2>
        <p className="mt-2 text-sm">This section will describe how submitted resumes are used and who can access them.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-navy-900">Retention and Deletion</h2>
        <p className="mt-2 text-sm">This section will describe how long candidate data is retained and how to request deletion.</p>
      </section>
    </LegalPageLayout>
  );
}
