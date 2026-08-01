import { duotoneForSlug } from "@/lib/content";

export default function PostBanner({ slug }: { slug: string }) {
  const [from, to] = duotoneForSlug(slug);

  return (
    <div
      className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl"
      style={{ background: `linear-gradient(155deg, ${from}, ${to})` }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Ccircle cx='1' cy='1' r='1' fill='white'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
