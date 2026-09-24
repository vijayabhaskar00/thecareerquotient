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
});
