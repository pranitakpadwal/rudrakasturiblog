import { ImageResponse } from "next/og";
import { getPageBySlug, getPostBySlug } from "@/lib/content";

export const alt = "Rudra Kasturi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const GRADIENT_STOPS: [string, string][] = [
  ["#f43f5e", "#6366f1"],
  ["#f59e0b", "#f43f5e"],
  ["#10b981", "#06b6d4"],
  ["#6366f1", "#ec4899"],
  ["#0ea5e9", "#6366f1"],
  ["#84cc16", "#10b981"],
];

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getPostBySlug(slug) ?? getPageBySlug(slug);
  const title = item?.title ?? "Rudra Kasturi";
  const [from, to] = GRADIENT_STOPS[hashString(slug) % GRADIENT_STOPS.length];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          background: `linear-gradient(135deg, ${from}, ${to})`,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "white",
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
      </div>
    ),
    { ...size }
  );
}
