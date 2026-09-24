import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LegalPageLayout } from "./LegalPageLayout";

describe("LegalPageLayout", () => {
  it("renders the title, last-updated date, counsel-review notice, and children", () => {
    render(
      <LegalPageLayout title="Privacy Policy" lastUpdated="Pending counsel review">
        <p>Body content</p>
      </LegalPageLayout>
    );
    expect(screen.getByRole("heading", { level: 1, name: "Privacy Policy" })).toBeInTheDocument();
    expect(screen.getByText(/Pending counsel review/)).toBeInTheDocument();
    expect(screen.getByRole("note")).toHaveTextContent(/not yet been reviewed by qualified legal counsel/);
    expect(screen.getByText("Body content")).toBeInTheDocument();
  });
});
