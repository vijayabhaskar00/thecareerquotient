import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import IndustryDetailPage, { generateStaticParams } from "./page";
import { industries } from "../../../content/industries/data";

describe("IndustryDetailPage", () => {
  it("generates static params for all industries", () => {
    expect(generateStaticParams()).toHaveLength(industries.length);
  });

  it("renders the industry name, intro, roles, and FAQ for a valid slug", async () => {
    const jsx = await IndustryDetailPage({ params: Promise.resolve({ slug: "technology" }) });
    render(jsx);
    const technology = industries.find((i) => i.slug === "technology")!;
    expect(screen.getByRole("heading", { level: 1, name: "Technology" })).toBeInTheDocument();
    expect(screen.getByText(technology.intro)).toBeInTheDocument();
    expect(screen.getByText(technology.roles[0])).toBeInTheDocument();
    expect(screen.getByRole("button", { name: technology.faqs[0].question })).toBeInTheDocument();
  });

  it("throws notFound for an unknown slug (Review Focus #3)", async () => {
    await expect(IndustryDetailPage({ params: Promise.resolve({ slug: "not-a-real-slug" }) })).rejects.toThrow();
  });
});
