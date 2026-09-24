import { describe, it, expect } from "vitest";
import {
  contactFormSchema,
  employerFormSchema,
  candidateFormSchema,
  validateResumeFile,
  MAX_RESUME_SIZE_BYTES,
} from "./formSchemas";

describe("contactFormSchema", () => {
  it("accepts a valid contact submission", () => {
    const result = contactFormSchema.safeParse({
      name: "Jordan Lee",
      email: "jordan@example.com",
      audience: "employer",
      message: "We need to hire three engineers this quarter.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = contactFormSchema.safeParse({
      name: "Jordan Lee",
      email: "not-an-email",
      audience: "employer",
      message: "We need to hire three engineers this quarter.",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a message that is too short", () => {
    const result = contactFormSchema.safeParse({
      name: "Jordan Lee",
      email: "jordan@example.com",
      audience: "candidate",
      message: "Hi",
    });
    expect(result.success).toBe(false);
  });
});

describe("employerFormSchema", () => {
  it("accepts a valid employer lead submission", () => {
    const result = employerFormSchema.safeParse({
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
    expect(result.success).toBe(true);
  });

  it("rejects fewer than 1 position", () => {
    const result = employerFormSchema.safeParse({
      name: "Priya Nair",
      company: "Acme Robotics",
      workEmail: "priya@acmerobotics.com",
      phone: "5551234567",
      jobTitle: "VP Engineering",
      hiringNeed: "direct-hire",
      numberOfPositions: 0,
      location: "Austin, TX",
      employmentType: "full-time",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown hiring need", () => {
    const result = employerFormSchema.safeParse({
      name: "Priya Nair",
      company: "Acme Robotics",
      workEmail: "priya@acmerobotics.com",
      phone: "5551234567",
      jobTitle: "VP Engineering",
      hiringNeed: "not-a-real-service",
      numberOfPositions: 3,
      location: "Austin, TX",
      employmentType: "full-time",
    });
    expect(result.success).toBe(false);
  });
});

describe("candidateFormSchema", () => {
  it("accepts a valid candidate submission", () => {
    const result = candidateFormSchema.safeParse({
      name: "Sam Okafor",
      email: "sam@example.com",
      phone: "5559876543",
      preferredLocation: "Remote",
      employmentType: "contract",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing preferred location", () => {
    const result = candidateFormSchema.safeParse({
      name: "Sam Okafor",
      email: "sam@example.com",
      phone: "5559876543",
      preferredLocation: "",
      employmentType: "contract",
    });
    expect(result.success).toBe(false);
  });
});

describe("validateResumeFile", () => {
  it("accepts a PDF under the size limit", () => {
    const file = new File(["content"], "resume.pdf", { type: "application/pdf" });
    expect(validateResumeFile(file)).toBeNull();
  });

  it("rejects an unsupported file type", () => {
    const file = new File(["content"], "resume.png", { type: "image/png" });
    expect(validateResumeFile(file)).toBe("Upload a PDF or Word document.");
  });

  it("rejects a file over the size limit", () => {
    const oversized = new File([new Uint8Array(MAX_RESUME_SIZE_BYTES + 1)], "resume.pdf", {
      type: "application/pdf",
    });
    expect(validateResumeFile(oversized)).toBe("File must be smaller than 5MB.");
  });
});
