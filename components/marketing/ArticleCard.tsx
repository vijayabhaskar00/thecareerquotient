import Link from "next/link";
import { SpotlightCard } from "@/components/motion/SpotlightCard";

export interface ArticleSummary {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readingTime: string;
}

interface ArticleCardProps {
  article: ArticleSummary;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <SpotlightCard className="group flex h-full flex-col rounded-3xl border border-line bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40">
      <span className="inline-flex w-fit items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-accent">
        {article.category}
      </span>
      <h3 className="mt-5 text-xl font-semibold leading-snug tracking-tight text-ink">
        <Link href={`/insights/${article.slug}`} className="focus-ring rounded transition-colors group-hover:text-accent">
          {article.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm text-ink-soft">{article.description}</p>
      <p className="mt-4 text-xs text-ink-soft">
        {article.date} &middot; {article.readingTime}
      </p>
    </SpotlightCard>
  );
}
