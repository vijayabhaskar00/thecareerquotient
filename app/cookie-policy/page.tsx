import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/marketing/LegalPageLayout";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Cookie Policy",
  description: "How TheCareerQuotient uses cookies on this site.",
  path: "/cookie-policy",
});

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout title="Cookie Policy" lastUpdated="Pending counsel review">
      <section>
        <h2 className="text-lg font-semibold text-navy-900">What Cookies Are</h2>
        <p className="mt-2 text-sm">This section will explain what cookies are in plain language.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-navy-900">How We Use Cookies</h2>
        <p className="mt-2 text-sm">This section will describe the categories of cookies used on this site.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-navy-900">Managing Your Preferences</h2>
        <p className="mt-2 text-sm">This section will describe how to manage or withdraw cookie consent.</p>
      </section>
    </LegalPageLayout>
  );
}
