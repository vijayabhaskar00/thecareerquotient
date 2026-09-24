import { describe, it, expect } from "vitest";
import { submitContactForm, submitEmployerLead, submitCandidateResume } from "./submitForm";

describe("submitForm stub handlers", () => {
  it("submitContactForm resolves with success", async () => {
    const result = await submitContactForm({
      name: "Jordan Lee",
      email: "jordan@example.com",
      audience: "employer",
      message: "We need to hire three engineers this quarter.",
    });
    expect(result).toEqual({ success: true });
  });

  it("submitEmployerLead resolves with success", async () => {
    const result = await submitEmployerLead({
      name: "Priya Nair",
      company: "Acme Robotics",
      workEmail: "priya@acmerobotics.com",
      phone: "5551234567",
      jobTitle: "VP Engineering",
      hiringNeed: "direct-hire",
      numberOfPositions: 3,
      location: "Austin, TX",
      employmentType: "full-time",
    });
    expect(result).toEqual({ success: true });
  });

  it("submitCandidateResume resolves with success", async () => {
    const file = new File(["content"], "resume.pdf", { type: "application/pdf" });
    const result = await submitCandidateResume(
      {
        name: "Sam Okafor",
        email: "sam@example.com",
        phone: "5559876543",
        preferredLocation: "Remote",
        employmentType: "contract",
      },
      file
    );
    expect(result).toEqual({ success: true });
  });
});
