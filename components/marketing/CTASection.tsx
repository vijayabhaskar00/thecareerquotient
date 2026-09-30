import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { cn } from "@/lib/utils";

type CTATone = "forest" | "orange" | "paper";

interface CTASectionProps {
  heading: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  tone?: CTATone;
}

const TONES: Record<CTATone, { panel: string; body: string; button: string }> = {
  forest: {
    panel: "bg-forest text-white",
    body: "text-sage/80",
    button: "",
  },
  orange: {
    panel: "bg-accent text-ink",
    body: "text-ink/80",
    button: "bg-forest text-white hover:bg-forest-soft",
  },
  paper: {
    panel: "border border-line bg-surface-2 text-ink",
    body: "text-ink-soft",
    button: "",
  },
};

export function CTASection({ heading, description, ctaLabel, ctaHref, tone = "forest" }: CTASectionProps) {
  const t = TONES[tone];

  return (
    <section className="px-4 py-4 sm:px-6 lg:px-8">
      <ScrollReveal>
        <div className={cn("mx-auto max-w-7xl rounded-2xl px-6 py-14 sm:px-14 sm:py-20", t.panel)}>
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-balance text-display-md uppercase">{heading}</h2>
              <p className={cn("mt-4 max-w-xl text-lg", t.body)}>{description}</p>
            </div>
            <Button
              size="lg"
              className={cn("h-12 px-6 text-base", t.button)}
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
