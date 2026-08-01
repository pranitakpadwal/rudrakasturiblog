import postsData from "@/content/posts.json";
import pagesData from "@/content/pages.json";
import homeCuratedData from "@/content/homeCurated.json";

interface Curated {
  teaser: string;
  blurb: string;
}

const homeCurated = homeCuratedData as Record<string, Curated>;

// Hand-written teaser title + 2-line blurb for the handful of posts shown
// on the homepage: kept separate from the canonical title/excerpt so the
// indexed article page's actual <title>/H1 never changes.
export function getHomeCurated(slug: string): Curated | undefined {
  return homeCurated[slug];
}

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

export function getCategoryCloud(): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const c of post.categories) counts.set(c, (counts.get(c) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, count]) => count >= 3)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([name, count]) => ({ name, count }));
}

// Reader favorites carried over from the live site's own "Top Posts &
// Pages" widget (real traffic data), not a guess.
const TOP_POST_SLUGS = [
  "you-didnt-lose-your-job-you-got-in-early",
  "robots-txt-unreachable-heres-how-to-keep-your-site-safe-and-seo-friendly",
  "microsoft-study-identifies-40-jobs-most-and-least-affected-by-ai",
  "11-things-liz-reid-told-publishers-straight-from-googles-head-of-search",
  "how-google-decides-the-best-url-clustering-and-canonicalization-explained",
  "youtubes-blurred-thumbnails-test-a-step-toward-safer-search-and-smarter-monetization",
  "google-discover-just-got-smarter-publishers-just-got-ghosted",
  "gujarats-ai-plan-is-not-just-optics-it-might-actually-work",
];

export function getTopPosts(): ContentItem[] {
  return TOP_POST_SLUGS.map((slug) => getPostBySlug(slug)).filter(
    (p): p is ContentItem => Boolean(p)
  );
}

export function getRecentPosts(excludeSlug: string, limit: number): ContentItem[] {
  return getAllPosts()
    .filter((p) => p.slug !== excludeSlug)
    .slice(0, limit);
}

// Ranks by shared tags first, then shared category, so "read also" and
// recirculation modules surface genuinely related posts instead of just
// the newest ones.
// Picks the next post for continuous-scroll reading: same category first
// (keeps the reader on-topic), falling back to the next post overall.
export function getNextArticle(
  currentSlug: string,
  excludeSlugs: string[]
): ContentItem | undefined {
  const current = getPostBySlug(currentSlug);
  if (!current) return undefined;
  const exclude = new Set([currentSlug, ...excludeSlugs]);
  const all = getAllPosts();

  const sameCategory = all.find(
    (p) => !exclude.has(p.slug) && p.categories.some((c) => current.categories.includes(c))
  );
  if (sameCategory) return sameCategory;

  return all.find((p) => !exclude.has(p.slug));
}

export function getRelatedPosts(
  post: ContentItem,
  exclude: string[],
  limit: number
): ContentItem[] {
  const tagSet = new Set(post.tags.map((t) => t.toLowerCase()));
  const categorySet = new Set(post.categories);
  const excludeSet = new Set([post.slug, ...exclude]);

  return getAllPosts()
    .filter((p) => !excludeSet.has(p.slug))
    .map((p) => {
      const sharedTags = p.tags.filter((t) => tagSet.has(t.toLowerCase())).length;
      const sharedCategory = p.categories.some((c) => categorySet.has(c)) ? 1 : 0;
      return { post: p, score: sharedTags * 2 + sharedCategory };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.post);
}

export { duotoneForSlug, categoryColor, DUOTONES } from "./palette";

export function readingTime(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export const AUTHOR_NAME = "Rudra Kasturi";
export const AUTHOR_URL = "/about-rudra-kasturi";

// wp:post_date from the export is already wall-clock IST (the blog's admin
// timezone) with no offset attached, so we pin it to +05:30 before
// formatting rather than trusting ambient server/browser timezone parsing.
function parseIST(date: string): Date {
  return new Date(date.replace(" ", "T") + "+05:30");
}

export function formatDateIST(date: string): string {
  return parseIST(date).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDateIST(date: string): string {
  return parseIST(date).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTimeIST(date: string): string {
  const formatted = parseIST(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${formatted} IST`;
}
