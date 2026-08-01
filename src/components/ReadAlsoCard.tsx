import Link from "next/link";
import type { ContentItem } from "@/lib/content";
import { categoryColor } from "@/lib/content";

export default function ReadAlsoCard({ post }: { post: ContentItem }) {
  const category = post.categories[0] ?? "";
  return (
    <Link
      href={`/${post.slug}`}
      style={{ borderLeftColor: categoryColor(category) }}
      className="not-prose group my-8 flex flex-col gap-1 rounded-md border border-line border-l-4 bg-paper p-4 no-underline transition hover:shadow-sm"
    >
      <span className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">
        Read also
      </span>
      <span className="font-display text-base font-semibold leading-snug text-ink group-hover:text-accent">
        {post.title}
      </span>
    </Link>
  );
}
