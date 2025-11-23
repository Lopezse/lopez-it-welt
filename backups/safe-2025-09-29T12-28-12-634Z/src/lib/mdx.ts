import fs from "fs";
import matter from "gray-matter";
import path from "path";

const contentDirectory = path.join(process.cwd(), "src/content");

export interface MarkdownDocument {
  slug: string;
  content: string;
  frontmatter: {
    title: string;
    date?: string;
    author?: string;
    description?: string;
    [key: string]: unknown;
  };
}

export function getMarkdownFiles(): string[] {
  return fs
    .readdirSync(contentDirectory)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"));
}

export function getMarkdownBySlug(slug: string): MarkdownDocument {
  const realSlug = slug.replace(/\.mdx?$/, "");
  const fullPath = path.join(contentDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug: realSlug,
    content,
    frontmatter: {
      ...data,
      title: data.title || realSlug,
    },
  };
}

export function getAllMarkdowns(): MarkdownDocument[] {
  const files = getMarkdownFiles();
  return files.map((file) => getMarkdownBySlug(file.replace(/\.mdx?$/, "")));
}
