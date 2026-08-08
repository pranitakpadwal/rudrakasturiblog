import { duotoneForSlug, getBannerTitle } from "@/lib/content";

export default function PostBanner({ slug, title }: { slug: string; title: string }) {
  const [from, to] = duotoneForSlug(slug);
  const bannerTitle = getBannerTitle(slug, title);

  return (
    <div
      className="relative flex aspect-[21/9] w-full items-end overflow-hidden rounded-2xl p-6 sm:p-10"
      style={{ background: `linear-gradient(155deg, ${from}, ${to})` }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Ccircle cx='1' cy='1' r='1' fill='white'/%3E%3C/svg%3E\")",
        }}
      />
      <h2 className="relative max-w-3xl font-display text-xl font-bold leading-[1.1] tracking-tight text-white sm:text-3xl">
        {bannerTitle}
      </h2>
    </div>
  );
}
