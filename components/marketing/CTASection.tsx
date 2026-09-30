import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

interface CTASectionProps {
  heading: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

export function CTASection({ heading, description, ctaLabel, ctaHref }: CTASectionProps) {
  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <ScrollReveal>
        <div className="mesh-bg mesh-bg-dark relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-line bg-surface px-8 py-16 shadow-soft-lg sm:px-16 sm:py-24">
          <div className="grid-lines absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-balance text-display-md font-bold text-ink">{heading}</h2>
              <p className="mt-4 max-w-xl text-lg text-ink-soft">{description}</p>
            </div>
            <Button
              size="lg"
              className="h-14 px-8 text-base"
              render={
                <Link href={ctaHref}>
                  {ctaLabel}
                  <ArrowUpRight className="size-5" aria-hidden="true" />
                </Link>
              }
            />
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
