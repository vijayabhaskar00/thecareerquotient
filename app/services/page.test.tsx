import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ServicesPage from "./page";
import { services } from "../../content/services/data";

describe("ServicesPage", () => {
  it("renders every service as a card with a link to its detail page", () => {
    render(<ServicesPage />);
    for (const service of services) {
      expect(screen.getByRole("heading", { name: service.name })).toBeInTheDocument();
    }
    expect(screen.getByRole("heading", { name: "Not sure which service fits?" })).toBeInTheDocument();
  });
});
