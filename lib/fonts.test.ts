import { describe, it, expect } from "vitest";
import { fontSans } from "./fonts";

describe("fontSans", () => {
  it("exposes a CSS variable class for next/font", () => {
    expect(fontSans.variable).toMatch(/^__variable_/);
  });
});
