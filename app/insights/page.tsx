import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllArticles, getAllCategories } from "@/lib/content/insights";
import { InsightsList } from "@/components/marketing/InsightsList";
import { InsightsView } from "@/components/marketing/InsightsView";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Career Insights",
  description: "Career advice, hiring trends, and workforce strategy from TheCareerQuotient.",
  path: "/insights",
});

export default function InsightsPage() {
  // Cards only need the summary fields; leave the article bodies out of the client payload.
  const articles = getAllArticles().map(({ slug, title, description, category, date, readingTime }) => ({
    slug,
    title,
    description,
    category,
    date,
    readingTime,
  }));
  const categories = getAllCategories();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-display-lg font-bold text-ink">Career Insights</h1>

      {/* The fallback is the full list, so the articles are in the prerendered HTML before any JavaScript runs. */}
      <Suspense fallback={<InsightsView articles={articles} categories={categories} />}>
        <InsightsList articles={articles} categories={categories} />
      </Suspense>
    </div>
  );
}
