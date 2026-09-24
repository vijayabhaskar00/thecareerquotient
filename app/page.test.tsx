import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "./page";
import { services } from "../content/services/data";
import { getAllArticles } from "../lib/content/insights";

describe("HomePage", () => {
  it("renders the hero, all 7 services, both process timelines, and every primary CTA", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { level: 1, name: /Smarter Talent/ })).toBeInTheDocument();

    for (const service of services) {
      expect(screen.getByRole("heading", { name: service.name })).toBeInTheDocument();
    }

    expect(screen.getByRole("heading", { name: "How It Works for Employers" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "How It Works for Candidates" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View all industries ->" })).toHaveAttribute("href", "/industries");

    const latest = getAllArticles().slice(0, 3);
    for (const article of latest) {
      expect(screen.getByRole("heading", { name: article.title })).toBeInTheDocument();
    }
  });
});
