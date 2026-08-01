"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { PostSummary } from "@/lib/content";

const PAGE_SIZE = 24;

function colorFromString(input: string, palette: string[]): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return palette[Math.abs(hash) % palette.length];
}

const CATEGORY_COLORS = [
  "#7a5c3e",
  "#3d6b56",
  "#4a5a7a",
  "#7a3e4a",
  "#5c5c3e",
  "#3e6b7a",
  "#6b4a7a",
  "#7a6b3e",
];

export default function InfiniteGrid({ posts }: { posts: PostSummary[] }) {
  const [count, setCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCount((c) => Math.min(c + PAGE_SIZE, posts.length));
        }
      },
      { rootMargin: "600px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [posts.length]);

  const visible = posts.slice(0, count);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((post) => (
          <Link
            key={post.slug}
            href={`/${post.slug}`}
            style={{ borderLeftColor: colorFromString(post.category, CATEGORY_COLORS) }}
            className="group block rounded-md border border-line border-l-4 bg-paper p-4 transition hover:border-line hover:shadow-sm"
          >
            {post.category && (
              <p className="mb-1 font-mono text-[11px] uppercase tracking-wide text-ink-soft">
                {post.category}
              </p>
            )}
            <h3 className="font-display text-base font-semibold leading-snug text-ink group-hover:text-accent">
              {post.title}
            </h3>
          </Link>
        ))}
      </div>

      {count < posts.length && (
        <div ref={sentinelRef} className="flex justify-center py-10">
          <span className="font-mono text-xs text-ink-soft">Loading more…</span>
        </div>
      )}
    </div>
  );
}
