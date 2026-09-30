"use client";

import { useSearchParams } from "next/navigation";
import type { ArticleSummary } from "@/components/marketing/ArticleCard";
import { InsightsView } from "@/components/marketing/InsightsView";

interface InsightsListProps {
  articles: ArticleSummary[];
  categories: string[];
}

/** Client wrapper: reads `?category=` and filters. The unfiltered list is already in the server HTML. */
export function InsightsList({ articles, categories }: InsightsListProps) {
  const active = useSearchParams().get("category") ?? undefined;
  return <InsightsView articles={articles} categories={categories} active={active} />;
}
