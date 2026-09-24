import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HireTalentPage from "./page";

describe("HireTalentPage", () => {
  it("renders the headline and the employer lead form", () => {
    render(<HireTalentPage />);
    expect(screen.getByRole("heading", { level: 1, name: /next great hire/i })).toBeInTheDocument();
    expect(screen.getByLabelText("Company")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Talk to a Talent Expert" })).toBeInTheDocument();
  });
});
