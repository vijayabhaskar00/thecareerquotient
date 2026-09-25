import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { HeroVisual } from "@/components/marketing/HeroVisual";

export function Hero() {
  return (
    <section className="mesh-bg mesh-bg-contained relative px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-16">
          <ScrollReveal>
            <span className="inline-flex items-center rounded-full border border-navy-100 bg-white/80 px-4 py-1.5 text-sm font-medium text-navy-700 shadow-soft">
              Human-first hiring, built for how work actually happens.
            </span>
            <h1 className="mt-6 text-balance text-display-lg font-bold text-navy-900">
              Smarter Talent. Stronger Teams. <span className="text-accent">Better Careers.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-navy-700">
              TheCareerQuotient connects ambitious organizations with exceptional professionals through flexible
              staffing, permanent hiring, executive search, and workforce solutions.
            </p>
          </ScrollReveal>

          <HeroVisual />
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-5">
          <div className="glass-panel flex flex-col justify-between rounded-3xl p-8 shadow-soft-lg backdrop-blur-[20px] sm:col-span-3">
            <div>
              <h2 className="text-2xl font-semibold text-navy-900">Build Your Team</h2>
              <p className="mt-3 max-w-sm text-navy-700">
                Tell us what you need. We&apos;ll help you find the people who can move your business forward.
              </p>
            </div>
            <Button className="mt-6 w-fit" render={<Link href="/hire-talent">Hire Talent</Link>} />
          </div>

          <div className="glass-panel flex flex-col justify-between rounded-3xl p-8 shadow-soft backdrop-blur-[20px] sm:col-span-2">
            <div>
              <h2 className="text-xl font-semibold text-navy-900">Find Your Next Opportunity</h2>
              <p className="mt-3 text-sm text-navy-700">
                Discover roles that match your skills, ambitions, and career goals.
              </p>
            </div>
            <Link
              href="/find-jobs"
              className="focus-ring mt-6 inline-flex w-fit items-center gap-1 rounded font-semibold text-accent transition-transform duration-200 hover:gap-2"
            >
              Find Jobs
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
