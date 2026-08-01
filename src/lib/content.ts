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

export function categorySlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export function getTopCategories(limit: number): string[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const c of post.categories) counts.set(c, (counts.get(c) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name]) => name);
}

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// A small, restrained set of duotones — editorial rather than "AI gradient".
export const DUOTONES: [string, string][] = [
  ["#1c1917", "#8a5a3b"], // ink / clay
  ["#0f1f1c", "#2f6f5e"], // pine / sage
  ["#1a1423", "#5b3a8f"], // aubergine / violet
  ["#1e2a3a", "#3d6b8a"], // navy / slate blue
  ["#241a12", "#b5651d"], // espresso / rust
  ["#151515", "#4a4a4a"], // charcoal / graphite
];

export function duotoneForSlug(slug: string): [string, string] {
  return DUOTONES[hashString(slug) % DUOTONES.length];
}

export function readingTime(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
