import type { ContactFormValues, EmployerFormValues, CandidateFormValues } from "@/lib/validation/formSchemas";

export interface SubmitResult {
  success: boolean;
  error?: string;
}

async function deliver<T>(_payload: T): Promise<SubmitResult> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return { success: true };
}

export async function submitContactForm(values: ContactFormValues): Promise<SubmitResult> {
  return deliver(values);
}

export async function submitEmployerLead(values: EmployerFormValues): Promise<SubmitResult> {
  return deliver(values);
}

export async function submitCandidateResume(
  values: CandidateFormValues,
  resume: File
): Promise<SubmitResult> {
  return deliver({ ...values, resumeName: resume.name, resumeSize: resume.size });
}
