import Link from "next/link";
import { categoryColor } from "@/lib/palette";

export default function PostCard({
  slug,
  category,
  title,
  blurb,
  meta,
  featured = false,
}: {
  slug: string;
  category: string;
  title: string;
  blurb?: string;
  meta?: string;
  featured?: boolean;
}) {
  const color = categoryColor(category);

  return (
    <Link
      href={`/${slug}`}
      style={{ borderTopColor: color }}
      className={`group flex flex-col rounded-lg border border-line border-t-4 bg-paper p-5 transition hover:border-line hover:shadow-md hover:shadow-black/5 ${
        featured ? "sm:col-span-2 sm:p-8" : ""
      }`}
    >
      {category && (
        <span
          className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-wide"
          style={{ color }}
        >
          {category}
        </span>
      )}
      <h3
        className={`font-display font-bold leading-[1.1] tracking-tight text-ink group-hover:text-accent ${
          featured ? "text-2xl sm:text-4xl" : "text-lg"
        }`}
      >
        {title}
      </h3>
      {blurb && (
        <p
          className={`mt-2 leading-snug text-ink-soft ${featured ? "max-w-2xl text-base" : "text-sm"}`}
        >
          {blurb}
        </p>
      )}
      {meta && <span className="mt-3 font-mono text-xs text-ink-soft">{meta}</span>}
    </Link>
  );
}
