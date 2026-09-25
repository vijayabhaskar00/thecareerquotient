"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactFormValues } from "@/lib/validation/formSchemas";
import { submitContactForm } from "@/lib/forms/submitForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ErrorState } from "@/components/states/ErrorState";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactFormSchema) });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function onSubmit(values: ContactFormValues) {
    const result = await submitContactForm(values);
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
        Thanks - we received your message and will be in touch soon.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      {status === "error" && (
        <ErrorState description="We couldn't send your message. Please try again." onRetry={() => setStatus("idle")} />
      )}

      <div className="space-y-1.5">
        <Label htmlFor="contact-name">Full name</Label>
        <Input id="contact-name" {...register("name")} aria-invalid={!!errors.name} />
        {errors.name && (
          <p role="alert" className="mt-1 text-sm text-red-700">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-email">Email</Label>
        <Input id="contact-email" type="email" {...register("email")} aria-invalid={!!errors.email} />
        {errors.email && (
          <p role="alert" className="mt-1 text-sm text-red-700">
            {errors.email.message}
          </p>
        )}
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-navy-900">I am a...</legend>
        <div className="mt-1.5 flex gap-2">
          <label className="has-[:checked]:border-accent has-[:checked]:bg-accent has-[:checked]:text-white has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent has-[:focus-visible]:ring-offset-2 cursor-pointer rounded-full border border-navy-100 px-5 py-2.5 text-sm font-medium text-navy-700 transition-colors duration-200 hover:border-accent/50">
            <input type="radio" value="employer" {...register("audience")} className="sr-only" />
            Employer
          </label>
          <label className="has-[:checked]:border-accent has-[:checked]:bg-accent has-[:checked]:text-white has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent has-[:focus-visible]:ring-offset-2 cursor-pointer rounded-full border border-navy-100 px-5 py-2.5 text-sm font-medium text-navy-700 transition-colors duration-200 hover:border-accent/50">
            <input type="radio" value="candidate" {...register("audience")} className="sr-only" />
            Candidate
          </label>
        </div>
        {errors.audience && (
          <p role="alert" className="mt-1 text-sm text-red-700">
            Select one.
          </p>
        )}
      </fieldset>

      <div className="space-y-1.5">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea id="contact-message" rows={5} {...register("message")} aria-invalid={!!errors.message} />
        {errors.message && (
          <p role="alert" className="mt-1 text-sm text-red-700">
            {errors.message.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="min-h-11">
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
