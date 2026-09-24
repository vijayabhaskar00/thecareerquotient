import type { Metadata } from "next";
import type { ReactNode } from "react";
import { fontSans } from "@/lib/fonts";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonld";
import { SITE_NAME, SITE_URL } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description:
    "TheCareerQuotient connects ambitious organizations with exceptional professionals through flexible staffing, permanent hiring, executive search, and workforce solutions.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontSans.variable}>
      <body>
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
