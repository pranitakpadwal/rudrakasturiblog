import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/content";
import { broadcastEmail, isEmailSendConfigured, unsubscribeToken } from "@/lib/subscribers";

const SITE_URL = "https://blog.rudrakasturi.com";
const ADMIN_SECRET = process.env.NEWSLETTER_ADMIN_SECRET;

// Manually triggered: POST { slug, secret } and every subscriber gets an
// email pointing at that post. Not wired to auto-fire on publish yet —
// call it (or ask me to) whenever a new post should go out.
export async function POST(req: NextRequest) {
  if (!ADMIN_SECRET) {
    return NextResponse.json({ error: "NEWSLETTER_ADMIN_SECRET not set" }, { status: 503 });
  }

  const { slug, secret } = await req.json();

  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isEmailSendConfigured()) {
    return NextResponse.json({ error: "Email sending not configured" }, { status: 503 });
  }

  const post = getPostBySlug(slug);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const url = `${SITE_URL}/${post.slug}`;

  try {
    const { sent } = await broadcastEmail(post.title, (email) => {
      const unsubscribeUrl = `${SITE_URL}/api/unsubscribe?email=${encodeURIComponent(email)}&token=${unsubscribeToken(email)}`;
      return `
        <p><strong>${post.title}</strong></p>
        <p>${post.excerpt || ""}</p>
        <p><a href="${url}">Read it here →</a></p>
        <p style="margin-top:32px;font-size:12px;color:#888">
          <a href="${unsubscribeUrl}">Unsubscribe</a>
        </p>
      `;
    });

    return NextResponse.json({ ok: true, sent });
  } catch (err) {
    console.error("Broadcast failed:", err);
    return NextResponse.json({ error: "Broadcast failed" }, { status: 500 });
  }
}
