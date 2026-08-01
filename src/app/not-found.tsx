import Link from "next/link";
import { getTopPosts } from "@/lib/content";

export default function NotFound() {
  const topPosts = getTopPosts().slice(0, 5);

  return (
    <div className="mx-auto max-w-lg px-5 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">404</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink">
        This page got lost in a query fan-out.
      </h1>
      <p className="mt-3 text-ink-soft">
        The URL split into sub-questions and none of them led anywhere. Try one of these
        instead.
      </p>

      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition hover:bg-accent"
      >
        Back to homepage
      </Link>

      {topPosts.length > 0 && (
        <div className="mt-12 text-left">
          <p className="mb-3 font-mono text-xs uppercase tracking-wide text-ink-soft">
            Or read one of these
          </p>
          <ul className="flex flex-col gap-2.5">
            {topPosts.map((post) => (
              <li key={post.slug}>
                <Link href={`/${post.slug}`} className="text-ink hover:text-accent">
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
