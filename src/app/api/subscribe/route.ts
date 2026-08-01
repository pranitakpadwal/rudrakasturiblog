import { NextRequest, NextResponse } from "next/server";
import {
  addSubscriber,
  isEmailSendConfigured,
  isSubscriberStoreConfigured,
  sendWelcomeEmail,
} from "@/lib/subscribers";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  if (!isSubscriberStoreConfigured()) {
    // Subscriber storage isn't wired up yet (SUPABASE_URL /
    // SUPABASE_SERVICE_ROLE_KEY missing) — tell the caller plainly
    // instead of pretending the email was captured.
    return NextResponse.json(
      { error: "Subscriptions aren't set up yet — check back soon." },
      { status: 503 }
    );
  }

  try {
    const result = await addSubscriber(email, "homepage-modal");

    if (result === "added" && isEmailSendConfigured()) {
      // Best-effort — a failed welcome email shouldn't fail the signup.
      sendWelcomeEmail(email).catch((err) => console.error("Welcome email failed:", err));
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Subscribe failed:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
