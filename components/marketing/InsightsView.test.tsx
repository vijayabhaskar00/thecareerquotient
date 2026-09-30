import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { InsightsView } from "./InsightsView";
import type { ArticleSummary } from "./ArticleCard";

const articles: ArticleSummary[] = [
  { slug: "a", title: "Negotiate an offer", description: "d", category: "Career Advice", date: "2026-03-05", readingTime: "1 min read" },
  { slug: "b", title: "What hiring managers want", description: "d", category: "Hiring Trends", date: "2026-02-14", readingTime: "1 min read" },
  { slug: "c", title: "Write a resume", description: "d", category: "Resume Tips", date: "2026-01-10", readingTime: "1 min read" },
];
const categories = ["Career Advice", "Hiring Trends", "Resume Tips"];

describe("InsightsView", () => {
  it("renders every article and all filter pills without any client-side state", () => {
    render(<InsightsView articles={articles} categories={categories} />);
    for (const a of articles) expect(screen.getByRole("heading", { name: a.title })).toBeInTheDocument();
    for (const name of ["All", ...categories]) expect(screen.getByRole("link", { name })).toBeInTheDocument();
  });

  it("marks only the active pill as current and gives it a readable fill", () => {
    render(<InsightsView articles={articles} categories={categories} active="Hiring Trends" />);
    const active = screen.getByRole("link", { name: "Hiring Trends" });
    expect(active).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "All" })).not.toHaveAttribute("aria-current");
    // Regression: the active pill was white text on a white fill (invisible label).
    expect(active.className).toContain("bg-ink");
    expect(active.className).toContain("text-sage");
    expect(active.className).not.toMatch(/bg-(white|surface)/);
    expect(active.className).not.toContain("text-white");
  });

  it("filters to the selected category", () => {
    render(<InsightsView articles={articles} categories={categories} active="Resume Tips" />);
    expect(screen.getByRole("heading", { name: "Write a resume" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Negotiate an offer" })).not.toBeInTheDocument();
  });

  it("shows an empty state with a way back when a category has no articles", () => {
    render(<InsightsView articles={articles} categories={categories} active="Nope" />);
    expect(screen.getByText("No articles matched this category.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View all insights" })).toHaveAttribute("href", "/insights");
  });
});
