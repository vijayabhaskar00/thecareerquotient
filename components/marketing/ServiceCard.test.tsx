import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ServiceCard } from "./ServiceCard";
import { services } from "../../content/services/data";

describe("ServiceCard", () => {
  it("renders the service name, tagline, and a link to its detail page", () => {
    const service = services[0];
    render(<ServiceCard service={service} />);
    expect(screen.getByRole("heading", { name: service.name })).toBeInTheDocument();
    expect(screen.getByText(service.tagline)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: new RegExp(service.ctaLabel) })).toHaveAttribute(
      "href",
      `/services/${service.slug}`
    );
  });
});
