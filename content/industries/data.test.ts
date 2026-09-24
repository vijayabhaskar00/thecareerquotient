import { describe, it, expect } from "vitest";
import { industries } from "./data";
import { services } from "../services/data";

describe("industries data", () => {
  const serviceSlugs = new Set(services.map((s) => s.slug));

  it("has exactly 8 industries", () => {
    expect(industries).toHaveLength(8);
  });

  it("has unique slugs", () => {
    const slugs = industries.map((i) => i.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has complete, real content and valid service references", () => {
    for (const industry of industries) {
      expect(industry.name.length).toBeGreaterThan(0);
      expect(industry.intro.length).toBeGreaterThan(40);
      expect(industry.challenges.length).toBeGreaterThanOrEqual(2);
      expect(industry.roles.length).toBeGreaterThanOrEqual(3);
      expect(industry.faqs.length).toBeGreaterThanOrEqual(2);
      for (const svc of industry.services) {
        expect(serviceSlugs.has(svc)).toBe(true);
      }
      expect(industry.intro.toLowerCase()).not.toContain("lorem");
    }
  });
});
