import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/content";

export async function GET() {
  const index = getAllPosts().map((p) => ({ slug: p.slug, title: p.title }));
  return NextResponse.json(index, {
    headers: { "Cache-Control": "public, max-age=3600" },
  });
}
