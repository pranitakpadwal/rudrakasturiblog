import { NextRequest, NextResponse } from "next/server";
import { getNextArticle, readingTime, formatShortDateIST } from "@/lib/content";
import { autoLinkContent } from "@/lib/interlink";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const exclude = req.nextUrl.searchParams.get("exclude")?.split(",").filter(Boolean) ?? [];
  const next = getNextArticle(slug, exclude);

  if (!next) return NextResponse.json({ done: true });

  return NextResponse.json({
    slug: next.slug,
    title: next.title,
    category: next.categories[0] ?? "",
    date: formatShortDateIST(next.date),
    readingTimeMin: readingTime(next.content_md),
    contentMd: autoLinkContent(next.content_md, next.slug),
  });
}
