import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmployerForm } from "./EmployerForm";
import * as submitFormModule from "../../lib/forms/submitForm";

vi.mock("../../lib/forms/submitForm", () => ({
  submitEmployerLead: vi.fn(),
}));

async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Full name"), "Priya Nair");
  await user.type(screen.getByLabelText("Company"), "Acme Robotics");
  await user.type(screen.getByLabelText("Work email"), "priya@acmerobotics.com");
  await user.type(screen.getByLabelText("Phone"), "5551234567");
  await user.type(screen.getByLabelText("Job title"), "VP Engineering");
  await user.click(screen.getByRole("combobox", { name: "Hiring need" }));
  await user.click(await screen.findByRole("option", { name: "Direct Hire" }));
  await user.clear(screen.getByLabelText("Number of positions"));
  await user.type(screen.getByLabelText("Number of positions"), "3");
  await user.type(screen.getByLabelText("Location"), "Austin, TX");
  await user.click(screen.getByRole("combobox", { name: "Employment type" }));
  await user.click(await screen.findByRole("option", { name: "full time" }));
}

describe("EmployerForm", () => {
  beforeEach(() => {
    vi.mocked(submitFormModule.submitEmployerLead).mockReset();
  });

  it("shows validation errors when required fields are missing and does not submit", async () => {
    const user = userEvent.setup();
    render(<EmployerForm />);
    await user.click(screen.getByRole("button", { name: "Talk to a Talent Expert" }));
    expect(await screen.findAllByRole("alert")).not.toHaveLength(0);
    expect(submitFormModule.submitEmployerLead).not.toHaveBeenCalled();
  });

  it("submits and shows a success message when all fields are valid", async () => {
    vi.mocked(submitFormModule.submitEmployerLead).mockResolvedValue({ success: true });
    const user = userEvent.setup();
    render(<EmployerForm />);
    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: "Talk to a Talent Expert" }));
    expect(await screen.findByRole("status")).toHaveTextContent(/talent expert will reach out/);
  });

  it("shows an error state when submission fails (Review Focus #1)", async () => {
    vi.mocked(submitFormModule.submitEmployerLead).mockResolvedValue({ success: false });
    const user = userEvent.setup();
    render(<EmployerForm />);
    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: "Talk to a Talent Expert" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/couldn't submit/i);
  });
});
