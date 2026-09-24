import { describe, it, expect } from "vitest";
import { team } from "./team";

describe("team data", () => {
  it("is a typed array, currently empty pending real leadership data", () => {
    expect(Array.isArray(team)).toBe(true);
    expect(team).toHaveLength(0);
  });
});
