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
    <article className="rounded-xl border border-navy-100 bg-white p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">{article.category}</p>
      <h3 className="mt-2 text-lg font-semibold text-navy-900">
        <Link href={`/insights/${article.slug}`} className="focus-ring rounded">
          {article.title}
        </Link>
      </h3>
      <p className="mt-2 text-sm text-navy-700">{article.description}</p>
      <p className="mt-4 text-xs text-navy-700">
        {article.date} - {article.readingTime}
      </p>
    </article>
  );
}
