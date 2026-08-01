import { NextRequest, NextResponse } from "next/server";
import { askClaude, isAskConfigured, searchBlogPosts, searchWeb } from "@/lib/ask";

export async function POST(req: NextRequest) {
  const { question } = await req.json();

  if (typeof question !== "string" || question.trim().length < 3) {
    return NextResponse.json({ error: "Ask a real question." }, { status: 400 });
  }

  if (!isAskConfigured()) {
    return NextResponse.json(
      { error: "Ask isn't set up yet — check back soon." },
      { status: 503 }
    );
  }

  try {
    const blogSources = searchBlogPosts(question, 4);
    const webSources = await searchWeb(question);
    const answer = await askClaude(question, blogSources, webSources);

    return NextResponse.json({ answer, blogSources, webSources });
  } catch (err) {
    console.error("Ask failed:", err);
    return NextResponse.json({ error: "Something went wrong — try again." }, { status: 500 });
  }
}
