import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { HeroVisual } from "@/components/marketing/HeroVisual";

export function Hero() {
  return (
    <section className="px-4 pb-12 pt-12 sm:px-6 sm:pt-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="max-w-md text-sm font-medium text-ink-soft sm:text-base">
          Human-first hiring, built for how work actually happens.
        </p>

        <ScrollReveal>
          <h1 className="mt-6 text-display-xl uppercase text-ink">
            <span className="block">Smarter Talent.</span>{" "}
            <span className="block">Stronger Teams.</span>{" "}
            <span className="block">
              <span className="marker">Better Careers.</span>
            </span>
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <p className="max-w-2xl text-lg leading-relaxed text-ink-soft sm:text-xl">
            TheCareerQuotient connects ambitious organizations with exceptional professionals through flexible
            staffing, permanent hiring, executive search, and workforce solutions.
          </p>
          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <Button
              size="lg"
              className="h-12 px-6 text-base"
              render={
                <Link href="/hire-talent">
                  Hire Talent
                  <ArrowUpRight className="size-5" aria-hidden="true" />
                </Link>
              }
            />
            <Button
              size="lg"
              variant="outline"
              className="h-12 border-ink px-6 text-base text-ink hover:bg-ink hover:text-sage"
              render={<Link href="/find-jobs">Find Jobs</Link>}
            />
          </div>
        </ScrollReveal>

        <div className="mt-14 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col justify-between gap-10 rounded-xl bg-forest p-7 text-sage">
              <div>
                <h2 className="text-3xl uppercase text-white">Build Your Team</h2>
                <p className="mt-3 text-sage/80">
                  Tell us what you need. We&apos;ll help you find the people who can move your business forward.
                </p>
              </div>
              <ArrowUpRight className="size-12 text-accent" strokeWidth={1.5} aria-hidden="true" />
            </div>
            <div className="flex flex-col justify-between gap-10 rounded-xl bg-accent p-7 text-ink">
              <div>
                <h2 className="text-3xl uppercase">Find Your Next Opportunity</h2>
                <p className="mt-3 text-ink/80">
                  Discover roles that match your skills, ambitions, and career goals.
                </p>
              </div>
              <ArrowUpRight className="size-12 text-ink" strokeWidth={1.5} aria-hidden="true" />
            </div>
          </div>

          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
