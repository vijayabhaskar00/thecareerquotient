import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us",
  description: "Talk to a talent expert about hiring or your next career move.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-display-md font-bold text-navy-900">Let&apos;s Talk.</h1>
      <p className="mt-4 text-lg text-navy-700">
        Whether you&apos;re building a team or looking for your next role, tell us a bit about what you need.
      </p>
      <div className="mt-10 rounded-3xl border border-navy-100 bg-white p-6 shadow-soft sm:p-10">
        <ContactForm />
      </div>
    </div>
  );
}
