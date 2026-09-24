import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FindJobsPage from "./page";

describe("FindJobsPage", () => {
  it("renders the headline, career resources link, and the candidate resume form", () => {
    render(<FindJobsPage />);
    expect(screen.getByRole("heading", { level: 1, name: /next opportunity starts here/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "career resources" })).toHaveAttribute("href", "/insights");
    expect(screen.getByLabelText(/Resume/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit Your Resume" })).toBeInTheDocument();
  });
});
