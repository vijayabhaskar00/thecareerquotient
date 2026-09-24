import { describe, it, expect } from "vitest";
import { values } from "./values";

describe("values data", () => {
  it("has exactly 6 values", () => {
    expect(values).toHaveLength(6);
  });

  it("has non-empty, real descriptions", () => {
    for (const value of values) {
      expect(value.title.length).toBeGreaterThan(0);
      expect(value.description.length).toBeGreaterThan(20);
      expect(value.description.toLowerCase()).not.toContain("lorem");
    }
  });
});
