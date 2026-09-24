import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  heading: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

export function CTASection({ heading, description, ctaLabel, ctaHref }: CTASectionProps) {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mesh-bg mesh-bg-dark relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-navy-900 px-8 py-16 text-offwhite shadow-soft-lg sm:px-16">
        <div className="mx-auto flex max-w-2xl flex-col items-start gap-4">
          <h2 className="text-display-md font-bold">{heading}</h2>
          <p className="text-navy-100">{description}</p>
          <Button
            size="lg"
            variant="secondary"
            className="mt-2"
            render={<Link href={ctaHref}>{ctaLabel}</Link>}
          />
        </div>
      </div>
    </section>
  );
}
