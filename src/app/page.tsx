import Link from "next/link";
import { getAllPosts, getTopPosts, getHomeCurated, formatShortDateIST } from "@/lib/content";
import HeroSlider from "@/components/HeroSlider";
import HomeThumb from "@/components/HomeThumb";
import HomeSidebar from "@/components/HomeSidebar";
import AskPopup from "@/components/AskPopup";

const SLIDER_COUNT = 5;
const LATEST_COUNT = 16;

export default function Home() {
  const posts = getAllPosts();
  const slides = posts.slice(0, SLIDER_COUNT).map((p) => {
    const curated = getHomeCurated(p.slug);
    return {
      slug: p.slug,
      title: curated?.teaser ?? p.title,
      excerpt: curated?.blurb ?? p.excerpt,
      category: p.categories[0] ?? "",
    };
  });
  const sliderSlugs = new Set(slides.map((s) => s.slug));
  const mustRead = getTopPosts().slice(0, 4);
  const mustReadSlugs = new Set(mustRead.map((p) => p.slug));
  const latest = posts
    .filter((p) => !sliderSlugs.has(p.slug) && !mustReadSlugs.has(p.slug))
    .slice(0, LATEST_COUNT);

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-5 py-10 lg:grid-cols-[minmax(0,1fr)_280px]">
      <AskPopup />
      <div className="min-w-0">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Make search fun.
          </h1>
        </div>

        <HeroSlider slides={slides} />

        {mustRead.length > 0 && (
          <>
            <div className="mt-12 mb-6 flex items-center gap-4">
              <h2 className="font-display text-xl font-semibold text-ink">
                Don&apos;t miss these
              </h2>
              <div className="h-px flex-1 bg-line" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {mustRead.map((post, i) => {
                const curated = getHomeCurated(post.slug);
                const featured = i === 0;
                return (
                  <Link
                    key={post.slug}
                    href={`/${post.slug}`}
                    className={`group block transition ${featured ? "sm:col-span-2" : ""}`}
                  >
                    <HomeThumb
                      category={post.categories[0] ?? ""}
                      title={curated?.teaser ?? post.title}
                      featured={featured}
                      className="transition group-hover:brightness-110"
                    />
                    {(curated?.blurb || post.excerpt) && (
                      <p
                        className={`mt-2 leading-snug text-ink-soft ${featured ? "max-w-2xl text-base" : "text-sm"}`}
                      >
                        {curated?.blurb ?? post.excerpt}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          </>
        )}

        <div className="mt-12 mb-6 flex items-center gap-4">
          <h2 className="font-display text-xl font-semibold text-ink">Latest</h2>
          <div className="h-px flex-1 bg-line" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {latest.map((post) => {
            const curated = getHomeCurated(post.slug);
            return (
              <Link key={post.slug} href={`/${post.slug}`} className="group block">
                <HomeThumb
                  category={post.categories[0] ?? ""}
                  title={curated?.teaser ?? post.title}
                  className="transition group-hover:brightness-110"
                />
                <span className="mt-2 block font-mono text-xs text-ink-soft">
                  {formatShortDateIST(post.date)}
                </span>
                {curated?.blurb && (
                  <p className="mt-1 text-sm leading-snug text-ink-soft">{curated.blurb}</p>
                )}
              </Link>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/archive"
            className="rounded-full border border-line px-5 py-2 text-sm text-ink-soft transition hover:border-accent hover:text-accent"
          >
            Browse the full archive ({posts.length} posts) →
          </Link>
        </div>
      </div>

      <div className="min-w-0 lg:sticky lg:top-24 lg:h-fit">
        <HomeSidebar />
      </div>
    </div>
  );
}
