import Link from "next/link";
import type { ContentItem } from "@/lib/content";
import { categoryColor, categorySlug, readingTime, formatDateIST } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";

export const CATEGORY_PAGE_SIZE = 24;

export function categoryPageHref(name: string, page: number): string {
  const base = `/category/${categorySlug(name)}`;
  return page <= 1 ? base : `${base}/page/${page}`;
}

export default function CategoryPageView({
  name,
  posts,
  total,
  page,
  totalPages,
}: {
  name: string;
  posts: ContentItem[];
  total: number;
  page: number;
  totalPages: number;
}) {
  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: name }]} />
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">
        Category
      </p>
      <h1 className="font-display text-4xl font-semibold text-ink">{name}</h1>
      <p className="mt-3 text-ink-soft">
        {total} posts{totalPages > 1 ? ` · page ${page} of ${totalPages}` : ""}
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/${post.slug}`}
            style={{ borderLeftColor: categoryColor(name) }}
            className="group block rounded-md border border-line border-l-4 bg-paper p-4 transition hover:shadow-sm"
          >
            <h3 className="font-display text-base font-semibold leading-snug text-ink group-hover:text-accent">
              {post.title}
            </h3>
            <p className="mt-2 text-sm text-ink-soft">
              {formatDateIST(post.date)} · {readingTime(post.content_md)} min read
            </p>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="mt-12 flex items-center justify-center gap-4 border-t border-line pt-8"
        >
          {page > 1 ? (
            <Link
              href={categoryPageHref(name, page - 1)}
              className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft transition hover:border-accent hover:text-accent"
            >
              ← Newer
            </Link>
          ) : (
            <span className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft/40">
              ← Newer
            </span>
          )}
          <span className="font-mono text-xs text-ink-soft">
            {page} / {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={categoryPageHref(name, page + 1)}
              className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft transition hover:border-accent hover:text-accent"
            >
              Older →
            </Link>
          ) : (
            <span className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft/40">
              Older →
            </span>
          )}
        </nav>
      )}
    </div>
  );
}
