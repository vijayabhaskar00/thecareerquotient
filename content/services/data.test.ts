import { describe, it, expect } from "vitest";
import { services } from "./data";

describe("services data", () => {
  it("has exactly 7 services", () => {
    expect(services).toHaveLength(7);
  });

  it("has unique slugs", () => {
    const slugs = services.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has complete, real content for every service", () => {
    for (const service of services) {
      expect(service.name.length).toBeGreaterThan(0);
      expect(service.tagline.length).toBeGreaterThan(0);
      expect(service.summary.length).toBeGreaterThan(40);
      expect(service.features.length).toBeGreaterThanOrEqual(3);
      expect(service.ctaLabel.length).toBeGreaterThan(0);
      expect(service.summary.toLowerCase()).not.toContain("lorem");
    }
  });
});
