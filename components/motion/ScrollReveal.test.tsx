import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScrollReveal } from "./ScrollReveal";

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ScrollReveal", () => {
  it("renders children in a plain div with no animation when reduced motion is preferred", () => {
    mockMatchMedia(true);
    render(
      <ScrollReveal className="test-class">
        <p>Reveal me</p>
      </ScrollReveal>
    );
    const content = screen.getByText("Reveal me");
    expect(content).toBeInTheDocument();
    expect(content.parentElement).toHaveClass("test-class");
    expect(content.parentElement?.tagName).toBe("DIV");
  });

  it("renders children when motion is allowed", () => {
    mockMatchMedia(false);
    render(
      <ScrollReveal>
        <p>Reveal me too</p>
      </ScrollReveal>
    );
    expect(screen.getByText("Reveal me too")).toBeInTheDocument();
  });
});
