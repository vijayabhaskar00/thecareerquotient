import { describe, it, expect } from "vitest";

describe("scaffold smoke test", () => {
  it("runs under vitest with jsdom", () => {
    expect(typeof window).toBe("object");
    expect(window.matchMedia("(prefers-reduced-motion: reduce)").matches).toBe(false);
  });
});
