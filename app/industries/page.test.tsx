import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import IndustriesPage from "./page";
import { industries } from "../../content/industries/data";

describe("IndustriesPage", () => {
  it("renders every industry as a card", () => {
    render(<IndustriesPage />);
    for (const industry of industries) {
      expect(screen.getByRole("heading", { name: industry.name })).toBeInTheDocument();
    }
  });
});
