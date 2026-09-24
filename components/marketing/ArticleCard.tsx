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
    <article className="flex flex-col rounded-3xl border border-navy-100 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg">
      <span className="inline-flex w-fit items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
        {article.category}
      </span>
      <h3 className="mt-4 text-lg font-semibold text-navy-900">
        <Link href={`/insights/${article.slug}`} className="focus-ring rounded">
          {article.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm text-navy-700">{article.description}</p>
      <p className="mt-4 text-xs text-navy-700">
        {article.date} &middot; {article.readingTime}
      </p>
    </article>
  );
}
