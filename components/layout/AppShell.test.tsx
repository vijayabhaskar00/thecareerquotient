import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppShell } from "./AppShell";

describe("AppShell", () => {
  it("renders the skip link, Navbar landmark, a labeled main region, and Footer landmark", () => {
    render(
      <AppShell>
        <p>Page content</p>
      </AppShell>
    );
    expect(screen.getByRole("link", { name: "Skip to main content" })).toHaveAttribute("href", "#main-content");
    expect(screen.getByRole("banner")).toBeInTheDocument();
    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "main-content");
    expect(main).toHaveTextContent("Page content");
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
