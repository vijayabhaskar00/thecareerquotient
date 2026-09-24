import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "./ContactForm";
import * as submitFormModule from "../../lib/forms/submitForm";

vi.mock("../../lib/forms/submitForm", () => ({
  submitContactForm: vi.fn(),
}));

describe("ContactForm", () => {
  beforeEach(() => {
    vi.mocked(submitFormModule.submitContactForm).mockReset();
  });

  it("shows validation errors when required fields are missing and does not submit", async () => {
    render(<ContactForm />);
    await userEvent.click(screen.getByRole("button", { name: "Send Message" }));
    expect(await screen.findAllByRole("alert")).not.toHaveLength(0);
    expect(submitFormModule.submitContactForm).not.toHaveBeenCalled();
  });

  it("shows a success message after a valid submission succeeds", async () => {
    vi.mocked(submitFormModule.submitContactForm).mockResolvedValue({ success: true });
    render(<ContactForm />);
    await userEvent.type(screen.getByLabelText("Full name"), "Jordan Lee");
    await userEvent.type(screen.getByLabelText("Email"), "jordan@example.com");
    await userEvent.click(screen.getByLabelText("Employer"));
    await userEvent.type(screen.getByLabelText("Message"), "We need to hire three engineers this quarter.");
    await userEvent.click(screen.getByRole("button", { name: "Send Message" }));
    expect(await screen.findByRole("status")).toHaveTextContent(/received your message/);
  });

  it("shows an error state when submission fails (Review Focus #1)", async () => {
    vi.mocked(submitFormModule.submitContactForm).mockResolvedValue({ success: false, error: "network error" });
    render(<ContactForm />);
    await userEvent.type(screen.getByLabelText("Full name"), "Jordan Lee");
    await userEvent.type(screen.getByLabelText("Email"), "jordan@example.com");
    await userEvent.click(screen.getByLabelText("Employer"));
    await userEvent.type(screen.getByLabelText("Message"), "We need to hire three engineers this quarter.");
    await userEvent.click(screen.getByRole("button", { name: "Send Message" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/couldn't send/i);
  });
});
