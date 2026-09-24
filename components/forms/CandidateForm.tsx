"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  candidateFormSchema,
  type CandidateFormValues,
  EMPLOYMENT_TYPES,
  validateResumeFile,
} from "@/lib/validation/formSchemas";
import { submitCandidateResume } from "@/lib/forms/submitForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ErrorState } from "@/components/states/ErrorState";

export function CandidateForm() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateFormSchema),
    defaultValues: { employmentType: "" as never },
  });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);

  function handleResumeChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setResumeFile(null);
      setResumeError(null);
      return;
    }
    const error = validateResumeFile(file);
    if (error) {
      setResumeError(error);
      setResumeFile(null);
      event.target.value = "";
      return;
    }
    setResumeError(null);
    setResumeFile(file);
  }

  async function onSubmit(values: CandidateFormValues) {
    if (!resumeFile) {
      setResumeError("Upload your resume to continue.");
      return;
    }
    const result = await submitCandidateResume(values, resumeFile);
    if (result.success) {
      setStatus("success");
      reset();
      setResumeFile(null);
    } else {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-xl border border-green-200 bg-green-50 p-6 text-green-900">
        Thanks - your resume was received. A recruiter will follow up if there&apos;s a fit.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      {status === "error" && (
        <ErrorState
          description="We couldn't submit your resume. Please try again."
          onRetry={() => setStatus("idle")}
        />
      )}

      <div>
        <Label htmlFor="candidate-name">Full name</Label>
        <Input id="candidate-name" {...register("name")} />
        {errors.name && (
          <p role="alert" className="mt-1 text-sm text-red-700">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="candidate-email">Email</Label>
        <Input id="candidate-email" type="email" {...register("email")} />
        {errors.email && (
          <p role="alert" className="mt-1 text-sm text-red-700">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="candidate-phone">Phone</Label>
        <Input id="candidate-phone" type="tel" {...register("phone")} />
        {errors.phone && (
          <p role="alert" className="mt-1 text-sm text-red-700">
            {errors.phone.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="candidate-location">Preferred location</Label>
        <Input id="candidate-location" {...register("preferredLocation")} />
        {errors.preferredLocation && (
          <p role="alert" className="mt-1 text-sm text-red-700">
            {errors.preferredLocation.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="candidate-employment-type">Employment type</Label>
        <Controller
          control={control}
          name="employmentType"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="candidate-employment-type">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                {EMPLOYMENT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace(/-/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.employmentType && (
          <p role="alert" className="mt-1 text-sm text-red-700">
            Select an employment type.
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="candidate-resume">Resume (PDF or Word, up to 5MB)</Label>
        <input
          id="candidate-resume"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleResumeChange}
          className="mt-1 block w-full text-sm"
        />
        {resumeError && (
          <p role="alert" className="mt-1 text-sm text-red-700">
            {resumeError}
          </p>
        )}
        {resumeFile && !resumeError && <p className="mt-1 text-sm text-navy-700">Selected: {resumeFile.name}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="min-h-11">
        {isSubmitting ? "Submitting..." : "Submit Your Resume"}
      </Button>
    </form>
  );
}
