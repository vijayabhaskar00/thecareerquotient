import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllArticles, getArticleBySlug } from "@/lib/content/insights";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return buildMetadata({ title: article.title, description: article.description, path: `/insights/${slug}` });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <JsonLd
        data={articleJsonLd({
          title: article.title,
          description: article.description,
          path: `/insights/${slug}`,
          datePublished: article.date,
          author: article.author,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights" },
          { name: article.title, path: `/insights/${slug}` },
        ])}
      />
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/insights", label: "Insights" },
          { href: `/insights/${slug}`, label: article.title },
        ]}
      />
      <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-accent">{article.category}</p>
      <h1 className="mt-2 text-display-md font-bold text-navy-900">{article.title}</h1>
      <p className="mt-2 text-sm text-navy-700">
        {article.author} - {article.date} - {article.readingTime}
      </p>
      <div className="mt-8 space-y-4 text-navy-800">
        <MDXRemote source={article.content} />
      </div>
    </article>
  );
}
