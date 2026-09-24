import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AboutPage from "./page";
import { values } from "../../content/values";

describe("AboutPage", () => {
  it("renders the headline, mission copy, all 6 values, and a non-fabricated leadership placeholder", () => {
    render(<AboutPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Talent Is Personal." })).toBeInTheDocument();
    for (const value of values) {
      expect(screen.getByRole("heading", { name: value.title })).toBeInTheDocument();
    }
    expect(screen.getByRole("heading", { name: "Leadership profiles coming soon." })).toBeInTheDocument();
  });
});
