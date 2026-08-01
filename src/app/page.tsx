import Link from "next/link";
import { getAllPosts, duotoneForSlug, readingTime } from "@/lib/content";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Home() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;
  const feed = rest.slice(0, 11);

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <div className="mb-14 max-w-2xl">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Search · Strategy · AI
        </p>
        <h1 className="font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
          Notes on search, AI, and building an edge before everyone else has one.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">
          Search. Strategy. AI. Growth. Coach. Revenue.
        </p>
      </div>

      {featured && (
        <Link href={`/${featured.slug}`} className="group mb-16 grid gap-8 sm:grid-cols-2 sm:items-center">
          <div
            className="aspect-[4/3] w-full rounded-2xl"
            style={{
              background: `linear-gradient(155deg, ${duotoneForSlug(featured.slug)[0]}, ${duotoneForSlug(featured.slug)[1]})`,
            }}
          />
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-wide text-ink-soft">
              Latest · {formatDate(featured.date)} · {readingTime(featured.content_md)} min read
            </p>
            <h2 className="font-display text-3xl font-semibold leading-snug text-ink group-hover:text-accent">
              {featured.title}
            </h2>
            {featured.excerpt && (
              <p className="mt-3 text-ink-soft leading-relaxed">{featured.excerpt}</p>
            )}
            {featured.categories.length > 0 && (
              <p className="mt-4 text-sm text-accent">
                {featured.categories.join(" · ")}
              </p>
            )}
          </div>
        </Link>
      )}

      <div className="mb-8 flex items-center gap-4">
        <h2 className="font-display text-xl font-semibold text-ink">More writing</h2>
        <div className="h-px flex-1 bg-line" />
      </div>

      <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {feed.map((post) => {
          const [from, to] = duotoneForSlug(post.slug);
          return (
            <Link key={post.slug} href={`/${post.slug}`} className="group block">
              <div
                className="mb-4 aspect-[4/3] w-full rounded-xl"
                style={{ background: `linear-gradient(155deg, ${from}, ${to})` }}
              />
              {post.categories[0] && (
                <p className="mb-1.5 font-mono text-xs uppercase tracking-wide text-accent">
                  {post.categories[0]}
                </p>
              )}
              <h3 className="font-display text-lg font-semibold leading-snug text-ink group-hover:text-accent">
                {post.title}
              </h3>
              <p className="mt-1.5 text-sm text-ink-soft">
                {formatDate(post.date)} · {readingTime(post.content_md)} min read
              </p>
            </Link>
          );
        })}
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
