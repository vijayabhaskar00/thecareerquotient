import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CookieBanner } from "./CookieBanner";

describe("CookieBanner", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows the banner when no consent decision has been made", () => {
    render(<CookieBanner />);
    expect(screen.getByRole("region", { name: "Cookie notice" })).toBeInTheDocument();
  });

  it("hides the banner and stores the decision when Accept is clicked", async () => {
    render(<CookieBanner />);
    await userEvent.click(screen.getByRole("button", { name: "Accept" }));
    expect(screen.queryByRole("region", { name: "Cookie notice" })).not.toBeInTheDocument();
    expect(window.localStorage.getItem("tcq_cookie_consent")).toBe("accepted");
  });

  it("does not show the banner again after a decision was already stored", () => {
    window.localStorage.setItem("tcq_cookie_consent", "declined");
    render(<CookieBanner />);
    expect(screen.queryByRole("region", { name: "Cookie notice" })).not.toBeInTheDocument();
  });
});
