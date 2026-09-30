import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroVisual } from "@/components/marketing/HeroVisual";
import { HeroModel } from "@/components/marketing/HeroModel";
import { DotWave } from "@/components/marketing/DotWave";

/** Start delay for CSS entrance animations (see .hl-word, .hl-dot, .hero-rise in globals.css). */
const after = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** One word rising out of its mask. Real text, so the heading still reads as one sentence. */
function Word({ children, delay }: { children: string; delay: number }) {
  return (
    <span className="hl-word">
      <span style={after(delay)}>{children}</span>
    </span>
  );
}

export function Hero() {
  return (
    <section className="px-4 pb-12 pt-12 sm:px-6 sm:pt-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="hero-rise max-w-md text-sm font-medium text-ink-soft sm:text-base" style={after(0)}>
          Human-first hiring, built for how work actually happens.
        </p>

        <h1 className="mt-6 text-display-xl uppercase text-ink">
          <span className="block">
            <Word delay={80}>Smarter</Word> <Word delay={150}>Talent</Word>
            <span className="hl-dot" style={after(520)}>
              .
            </span>
          </span>{" "}
          <span className="block">
            <Word delay={200}>Stronger</Word> <Word delay={270}>Teams</Word>
            <span className="hl-dot" style={after(640)}>
              .
            </span>
          </span>{" "}
          <span className="block">
            <span className="marker" style={after(320)}>
              <Word delay={380}>Better</Word> <Word delay={450}>Careers.</Word>
            </span>
          </span>
        </h1>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <p className="hero-rise max-w-2xl text-lg leading-relaxed text-ink-soft sm:text-xl" style={after(600)}>
            TheCareerQuotient connects ambitious organizations with exceptional professionals through flexible
            staffing, permanent hiring, executive search, and workforce solutions.
          </p>
          <div className="hero-rise flex flex-wrap items-center gap-3 lg:justify-end" style={after(700)}>
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
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="hero-rise flex flex-col justify-between gap-10 rounded-xl bg-forest p-7 text-sage" style={after(780)}>
              <div>
                <h2 className="text-3xl uppercase text-white">Build Your Team</h2>
                <p className="mt-3 text-sage/80">
                  Tell us what you need. We&apos;ll help you find the people who can move your business forward.
                </p>
              </div>
              <HeroModel className="mx-auto aspect-square w-full max-w-[17rem]" />
            </div>
            <div className="hero-rise flex flex-col justify-between gap-10 rounded-xl bg-accent p-7 text-ink" style={after(860)}>
              <div>
                <h2 className="text-3xl uppercase">Find Your Next Opportunity</h2>
                <p className="mt-3 text-ink/80">
                  Discover roles that match your skills, ambitions, and career goals.
                </p>
              </div>
              <DotWave className="mx-auto aspect-square w-full max-w-[20rem]" />
            </div>
          </div>

          <div className="hero-rise" style={after(940)}>
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
