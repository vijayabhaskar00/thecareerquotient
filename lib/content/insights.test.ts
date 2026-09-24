import { describe, it, expect } from "vitest";
import { getAllArticles, getArticleBySlug, getAllCategories } from "./insights";

describe("insights content loader", () => {
  it("loads all 3 seed articles sorted newest first", () => {
    const articles = getAllArticles();
    expect(articles).toHaveLength(3);
    for (let i = 1; i < articles.length; i++) {
      expect(articles[i - 1].date >= articles[i].date).toBe(true);
    }
  });

  it("computes a human-readable reading time for every article", () => {
    for (const article of getAllArticles()) {
      expect(article.readingTime).toMatch(/read/);
    }
  });

  it("returns a matching article by slug and null for an unknown slug", () => {
    const [first] = getAllArticles();
    expect(getArticleBySlug(first.slug)?.title).toBe(first.title);
    expect(getArticleBySlug("not-a-real-article")).toBeNull();
  });

  it("derives the distinct category list", () => {
    const categories = getAllCategories();
    expect(categories.length).toBeGreaterThan(0);
    expect(new Set(categories).size).toBe(categories.length);
  });
});
