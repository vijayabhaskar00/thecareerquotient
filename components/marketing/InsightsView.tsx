import Link from "next/link";
import { ArticleCard, type ArticleSummary } from "@/components/marketing/ArticleCard";
import { EmptyState } from "@/components/states/EmptyState";

interface InsightsViewProps {
  articles: ArticleSummary[];
  categories: string[];
  /** Selected category; undefined means "All". */
  active?: string;
}

const PILL = "rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-150";
const PILL_ACTIVE = "border-ink bg-ink text-sage";
const PILL_IDLE = "border-line text-ink-soft hover:border-ink hover:text-ink";

/**
 * The insights list as plain, server-renderable markup, so the articles are in
 * the page's HTML (crawlers, slow connections, no JavaScript) instead of
 * appearing only after the client has hydrated.
 */
export function InsightsView({ articles, categories, active }: InsightsViewProps) {
  const visible = active ? articles.filter((a) => a.category === active) : articles;

  return (
    <>
      <nav aria-label="Filter by category" className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/insights"
          aria-current={!active ? "page" : undefined}
          className={`${PILL} ${!active ? PILL_ACTIVE : PILL_IDLE}`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/insights?category=${encodeURIComponent(cat)}`}
            aria-current={active === cat ? "page" : undefined}
            className={`${PILL} ${active === cat ? PILL_ACTIVE : PILL_IDLE}`}
          >
            {cat}
          </Link>
        ))}
      </nav>

      {visible.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            heading="No articles matched this category."
            description="Try a different category or view all insights."
            action={
              <Link href="/insights" className="font-semibold text-accent-ink">
                View all insights
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </>
  );
}
