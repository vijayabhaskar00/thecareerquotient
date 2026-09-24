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
    <section className="bg-navy-900 py-16 text-offwhite">
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-4 px-4 sm:px-6 lg:px-8">
        <h2 className="text-display-md font-bold">{heading}</h2>
        <p className="text-navy-100">{description}</p>
        <Button asChild size="lg" className="mt-2">
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      </div>
    </section>
  );
}
