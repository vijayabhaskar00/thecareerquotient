import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CTASection } from "./CTASection";

describe("CTASection", () => {
  it("renders the heading, description, and CTA link", () => {
    render(
      <CTASection
        heading="Ready to build your team?"
        description="Talk to a talent expert today."
        ctaLabel="Talk to Sales"
        ctaHref="/contact"
      />
    );
    expect(screen.getByRole("heading", { name: "Ready to build your team?" })).toBeInTheDocument();
    expect(screen.getByText("Talk to a talent expert today.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Talk to Sales" })).toHaveAttribute("href", "/contact");
  });
});
