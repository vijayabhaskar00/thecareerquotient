import Link from "next/link";
import type { Industry } from "@/content/industries/types";

interface IndustryCardProps {
  industry: Industry;
}

export function IndustryCard({ industry }: IndustryCardProps) {
  return (
    <article className="flex flex-col rounded-xl border border-navy-100 bg-white p-6">
      <h3 className="text-lg font-semibold text-navy-900">{industry.name}</h3>
      <p className="mt-2 text-sm text-navy-700">{industry.intro}</p>
      <Link
        href={`/industries/${industry.slug}`}
        className="focus-ring mt-4 inline-block rounded font-semibold text-accent"
      >
        Explore {industry.name} -&gt;
      </Link>
    </article>
  );
}
