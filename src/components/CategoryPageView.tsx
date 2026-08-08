import Link from "next/link";
import type { ContentItem } from "@/lib/content";
import { categorySlug, readingTime, formatDateIST } from "@/lib/content";
import { categoryBeat } from "@/content/categoryBeats";
import Breadcrumbs from "@/components/Breadcrumbs";
import PostCard from "@/components/PostCard";

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
      <h1 className="font-display text-5xl font-bold tracking-tight text-ink">{name}</h1>
      {categoryBeat(name) && (
        <p className="mt-2 max-w-2xl text-ink-soft">{categoryBeat(name)}</p>
      )}
      <p className="mt-3 font-mono text-xs uppercase tracking-wide text-ink-soft">
        {total} posts{totalPages > 1 ? ` · page ${page} of ${totalPages}` : ""}
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard
            key={post.slug}
            slug={post.slug}
            category={name}
            title={post.title}
            meta={`${formatDateIST(post.date)} · ${readingTime(post.content_md)} min read`}
          />
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
