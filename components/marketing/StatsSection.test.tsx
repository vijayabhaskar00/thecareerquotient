import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatsSection } from "./StatsSection";

describe("StatsSection", () => {
  it("renders a neutral trust statement when no verified stats are supplied", () => {
    render(<StatsSection stats={[]} />);
    expect(screen.getByText("Trusted by growing teams and ambitious professionals.")).toBeInTheDocument();
  });

  it("renders each verified stat's value and label when stats are supplied", () => {
    render(<StatsSection stats={[{ value: 12, suffix: " industries", label: "Industries served" }]} />);
    expect(screen.getByLabelText("12 industries")).toBeInTheDocument();
    expect(screen.getByText("Industries served")).toBeInTheDocument();
  });
});
