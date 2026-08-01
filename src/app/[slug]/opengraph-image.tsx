import { ImageResponse } from "next/og";
import { getPageBySlug, getPostBySlug, duotoneForSlug } from "@/lib/content";

export const alt = "Rudra Kasturi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getPostBySlug(slug) ?? getPageBySlug(slug);
  const title = item?.title ?? "Rudra Kasturi";
  const [from, to] = duotoneForSlug(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: `linear-gradient(155deg, ${from}, ${to})`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: 999,
              background: "rgba(255,255,255,0.15)",
              color: "white",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            R
          </div>
          <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 26 }}>
            Rudra Kasturi
          </div>
        </div>
        <div
          style={{
            fontSize: 58,
            fontWeight: 700,
            color: "white",
            lineHeight: 1.25,
            maxWidth: 980,
          }}
        >
          {title}
        </div>
      </div>
    ),
    { ...size }
  );
}
