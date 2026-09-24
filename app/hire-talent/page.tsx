import type { Metadata } from "next";
import { EmployerForm } from "@/components/forms/EmployerForm";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Hire Talent",
  description: "Tell us what you need. We'll help you find the people who can move your business forward.",
  path: "/hire-talent",
});

export default function HireTalentPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-display-md font-bold text-navy-900">Your next great hire is closer than you think.</h1>
      <p className="mt-4 text-lg text-navy-700">Tell us about your hiring need and a talent expert will follow up.</p>
      <div className="mt-10">
        <EmployerForm />
      </div>
    </div>
  );
}
