import { getArticleSummary } from "@/lib/content";

export default function QuickTake({ slug }: { slug: string }) {
  const summary = getArticleSummary(slug);
  if (!summary) return null;

  return (
    <div className="not-prose my-8 rounded-xl border border-line bg-paper p-5">
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.15em] text-accent">
        Quick take
      </p>
      <p className="text-sm leading-relaxed text-ink">{summary}</p>
    </div>
  );
}
