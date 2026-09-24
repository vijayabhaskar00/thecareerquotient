import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Counter } from "./Counter";

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

describe("Counter", () => {
  it("shows the final value immediately when reduced motion is preferred", () => {
    mockMatchMedia(true);
    render(<Counter value={250} suffix="+" />);
    expect(screen.getByText("250+")).toBeInTheDocument();
  });

  it("always exposes the final value via aria-label regardless of animation state", () => {
    mockMatchMedia(false);
    render(<Counter value={250} suffix="+" />);
    expect(screen.getByLabelText("250+")).toBeInTheDocument();
  });
});
