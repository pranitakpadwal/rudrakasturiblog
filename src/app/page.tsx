import Link from "next/link";
import { getAllPosts, getPostSummaries, getTopCategories, categorySlug } from "@/lib/content";
import InfiniteGrid from "@/components/InfiniteGrid";

export default function Home() {
  const posts = getAllPosts();
  const [featured] = posts;
  const topCategories = getTopCategories(8);
  const summaries = getPostSummaries().filter((p) => p.slug !== featured?.slug);

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <div className="mb-8 max-w-2xl">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Rudra Kasturi
        </p>
        <h1 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          Make search fun.
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink-soft sm:text-lg">
          A working notebook on SEO, AEO, and AI search — what&apos;s changing, why it
          matters, and what to do about it.
        </p>
      </div>

      <div className="mb-14 flex flex-wrap gap-2">
        {topCategories.map((c) => (
          <Link
            key={c}
            href={`/category/${categorySlug(c)}`}
            className="rounded-full border border-line px-3.5 py-1.5 text-sm text-ink-soft transition hover:border-accent hover:text-accent"
          >
            {c}
          </Link>
        ))}
      </div>

      {featured && (
        <Link href={`/${featured.slug}`} className="group mb-16 block">
          <p className="mb-2 font-mono text-xs uppercase tracking-wide text-accent">
            Latest
          </p>
          <h2 className="font-display text-2xl font-semibold leading-snug text-ink group-hover:text-accent sm:text-3xl">
            {featured.title}
          </h2>
          {featured.excerpt && (
            <p className="mt-3 max-w-2xl text-ink-soft leading-relaxed">{featured.excerpt}</p>
          )}
        </Link>
      )}

      <div className="mb-6 flex items-center gap-4">
        <h2 className="font-display text-xl font-semibold text-ink">All writing</h2>
        <div className="h-px flex-1 bg-line" />
        <span className="font-mono text-xs text-ink-soft">{posts.length} posts</span>
      </div>

      <InfiniteGrid posts={summaries} />
    </div>
  );
}
