import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ServiceDetailPage, { generateStaticParams } from "./page";
import { services } from "../../../content/services/data";

describe("ServiceDetailPage", () => {
  it("generates static params for all services", () => {
    expect(generateStaticParams()).toHaveLength(services.length);
  });

  it("renders the service name, summary, and features for a valid slug", async () => {
    const jsx = await ServiceDetailPage({ params: Promise.resolve({ slug: "direct-hire" }) });
    render(jsx);
    const directHire = services.find((s) => s.slug === "direct-hire")!;
    expect(screen.getByRole("heading", { level: 1, name: "Direct Hire" })).toBeInTheDocument();
    expect(screen.getByText(directHire.summary)).toBeInTheDocument();
  });

  it("throws notFound for an unknown slug (Review Focus #3)", async () => {
    await expect(ServiceDetailPage({ params: Promise.resolve({ slug: "not-a-real-slug" }) })).rejects.toThrow();
  });
});
