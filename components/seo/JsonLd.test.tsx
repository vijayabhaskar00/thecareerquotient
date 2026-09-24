import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { JsonLd } from "./JsonLd";

describe("JsonLd", () => {
  it("renders a script tag containing the serialized data", () => {
    const { container } = render(<JsonLd data={{ "@type": "Organization", name: "TheCareerQuotient" }} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    expect(JSON.parse(script?.textContent ?? "{}")).toEqual({ "@type": "Organization", name: "TheCareerQuotient" });
  });
});
