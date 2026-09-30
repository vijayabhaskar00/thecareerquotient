import Link from "next/link";

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
    <article className="group flex h-full flex-col rounded-xl border border-line bg-surface-2 p-6 transition-colors duration-150 hover:border-ink">
      <span className="inline-flex w-fit items-center rounded-md bg-accent px-2.5 py-1 text-xs font-bold text-ink">
        {article.category}
      </span>
      <h3 className="mt-4 text-xl leading-snug text-ink">
        <Link href={`/insights/${article.slug}`} className="focus-ring rounded group-hover:underline-ink">
          {article.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm text-ink-soft">{article.description}</p>
      <p className="mt-4 text-xs text-ink-soft">
        {article.date} &middot; {article.readingTime}
      </p>
    </article>
  );
}
