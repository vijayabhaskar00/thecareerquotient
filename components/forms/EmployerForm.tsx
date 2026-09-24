"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  employerFormSchema,
  type EmployerFormValues,
  HIRING_NEEDS,
  EMPLOYMENT_TYPES,
} from "@/lib/validation/formSchemas";
import { submitEmployerLead } from "@/lib/forms/submitForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ErrorState } from "@/components/states/ErrorState";
import { services } from "@/content/services/data";

const HIRING_NEED_LABELS: Record<string, string> = Object.fromEntries(
  services.filter((s) => (HIRING_NEEDS as readonly string[]).includes(s.slug)).map((s) => [s.slug, s.name])
);

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}

function Field({ id, label, error, children }: FieldProps) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="mt-1">{children}</div>
      {error && (
        <p role="alert" className="mt-1 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export function EmployerForm() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmployerFormValues>({
    resolver: zodResolver(employerFormSchema),
    // Select fields must start controlled (a defined string), or Base UI's
    // Select warns and breaks internal state when it later flips from
    // uncontrolled (undefined) to controlled once a value is chosen.
    defaultValues: { hiringNeed: "" as never, employmentType: "" as never },
  });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function onSubmit(values: EmployerFormValues) {
    const result = await submitEmployerLead(values);
    if (result.success) {
      setStatus("success");
      reset();
    } else {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-xl border border-green-200 bg-green-50 p-6 text-green-900">
        Thanks - a talent expert will reach out shortly.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4 sm:grid-cols-2">
      {status === "error" && (
        <div className="sm:col-span-2">
          <ErrorState
            description="We couldn't submit your request. Please try again."
            onRetry={() => setStatus("idle")}
          />
        </div>
      )}

      <Field id="employer-name" label="Full name" error={errors.name?.message}>
        <Input id="employer-name" {...register("name")} />
      </Field>
      <Field id="employer-company" label="Company" error={errors.company?.message}>
        <Input id="employer-company" {...register("company")} />
      </Field>
      <Field id="employer-work-email" label="Work email" error={errors.workEmail?.message}>
        <Input id="employer-work-email" type="email" {...register("workEmail")} />
      </Field>
      <Field id="employer-phone" label="Phone" error={errors.phone?.message}>
        <Input id="employer-phone" type="tel" {...register("phone")} />
      </Field>
      <Field id="employer-job-title" label="Job title" error={errors.jobTitle?.message}>
        <Input id="employer-job-title" {...register("jobTitle")} />
      </Field>

      <Field id="employer-hiring-need" label="Hiring need" error={errors.hiringNeed?.message}>
        <Controller
          control={control}
          name="hiringNeed"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="employer-hiring-need">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {HIRING_NEEDS.map((need) => (
                  <SelectItem key={need} value={need}>
                    {HIRING_NEED_LABELS[need]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </Field>

      <Field id="employer-positions" label="Number of positions" error={errors.numberOfPositions?.message}>
        <Input id="employer-positions" type="number" min={1} {...register("numberOfPositions")} />
      </Field>
      <Field id="employer-location" label="Location" error={errors.location?.message}>
        <Input id="employer-location" {...register("location")} />
      </Field>

      <Field id="employer-employment-type" label="Employment type" error={errors.employmentType?.message}>
        <Controller
          control={control}
          name="employmentType"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="employer-employment-type">
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
      </Field>

      <div className="sm:col-span-2">
        <Field id="employer-message" label="Message (optional)">
          <Textarea id="employer-message" rows={4} {...register("message")} />
        </Field>
      </div>

      <div className="sm:col-span-2">
        <Button type="submit" disabled={isSubmitting} className="min-h-11">
          {isSubmitting ? "Sending..." : "Talk to a Talent Expert"}
        </Button>
      </div>
    </form>
  );
}
