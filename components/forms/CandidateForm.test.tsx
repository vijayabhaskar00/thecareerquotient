import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CandidateForm } from "./CandidateForm";
import * as submitFormModule from "../../lib/forms/submitForm";
import { MAX_RESUME_SIZE_BYTES } from "../../lib/validation/formSchemas";

vi.mock("../../lib/forms/submitForm", () => ({
  submitCandidateResume: vi.fn(),
}));

async function fillCandidateFields(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Full name"), "Sam Okafor");
  await user.type(screen.getByLabelText("Email"), "sam@example.com");
  await user.type(screen.getByLabelText("Phone"), "5559876543");
  await user.type(screen.getByLabelText("Preferred location"), "Remote");
  await user.click(screen.getByRole("combobox", { name: "Employment type" }));
  await user.click(await screen.findByRole("option", { name: "contract" }));
}

describe("CandidateForm", () => {
  beforeEach(() => {
    vi.mocked(submitFormModule.submitCandidateResume).mockReset();
  });

  it("rejects an unsupported resume file type (Review Focus #2)", async () => {
    render(<CandidateForm />);
    const file = new File(["content"], "resume.png", { type: "image/png" });
    const input = screen.getByLabelText(/Resume/) as HTMLInputElement;
    // userEvent.upload silently filters files against the input's `accept`
    // attribute, so it can't simulate a mismatched file reaching the change
    // handler. fireEvent bypasses that, exercising the real client-side
    // validateResumeFile() check the same way a renamed/bypassed file would.
    fireEvent.change(input, { target: { files: [file] } });
    expect(await screen.findByRole("alert")).toHaveTextContent("Upload a PDF or Word document.");
  });

  it("rejects a resume file over the size limit (Review Focus #2)", async () => {
    const user = userEvent.setup();
    render(<CandidateForm />);
    const oversized = new File([new Uint8Array(MAX_RESUME_SIZE_BYTES + 1)], "resume.pdf", {
      type: "application/pdf",
    });
    await user.upload(screen.getByLabelText(/Resume/), oversized);
    expect(await screen.findByRole("alert")).toHaveTextContent("File must be smaller than 5MB.");
  });

  it("blocks submission when no resume has been attached, even with valid fields", async () => {
    const user = userEvent.setup();
    render(<CandidateForm />);
    await fillCandidateFields(user);
    await user.click(screen.getByRole("button", { name: "Submit Your Resume" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Upload your resume to continue.");
    expect(submitFormModule.submitCandidateResume).not.toHaveBeenCalled();
  });

  it("submits and shows a success message with a valid resume and fields", async () => {
    vi.mocked(submitFormModule.submitCandidateResume).mockResolvedValue({ success: true });
    const user = userEvent.setup();
    render(<CandidateForm />);
    await fillCandidateFields(user);
    const file = new File(["content"], "resume.pdf", { type: "application/pdf" });
    await user.upload(screen.getByLabelText(/Resume/), file);
    await user.click(screen.getByRole("button", { name: "Submit Your Resume" }));
    expect(await screen.findByRole("status")).toHaveTextContent(/resume was received/);
  });

  it("shows an error state when submission fails (Review Focus #1)", async () => {
    vi.mocked(submitFormModule.submitCandidateResume).mockResolvedValue({ success: false });
    const user = userEvent.setup();
    render(<CandidateForm />);
    await fillCandidateFields(user);
    const file = new File(["content"], "resume.pdf", { type: "application/pdf" });
    await user.upload(screen.getByLabelText(/Resume/), file);
    await user.click(screen.getByRole("button", { name: "Submit Your Resume" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/couldn't submit your resume/i);
  });
});
