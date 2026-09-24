import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders heading, description, and an optional action", () => {
    render(
      <EmptyState
        heading="No articles matched your filter."
        description="Try a different category."
        action={<a href="/insights">View all insights</a>}
      />
    );
    expect(screen.getByRole("heading", { name: "No articles matched your filter." })).toBeInTheDocument();
    expect(screen.getByText("Try a different category.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View all insights" })).toBeInTheDocument();
  });
});
