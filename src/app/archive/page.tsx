import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Archive",
  description: "Every post from Rudra Kasturi, newest first.",
};

export default function ArchivePage() {
  const posts = getAllPosts();
  const byYear = new Map<string, typeof posts>();
  for (const post of posts) {
    const year = post.date.slice(0, 4);
    byYear.set(year, [...(byYear.get(year) ?? []), post]);
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <h1 className="font-display text-4xl font-semibold text-ink">Archive</h1>
      <p className="mt-3 text-ink-soft">{posts.length} posts, newest first.</p>

      <div className="mt-12 flex flex-col gap-12">
        {[...byYear.entries()].map(([year, yearPosts]) => (
          <section key={year}>
            <h2 className="mb-4 font-display text-2xl font-semibold text-accent">{year}</h2>
            <ul className="flex flex-col divide-y divide-line">
              {yearPosts.map((post) => (
                <li key={post.slug} className="py-3">
                  <Link
                    href={`/${post.slug}`}
                    className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline sm:gap-4"
                  >
                    <span className="text-ink hover:text-accent">{post.title}</span>
                    <span className="shrink-0 font-mono text-xs text-ink-soft">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
