import type { Metadata } from "next";
import Link from "next/link";
import { CandidateForm } from "@/components/forms/CandidateForm";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Find Jobs",
  description: "Submit your resume and explore career resources from TheCareerQuotient.",
  path: "/find-jobs",
});

export default function FindJobsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-display-lg font-bold text-navy-900">Your next opportunity starts here.</h1>
      <p className="mt-4 text-lg text-navy-700">
        Submit your resume and a recruiter will reach out if there&apos;s a fit. In the meantime, explore our{" "}
        <Link href="/insights" className="font-semibold text-accent">
          career resources
        </Link>
        .
      </p>
      <div className="mt-10 rounded-3xl border border-navy-100 bg-white p-6 shadow-soft sm:p-10">
        <CandidateForm />
      </div>
    </div>
  );
}
