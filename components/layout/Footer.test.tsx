import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("renders solutions, candidates, employers, company, and legal links pointing to real routes", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Direct Hire" })).toHaveAttribute("href", "/services/direct-hire");
    expect(screen.getByRole("link", { name: "Find Jobs" })).toHaveAttribute("href", "/find-jobs");
    expect(screen.getByRole("link", { name: "Hire Talent" })).toHaveAttribute("href", "/hire-talent");
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
    expect(screen.getByText(new RegExp(`${new Date().getFullYear()}`))).toBeInTheDocument();
  });

  it("contains no placeholder # links", () => {
    render(<Footer />);
    for (const link of screen.getAllByRole("link")) {
      expect(link.getAttribute("href")).not.toBe("#");
    }
  });
});
