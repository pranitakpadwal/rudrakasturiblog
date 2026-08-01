import { duotoneForSlug } from "@/lib/content";

export default function PostBanner({
  title,
  slug,
  category,
}: {
  title: string;
  slug: string;
  category?: string;
}) {
  const [from, to] = duotoneForSlug(slug);

  return (
    <div
      className="relative flex aspect-[16/9] w-full flex-col justify-end overflow-hidden rounded-2xl p-8"
      style={{ background: `linear-gradient(155deg, ${from}, ${to})` }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Ccircle cx='1' cy='1' r='1' fill='white'/%3E%3C/svg%3E\")",
        }}
      />
      {category && (
        <span className="mb-3 w-fit rounded-full border border-white/30 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/90">
          {category}
        </span>
      )}
      <h2 className="font-display text-2xl font-semibold leading-tight text-white sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}
