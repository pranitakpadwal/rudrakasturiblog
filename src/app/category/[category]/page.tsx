import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllCategories,
  getPostsByCategory,
  categorySlug,
  duotoneForSlug,
  readingTime,
  formatDateIST,
} from "@/lib/content";

export async function generateStaticParams() {
  return getAllCategories().map((c) => ({ category: categorySlug(c) }));
}

function resolveCategory(slug: string): string | undefined {
  return getAllCategories().find((c) => categorySlug(c) === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const name = resolveCategory(category);
  if (!name) return {};
  return {
    title: name,
    description: `Posts about ${name} from Rudra Kasturi.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const name = resolveCategory(category);
  if (!name) notFound();

  const posts = getPostsByCategory(name);

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">
        Category
      </p>
      <h1 className="font-display text-4xl font-semibold text-ink">{name}</h1>
      <p className="mt-3 text-ink-soft">{posts.length} posts</p>

      <div className="mt-12 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const [from, to] = duotoneForSlug(post.slug);
          return (
            <Link
              key={post.slug}
              href={`/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-line transition hover:shadow-md hover:shadow-black/5"
            >
              <div
                className="aspect-[4/3] w-full"
                style={{ background: `linear-gradient(155deg, ${from}, ${to})` }}
              />
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-lg font-semibold leading-snug text-ink group-hover:text-accent">
                  {post.title}
                </h3>
                <p className="mt-auto pt-3 text-sm text-ink-soft">
                  {formatDateIST(post.date)} · {readingTime(post.content_md)} min read
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
