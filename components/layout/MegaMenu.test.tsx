import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MegaMenu } from "./MegaMenu";

const items = [
  { slug: "a", name: "Service A", tagline: "Tagline A" },
  { slug: "b", name: "Service B", tagline: "Tagline B" },
];

describe("MegaMenu", () => {
  it("is closed by default and opens on trigger click", async () => {
    render(<MegaMenu label="Solutions" basePath="/services" overviewHref="/services" items={items} />);
    expect(screen.queryByRole("menuitem", { name: "Service A" })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Solutions" }));
    expect(screen.getByRole("menuitem", { name: "Service A" })).toHaveAttribute("href", "/services/a");
    expect(screen.getByRole("menuitem", { name: "Service B" })).toHaveAttribute("href", "/services/b");
  });

  it("closes when Escape is pressed", async () => {
    render(<MegaMenu label="Solutions" basePath="/services" overviewHref="/services" items={items} />);
    await userEvent.click(screen.getByRole("button", { name: "Solutions" }));
    expect(screen.getByRole("menuitem", { name: "Service A" })).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("menuitem", { name: "Service A" })).not.toBeInTheDocument();
  });
});
