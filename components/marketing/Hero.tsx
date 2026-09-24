import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <ScrollReveal>
        <h1 className="text-display-lg font-bold text-navy-900">Smarter Talent. Stronger Teams. Better Careers.</h1>
        <p className="mt-6 max-w-2xl text-lg text-navy-700">
          TheCareerQuotient connects ambitious organizations with exceptional professionals through flexible
          staffing, permanent hiring, executive search, and workforce solutions.
        </p>
      </ScrollReveal>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-navy-100 bg-white p-6">
          <h2 className="text-xl font-semibold text-navy-900">Build Your Team</h2>
          <p className="mt-2 text-sm text-navy-700">
            Tell us what you need. We&apos;ll help you find the people who can move your business forward.
          </p>
          <Button asChild className="mt-4">
            <Link href="/hire-talent">Hire Talent</Link>
          </Button>
        </div>

        <div className="rounded-xl border border-navy-100 bg-white p-6">
          <h2 className="text-xl font-semibold text-navy-900">Find Your Next Opportunity</h2>
          <p className="mt-2 text-sm text-navy-700">
            Discover roles that match your skills, ambitions, and career goals.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/find-jobs">Find Jobs</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
