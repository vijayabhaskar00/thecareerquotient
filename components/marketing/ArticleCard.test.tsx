import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArticleCard } from "./ArticleCard";

describe("ArticleCard", () => {
  it("renders the article title as a link, category, and reading time", () => {
    render(
      <ArticleCard
        article={{
          slug: "resume-tips-that-work",
          title: "Resume Tips That Work",
          description: "Practical advice for a stronger resume.",
          category: "Resume Tips",
          date: "2026-01-10",
          readingTime: "5 min read",
        }}
      />
    );
    expect(screen.getByRole("link", { name: "Resume Tips That Work" })).toHaveAttribute(
      "href",
      "/insights/resume-tips-that-work"
    );
    expect(screen.getByText("Resume Tips")).toBeInTheDocument();
    expect(screen.getByText(/5 min read/)).toBeInTheDocument();
  });
});
