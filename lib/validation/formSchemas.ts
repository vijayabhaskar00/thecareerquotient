import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name."),
  email: z.string().trim().email("Enter a valid email address."),
  audience: z.enum(["employer", "candidate"]),
  message: z.string().trim().min(10, "Message must be at least 10 characters."),
});
export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const HIRING_NEEDS = [
  "contingent-staffing",
  "contract-to-hire",
  "direct-hire",
  "executive-search",
  "employer-of-record",
  "statement-of-work",
  "high-volume-hiring",
] as const;

export const EMPLOYMENT_TYPES = ["full-time", "contract", "contract-to-hire", "part-time", "temporary"] as const;

export const employerFormSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name."),
  company: z.string().trim().min(2, "Enter your company name."),
  workEmail: z.string().trim().email("Enter a valid work email address."),
  phone: z.string().trim().min(7, "Enter a valid phone number."),
  jobTitle: z.string().trim().min(2, "Enter your job title."),
  hiringNeed: z.enum(HIRING_NEEDS),
  numberOfPositions: z.number().int().min(1, "Enter at least 1 position."),
  location: z.string().trim().min(2, "Enter a location."),
  employmentType: z.enum(EMPLOYMENT_TYPES),
  message: z.string().trim().optional(),
});
export type EmployerFormValues = z.infer<typeof employerFormSchema>;

export const candidateFormSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim().min(7, "Enter a valid phone number."),
  preferredLocation: z.string().trim().min(2, "Enter a preferred location."),
  employmentType: z.enum(EMPLOYMENT_TYPES),
});
export type CandidateFormValues = z.infer<typeof candidateFormSchema>;

export const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export function validateResumeFile(file: File): string | null {
  if (!ACCEPTED_RESUME_TYPES.includes(file.type)) {
    return "Upload a PDF or Word document.";
  }
  if (file.size > MAX_RESUME_SIZE_BYTES) {
    return "File must be smaller than 5MB.";
  }
  return null;
}
