import postsData from "@/content/posts.json";
import pagesData from "@/content/pages.json";

export interface ContentItem {
  title: string;
  slug: string;
  date: string;
  categories: string[];
  tags: string[];
  excerpt: string;
  content_md: string;
  parent: string;
}

const posts = postsData as ContentItem[];
const pages = pagesData as ContentItem[];

export function getAllPosts(): ContentItem[] {
  return [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getAllPages(): ContentItem[] {
  return pages;
}

export function getPostBySlug(slug: string): ContentItem | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getPageBySlug(slug: string): ContentItem | undefined {
  return pages.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return [...posts.map((p) => p.slug), ...pages.map((p) => p.slug)];
}

export function getAllCategories(): string[] {
  const set = new Set<string>();
  for (const post of posts) {
    for (const c of post.categories) set.add(c);
  }
  return [...set].sort();
}

export function getPostsByCategory(category: string): ContentItem[] {
  return getAllPosts().filter((p) =>
    p.categories.some((c) => c.toLowerCase() === category.toLowerCase())
  );
}

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const GRADIENTS = [
  "from-rose-500 via-fuchsia-500 to-indigo-500",
  "from-amber-500 via-orange-500 to-rose-500",
  "from-emerald-500 via-teal-500 to-cyan-500",
  "from-indigo-500 via-purple-500 to-pink-500",
  "from-sky-500 via-blue-500 to-indigo-500",
  "from-lime-500 via-green-500 to-emerald-500",
];

export function gradientForSlug(slug: string): string {
  return GRADIENTS[hashString(slug) % GRADIENTS.length];
}
