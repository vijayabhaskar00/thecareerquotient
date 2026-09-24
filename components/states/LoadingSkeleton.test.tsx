import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadingSkeleton } from "./LoadingSkeleton";

describe("LoadingSkeleton", () => {
  it("announces loading state to assistive tech and renders the requested number of lines", () => {
    const { container } = render(<LoadingSkeleton lines={4} />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading");
    expect(container.querySelectorAll("[aria-hidden='true'] > div")).toHaveLength(4);
  });
});
