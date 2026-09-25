import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllArticles, getAllCategories } from "@/lib/content/insights";
import { InsightsList } from "@/components/marketing/InsightsList";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Career Insights",
  description: "Career advice, hiring trends, and workforce strategy from TheCareerQuotient.",
  path: "/insights",
});

export default function InsightsPage() {
  const articles = getAllArticles();
  const categories = getAllCategories();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-display-lg font-bold text-navy-900">Career Insights</h1>

      <Suspense>
        <InsightsList articles={articles} categories={categories} />
      </Suspense>
    </div>
  );
}
