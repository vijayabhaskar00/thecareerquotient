import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { IndustryCard } from "./IndustryCard";
import { industries } from "../../content/industries/data";

describe("IndustryCard", () => {
  it("renders the industry name, intro, and a link to its detail page", () => {
    const industry = industries[0];
    render(<IndustryCard industry={industry} />);
    expect(screen.getByRole("heading", { name: industry.name })).toBeInTheDocument();
    expect(screen.getByText(industry.intro)).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", `/industries/${industry.slug}`);
  });
});
