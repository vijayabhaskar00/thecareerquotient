import { describe, it, expect } from "vitest";
import { organizationJsonLd, websiteJsonLd, breadcrumbJsonLd, articleJsonLd, faqPageJsonLd } from "./jsonld";

describe("jsonld builders", () => {
  it("builds Organization and WebSite schema", () => {
    expect(organizationJsonLd()["@type"]).toBe("Organization");
    expect(websiteJsonLd()["@type"]).toBe("WebSite");
  });

  it("builds a BreadcrumbList with 1-indexed positions", () => {
    const result = breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
    ]);
    expect(result.itemListElement).toHaveLength(2);
    expect(result.itemListElement[0].position).toBe(1);
    expect(result.itemListElement[1].item).toBe("https://thecareerquotient.com/services");
  });

  it("builds Article schema", () => {
    const result = articleJsonLd({
      title: "Resume Tips That Work",
      description: "Practical advice.",
      path: "/insights/resume-tips-that-work",
      datePublished: "2026-01-10",
      author: "TheCareerQuotient Editorial Team",
    });
    expect(result["@type"]).toBe("Article");
    expect(result.headline).toBe("Resume Tips That Work");
  });

  it("builds FAQPage schema with nested Question/Answer entities", () => {
    const result = faqPageJsonLd([{ question: "Do you support remote roles?", answer: "Yes." }]);
    expect(result.mainEntity[0]["@type"]).toBe("Question");
    expect(result.mainEntity[0].acceptedAnswer.text).toBe("Yes.");
  });
});
