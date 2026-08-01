import Link from "next/link";
import { getAllPosts, getTopPosts, formatShortDateIST, categoryColor } from "@/lib/content";
import HeroSlider from "@/components/HeroSlider";

const SLIDER_COUNT = 5;
const LATEST_COUNT = 16;

export default function Home() {
  const posts = getAllPosts();
  const slides = posts.slice(0, SLIDER_COUNT).map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.categories[0] ?? "",
  }));
  const sliderSlugs = new Set(slides.map((s) => s.slug));
  const mustRead = getTopPosts().slice(0, 4);
  const mustReadSlugs = new Set(mustRead.map((p) => p.slug));
  const latest = posts
    .filter((p) => !sliderSlugs.has(p.slug) && !mustReadSlugs.has(p.slug))
    .slice(0, LATEST_COUNT);

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          Make search fun.
        </h1>
      </div>

      <HeroSlider slides={slides} />

      {mustRead.length > 0 && (
        <>
          <div className="mt-12 mb-6 flex items-center gap-4">
            <h2 className="font-display text-xl font-semibold text-ink">Don&apos;t miss these</h2>
            <div className="h-px flex-1 bg-line" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {mustRead.map((post) => (
              <Link
                key={post.slug}
                href={`/${post.slug}`}
                style={{ borderLeftColor: categoryColor(post.categories[0] ?? "") }}
                className="group block rounded-md border border-line border-l-4 bg-paper p-4 transition hover:shadow-sm"
              >
                {post.categories[0] && (
                  <p className="mb-1 font-mono text-[11px] uppercase tracking-wide text-ink-soft">
                    {post.categories[0]}
                  </p>
                )}
                <h3 className="font-display text-base font-semibold leading-snug text-ink group-hover:text-accent">
                  {post.title}
                </h3>
              </Link>
            ))}
          </div>
        </>
      )}

      <div className="mt-12 mb-6 flex items-center gap-4">
        <h2 className="font-display text-xl font-semibold text-ink">Latest</h2>
        <div className="h-px flex-1 bg-line" />
      </div>

      <ul className="flex flex-col divide-y divide-line">
        {latest.map((post) => (
          <li key={post.slug} className="py-4">
            <Link href={`/${post.slug}`} className="group flex flex-col gap-1">
              <div className="flex items-baseline gap-3">
                {post.categories[0] && (
                  <span className="font-mono text-xs uppercase tracking-wide text-ink-soft">
                    {post.categories[0]}
                  </span>
                )}
                <span className="font-mono text-xs text-ink-soft">
                  {formatShortDateIST(post.date)}
                </span>
              </div>
              <span className="font-display text-lg font-semibold leading-snug text-ink group-hover:text-accent">
                {post.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex justify-center">
        <Link
          href="/archive"
          className="rounded-full border border-line px-5 py-2 text-sm text-ink-soft transition hover:border-accent hover:text-accent"
        >
          Browse the full archive ({posts.length} posts) →
        </Link>
      </div>
    </div>
  );
}
