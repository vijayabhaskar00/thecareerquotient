import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { HeroVisual } from "@/components/marketing/HeroVisual";

export function Hero() {
  return (
    <section className="mesh-bg mesh-bg-contained relative overflow-hidden px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:px-8">
      <div className="grid-lines absolute inset-0 -z-10" aria-hidden="true" />
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-8">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-line-soft px-4 py-1.5 text-sm font-medium text-ink-soft backdrop-blur-[12px]">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              Human-first hiring, built for how work actually happens.
            </span>
            <h1 className="mt-8 text-balance text-display-xl font-bold text-ink">
              Smarter Talent. Stronger Teams. <span className="text-gradient">Better Careers.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-soft sm:text-xl">
              TheCareerQuotient connects ambitious organizations with exceptional professionals through flexible
              staffing, permanent hiring, executive search, and workforce solutions.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                className="h-14 px-8 text-base"
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
                className="h-14 px-8 text-base text-ink"
                render={<Link href="/find-jobs">Find Jobs</Link>}
              />
            </div>
          </ScrollReveal>

          <HeroVisual />
        </div>

        <div className="mt-20 grid gap-4 sm:grid-cols-5">
          <div className="glass-panel group relative flex flex-col justify-between overflow-hidden rounded-3xl p-8 shadow-soft-lg backdrop-blur-[20px] sm:col-span-3">
            <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-accent/20 blur-3xl transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />
            <div className="relative">
              <h2 className="text-3xl font-semibold tracking-tight text-ink">Build Your Team</h2>
              <p className="mt-3 max-w-sm text-ink-soft">
                Tell us what you need. We&apos;ll help you find the people who can move your business forward.
              </p>
            </div>
          </div>

          <div className="glass-panel group flex flex-col justify-between rounded-3xl p-8 shadow-soft backdrop-blur-[20px] sm:col-span-2">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-ink">Find Your Next Opportunity</h2>
              <p className="mt-3 text-sm text-ink-soft">
                Discover roles that match your skills, ambitions, and career goals.
              </p>
            </div>
            <span className="mt-6 inline-flex items-center gap-1 font-semibold text-accent" aria-hidden="true">
              Explore roles <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
