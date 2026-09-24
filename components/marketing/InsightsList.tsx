"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Article } from "@/lib/content/insights";
import { ArticleCard } from "@/components/marketing/ArticleCard";
import { EmptyState } from "@/components/states/EmptyState";

interface InsightsListProps {
  articles: Article[];
  categories: string[];
}

export function InsightsList({ articles, categories }: InsightsListProps) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? undefined;
  const filtered = category ? articles.filter((a) => a.category === category) : articles;

  return (
    <>
      <nav aria-label="Filter by category" className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/insights"
          className={`rounded-full border px-4 py-2 text-sm ${
            !category ? "border-navy-900 bg-navy-900 text-white" : "border-navy-100 text-navy-700"
          }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/insights?category=${encodeURIComponent(cat)}`}
            className={`rounded-full border px-4 py-2 text-sm ${
              category === cat ? "border-navy-900 bg-navy-900 text-white" : "border-navy-100 text-navy-700"
            }`}
          >
            {cat}
          </Link>
        ))}
      </nav>

      {filtered.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            heading="No articles matched this category."
            description="Try a different category or view all insights."
            action={
              <Link href="/insights" className="font-semibold text-accent">
                View all insights
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </>
  );
}
