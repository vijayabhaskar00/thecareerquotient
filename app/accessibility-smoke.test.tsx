import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import HomePage from "./page";
import ServiceDetailPage from "./services/[slug]/page";

expect.extend(toHaveNoViolations);

describe("accessibility smoke test", () => {
  it("the homepage has no automatically detectable accessibility violations", async () => {
    const { container } = render(<HomePage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("a service detail page has no automatically detectable accessibility violations", async () => {
    const jsx = await ServiceDetailPage({ params: Promise.resolve({ slug: "direct-hire" }) });
    const { container } = render(jsx);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
