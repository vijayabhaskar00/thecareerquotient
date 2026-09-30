import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("renders the headline and both employer/candidate CTAs, with no job search input", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1, name: /Smarter Talent/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Hire Talent" })).toHaveAttribute("href", "/hire-talent");
    expect(screen.getByRole("link", { name: "Find Jobs" })).toHaveAttribute("href", "/find-jobs");
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("keeps the animated headline as one readable sentence", () => {
    render(<Hero />);
    const h1 = screen.getByRole("heading", { level: 1 });
    // Split into animated word/dot spans, but the text must stay intact for screen readers and crawlers.
    expect(h1).toHaveTextContent(/^Smarter Talent\. Stronger Teams\. Better Careers\.$/);
    expect(h1.textContent).toBe("Smarter Talent. Stronger Teams. Better Careers.");
  });
});
