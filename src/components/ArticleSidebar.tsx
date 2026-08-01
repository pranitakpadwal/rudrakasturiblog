import Link from "next/link";
import {
  getTopPosts,
  getRecentPosts,
  getCategoryCloud,
  categorySlug,
} from "@/lib/content";

function WidgetTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.15em] text-ink-soft">
      {children}
    </h3>
  );
}

export default function ArticleSidebar({ currentSlug }: { currentSlug: string }) {
  const topPosts = getTopPosts();
  const recentPosts = getRecentPosts(currentSlug, 8);
  const cloud = getCategoryCloud();
  const maxCount = Math.max(...cloud.map((c) => c.count));

  return (
    <aside className="flex flex-col gap-10">
      {topPosts.length > 0 && (
        <div>
          <WidgetTitle>Top Posts &amp; Pages</WidgetTitle>
          <ul className="flex flex-col gap-3">
            {topPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/${post.slug}`}
                  className="text-sm leading-snug text-ink transition hover:text-accent"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <WidgetTitle>Most Recent</WidgetTitle>
        <ul className="flex flex-col gap-3">
          {recentPosts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/${post.slug}`}
                className="text-sm leading-snug text-ink transition hover:text-accent"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <WidgetTitle>Category Cloud</WidgetTitle>
        <div className="flex flex-wrap gap-x-2 gap-y-2">
          {cloud.map(({ name, count }) => {
            const scale = 0.75 + (count / maxCount) * 0.75;
            return (
              <Link
                key={name}
                href={`/category/${categorySlug(name)}`}
                style={{ fontSize: `${scale}rem` }}
                className="text-ink-soft transition hover:text-accent"
              >
                {name}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
