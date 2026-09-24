import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MobileNavbar } from "./MobileNavbar";

describe("MobileNavbar", () => {
  it("opens the menu panel when the hamburger button is clicked", async () => {
    render(<MobileNavbar />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(toggle);
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: "Hire Talent" })).toHaveAttribute("href", "/hire-talent");
  });
});
