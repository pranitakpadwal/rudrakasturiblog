import { getAllPosts } from "./content";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5-20251001";
const BRAVE_SEARCH_API_KEY = process.env.BRAVE_SEARCH_API_KEY;

export function isAskConfigured(): boolean {
  return Boolean(ANTHROPIC_API_KEY);
}

export interface BlogSource {
  slug: string;
  title: string;
  excerpt: string;
}

export interface WebSource {
  title: string;
  url: string;
  snippet: string;
}

// Cheap keyword-overlap search over the site's own posts — no embeddings,
// no vector DB, just title/excerpt/tag/category matching. Good enough at
// this content volume (~500 posts) and costs nothing to run.
export function searchBlogPosts(query: string, limit: number): BlogSource[] {
  const terms = query
    .toLowerCase()
    .split(/\W+/)
    .filter((t) => t.length > 2);

  if (terms.length === 0) return [];

  const scored = getAllPosts().map((post) => {
    const haystack = [
      post.title,
      post.excerpt,
      ...post.tags,
      ...post.categories,
    ]
      .join(" ")
      .toLowerCase();

    const score = terms.reduce((sum, term) => sum + (haystack.includes(term) ? 1 : 0), 0);
    return { post, score };
  });

  return scored
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => ({ slug: x.post.slug, title: x.post.title, excerpt: x.post.excerpt }));
}

export async function searchWeb(query: string): Promise<WebSource[]> {
  if (!BRAVE_SEARCH_API_KEY) return [];

  const res = await fetch(
    `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5`,
    {
      headers: {
        Accept: "application/json",
        "X-Subscription-Token": BRAVE_SEARCH_API_KEY,
      },
    }
  );

  if (!res.ok) return [];

  const data = await res.json();
  const results = data?.web?.results ?? [];
  return results.slice(0, 5).map((r: { title: string; url: string; description: string }) => ({
    title: r.title,
    url: r.url,
    snippet: r.description,
  }));
}

export async function askClaude(
  question: string,
  blogSources: BlogSource[],
  webSources: WebSource[]
): Promise<string> {
  if (!ANTHROPIC_API_KEY) throw new Error("Ask is not configured");

  const context = [
    blogSources.length > 0
      ? "From Rudra Kasturi's own blog:\n" +
        blogSources.map((s) => `- "${s.title}": ${s.excerpt}`).join("\n")
      : "",
    webSources.length > 0
      ? "From the web:\n" + webSources.map((s) => `- ${s.title}: ${s.snippet}`).join("\n")
      : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 400,
      system:
        "You answer questions about SEO, AEO, and AI search for a blog reader. " +
        "Prefer the blog excerpts given as context when they're relevant — this is " +
        "Rudra Kasturi's own reporting and analysis, cite it by title. Use the web " +
        "context to fill gaps the blog doesn't cover. Keep answers under 150 words, " +
        "plain language, no headers or bullet spam. If context doesn't cover the " +
        "question, answer from general knowledge but say so.",
      messages: [
        {
          role: "user",
          content: context
            ? `Context:\n${context}\n\nQuestion: ${question}`
            : `Question: ${question}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Anthropic call failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return data?.content?.[0]?.text ?? "";
}
