import Link from "next/link";
import {
  getAllPosts,
  getTopPosts,
  getTopCategories,
  duotoneForSlug,
  readingTime,
  formatDateIST,
  categorySlug,
} from "@/lib/content";

function PostCard({ post }: { post: ReturnType<typeof getAllPosts>[number] }) {
  const [from, to] = duotoneForSlug(post.slug);
  return (
    <Link
      href={`/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-line transition hover:shadow-md hover:shadow-black/5"
    >
      <div
        className="aspect-[4/3] w-full"
        style={{ background: `linear-gradient(155deg, ${from}, ${to})` }}
      />
      <div className="flex flex-1 flex-col p-5">
        {post.categories[0] && (
          <p className="mb-1.5 font-mono text-xs uppercase tracking-wide text-accent">
            {post.categories[0]}
          </p>
        )}
        <h3 className="font-display text-lg font-semibold leading-snug text-ink group-hover:text-accent">
          {post.title}
        </h3>
        <p className="mt-auto pt-3 text-sm text-ink-soft">
          {formatDateIST(post.date)} · {readingTime(post.content_md)} min read
        </p>
      </div>
    </Link>
  );
}

export default function Home() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;
  const feed = rest.slice(0, 9);
  const topPosts = getTopPosts().slice(0, 3);
  const topCategories = getTopCategories(8);

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <div className="mb-8 max-w-2xl">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Search · Strategy · AI
        </p>
        <h1 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          SEO, AEO, and AI search
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink-soft sm:text-lg">
          Practical writing on search, AI, and building an edge before everyone else has one.
        </p>
      </div>

      <div className="mb-16 flex flex-wrap gap-2">
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
        <Link
          href={`/${featured.slug}`}
          className="group mb-20 grid gap-8 border-b border-line pb-16 sm:grid-cols-2 sm:items-center"
        >
          <div
            className="aspect-[4/3] w-full rounded-2xl"
            style={{
              background: `linear-gradient(155deg, ${duotoneForSlug(featured.slug)[0]}, ${duotoneForSlug(featured.slug)[1]})`,
            }}
          />
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-wide text-ink-soft">
              Latest · {formatDateIST(featured.date)} · {readingTime(featured.content_md)} min read
            </p>
            <h2 className="font-display text-3xl font-semibold leading-snug text-ink group-hover:text-accent">
              {featured.title}
            </h2>
            {featured.excerpt && (
              <p className="mt-3 text-ink-soft leading-relaxed">{featured.excerpt}</p>
            )}
            {featured.categories.length > 0 && (
              <p className="mt-4 text-sm text-accent">{featured.categories.join(" · ")}</p>
            )}
          </div>
        </Link>
      )}

      {topPosts.length > 0 && (
        <div className="mb-20">
          <div className="mb-6 flex items-center gap-4">
            <h2 className="font-display text-xl font-semibold text-ink">Reader favorites</h2>
            <div className="h-px flex-1 bg-line" />
          </div>
          <div className="grid gap-x-8 gap-y-8 sm:grid-cols-3">
            {topPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      )}

      <div className="mb-8 flex items-center gap-4">
        <h2 className="font-display text-xl font-semibold text-ink">More writing</h2>
        <div className="h-px flex-1 bg-line" />
      </div>

      <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {feed.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      <div className="mt-16 flex justify-center">
        <Link
          href="/archive"
          className="rounded-full border border-ink px-6 py-2.5 text-sm text-ink transition hover:bg-ink hover:text-paper"
        >
          Browse all writing →
        </Link>
      </div>
    </div>
  );
}
