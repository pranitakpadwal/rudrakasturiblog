import { getAllPages, getAllPosts } from "@/lib/content";

const SITE_URL = "https://blog.rudrakasturi.com";

export function GET() {
  const posts = getAllPosts();
  const pages = getAllPages();

  const lines: string[] = [
    "# Rudra Kasturi",
    "",
    "> Search. Strategy. AI. Growth. Coach. Revenue.",
    "",
    "Rudra Kasturi writes about SEO, AEO (answer engine optimization), AI search, and how AI is reshaping search, content, and marketing careers.",
    "",
    "## Pages",
    "",
    ...pages.map((p) => `- [${p.title}](${SITE_URL}/${p.slug})`),
    "",
    "## Posts",
    "",
    ...posts.map((p) => `- [${p.title}](${SITE_URL}/${p.slug}) — ${p.date.slice(0, 10)}`),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
