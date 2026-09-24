import type { MetadataRoute } from "next";
import { services } from "@/content/services/data";
import { industries } from "@/content/industries/data";
import { getAllArticles } from "@/lib/content/insights";
import { SITE_URL } from "@/lib/seo/metadata";

export const dynamic = "force-static";

const STATIC_PATHS = [
  "/",
  "/services",
  "/industries",
  "/about",
  "/insights",
  "/hire-talent",
  "/find-jobs",
  "/contact",
  "/privacy",
  "/terms",
  "/cookie-policy",
  "/accessibility",
  "/candidate-privacy",
  "/employer-terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = STATIC_PATHS.map((path) => ({ url: `${SITE_URL}${path}`, lastModified: new Date() }));
  const serviceEntries = services.map((s) => ({ url: `${SITE_URL}/services/${s.slug}`, lastModified: new Date() }));
  const industryEntries = industries.map((i) => ({
    url: `${SITE_URL}/industries/${i.slug}`,
    lastModified: new Date(),
  }));
  const articleEntries = getAllArticles().map((a) => ({
    url: `${SITE_URL}/insights/${a.slug}`,
    lastModified: new Date(a.date),
  }));

  return [...staticEntries, ...serviceEntries, ...industryEntries, ...articleEntries];
}
