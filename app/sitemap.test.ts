import { describe, it, expect } from "vitest";
import sitemap from "./sitemap";
import { services } from "../content/services/data";
import { industries } from "../content/industries/data";
import { getAllArticles } from "../lib/content/insights";
import { SITE_URL } from "../lib/seo/metadata";

describe("sitemap", () => {
  it("includes the homepage and every service, industry, and article URL", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain(`${SITE_URL}/`);
    for (const service of services) {
      expect(urls).toContain(`${SITE_URL}/services/${service.slug}`);
    }
    for (const industry of industries) {
      expect(urls).toContain(`${SITE_URL}/industries/${industry.slug}`);
    }
    for (const article of getAllArticles()) {
      expect(urls).toContain(`${SITE_URL}/insights/${article.slug}`);
    }
  });
});
