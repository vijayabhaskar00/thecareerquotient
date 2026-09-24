import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ContactPage from "./page";

describe("ContactPage", () => {
  it("renders the headline and the contact form", () => {
    render(<ContactPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Let's Talk." })).toBeInTheDocument();
    expect(screen.getByLabelText("Full name")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send Message" })).toBeInTheDocument();
  });
});
