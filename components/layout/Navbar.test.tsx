import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Navbar } from "./Navbar";

describe("Navbar", () => {
  it("renders the logo, primary nav links, and the Hire Talent CTA", () => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name: "TheCareerQuotient" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/contact");
    expect(screen.getAllByRole("link", { name: "Hire Talent" }).length).toBeGreaterThan(0);
  });
});
