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
    <Link href={`/${slug}`} className={`group block ${featured ? "sm:col-span-2" : ""}`}>
      <div
        className={`relative flex w-full flex-col justify-between overflow-hidden rounded-lg p-4 transition group-hover:brightness-110 ${
          featured ? "aspect-[16/9] sm:p-8" : "aspect-[4/3] sm:p-5"
        }`}
        style={{ background: color }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='90'%3E%3Ccircle cx='1' cy='1' r='1' fill='white'/%3E%3C/svg%3E\")",
          }}
        />
        {category && (
          <span className="relative font-mono text-[10px] uppercase tracking-wide text-white/75">
            {category}
          </span>
        )}
        <h3
          className={`relative font-display font-bold leading-[1.05] tracking-tight text-white ${
            featured ? "text-2xl sm:text-4xl" : "text-lg sm:text-xl"
          }`}
        >
          {title}
        </h3>
      </div>

      {meta && <span className="mt-2 block font-mono text-xs text-ink-soft">{meta}</span>}
      {blurb && (
        <p className={`mt-1 leading-snug text-ink-soft ${featured ? "max-w-2xl text-base" : "text-sm"}`}>
          {blurb}
        </p>
      )}
    </Link>
  );
}
