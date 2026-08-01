import { gradientForSlug } from "@/lib/content";

export default function PostBanner({
  title,
  slug,
}: {
  title: string;
  slug: string;
}) {
  const gradient = gradientForSlug(slug);
  return (
    <div
      className={`flex aspect-[21/9] w-full items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} p-8 text-center shadow-sm`}
    >
      <h2 className="text-2xl font-semibold text-white drop-shadow-sm sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}
