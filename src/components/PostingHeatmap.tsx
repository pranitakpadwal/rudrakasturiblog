import { categoryColor } from "@/lib/palette";

interface DayCount {
  date: string;
  count: number;
}

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default function PostingHeatmap({ dates }: { dates: string[] }) {
  if (dates.length === 0) return null;

  const counts = new Map<string, number>();
  for (const d of dates) {
    const key = d.slice(0, 10);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const sorted = [...dates].sort();
  const start = new Date(sorted[0].slice(0, 10) + "T00:00:00Z");
  const end = new Date(sorted[sorted.length - 1].slice(0, 10) + "T00:00:00Z");

  // Align to the Sunday on/before start so weeks form clean columns.
  const gridStart = new Date(start);
  gridStart.setUTCDate(gridStart.getUTCDate() - gridStart.getUTCDay());

  const days: DayCount[] = [];
  for (let d = new Date(gridStart); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const key = toDateKey(d);
    days.push({ date: key, count: counts.get(key) ?? 0 });
  }

  const weeks: DayCount[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const maxCount = Math.max(...days.map((d) => d.count), 1);
  const accent = categoryColor("heatmap");

  function cellColor(count: number): string {
    if (count === 0) return "var(--color-line)";
    const intensity = Math.min(1, count / maxCount);
    const alpha = 0.25 + intensity * 0.75;
    return accent.startsWith("#")
      ? `color-mix(in srgb, ${accent} ${Math.round(alpha * 100)}%, transparent)`
      : accent;
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-[3px]">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day) => (
              <div
                key={day.date}
                title={`${day.date}: ${day.count} post${day.count === 1 ? "" : "s"}`}
                className="h-[10px] w-[10px] rounded-[2px]"
                style={{ background: cellColor(day.count) }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
