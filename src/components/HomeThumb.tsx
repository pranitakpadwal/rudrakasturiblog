import { categoryColor } from "@/lib/palette";

export default function HomeThumb({
  category,
  className = "",
}: {
  category: string;
  className?: string;
}) {
  const color = categoryColor(category);
  const initial = (category || "R").charAt(0).toUpperCase();

  return (
    <div
      className={`relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-lg ${className}`}
      style={{ background: color }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='90'%3E%3Ccircle cx='1' cy='1' r='1' fill='white'/%3E%3C/svg%3E\")",
        }}
      />
      <span className="font-display text-4xl font-semibold text-white/90">{initial}</span>
      {category && (
        <span className="absolute bottom-2 left-3 font-mono text-[10px] uppercase tracking-wide text-white/80">
          {category}
        </span>
      )}
    </div>
  );
}
