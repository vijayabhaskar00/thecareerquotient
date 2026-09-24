import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageLayout } from "@/components/marketing/LegalPageLayout";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How TheCareerQuotient collects, uses, and protects personal information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="Pending counsel review">
      <section>
        <h2 className="text-lg font-semibold text-navy-900">Information We Collect</h2>
        <p className="mt-2 text-sm">
          This section will describe the categories of personal information collected through this site, including
          information submitted through forms and any information collected automatically.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-navy-900">How We Use Information</h2>
        <p className="mt-2 text-sm">This section will describe the purposes for which collected information is used.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-navy-900">Your Rights</h2>
        <p className="mt-2 text-sm">
          This section will describe the rights available to individuals regarding their personal information,
          consistent with applicable law.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-navy-900">Contact Us</h2>
        <p className="mt-2 text-sm">
          Questions about this policy can be directed to us through our{" "}
          <Link href="/contact" className="underline">
            contact page
          </Link>
          .
        </p>
      </section>
    </LegalPageLayout>
  );
}
