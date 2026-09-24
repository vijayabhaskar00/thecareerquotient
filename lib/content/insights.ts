import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

const INSIGHTS_DIR = path.join(process.cwd(), "content", "insights");

export interface ArticleFrontmatter {
  title: string;
  description: string;
  category: string;
  date: string;
  author: string;
}

export interface Article extends ArticleFrontmatter {
  slug: string;
  readingTime: string;
  content: string;
}

function readArticleFile(filename: string): Article {
  const slug = filename.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(INSIGHTS_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  const frontmatter = data as ArticleFrontmatter;
  return {
    ...frontmatter,
    slug,
    readingTime: readingTime(content).text,
    content,
  };
}

export function getAllArticles(): Article[] {
  const filenames = fs.readdirSync(INSIGHTS_DIR).filter((name) => name.endsWith(".mdx"));
  return filenames.map(readArticleFile).sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getArticleBySlug(slug: string): Article | null {
  const filePath = path.join(INSIGHTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return readArticleFile(`${slug}.mdx`);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(getAllArticles().map((article) => article.category))).sort();
}
