import { NextRequest, NextResponse } from "next/server";

// STUB: this only validates and acknowledges the request — it does not
// actually store the email anywhere yet. Wire this up to a real provider
// (Buttondown, ConvertKit, Mailchimp, etc.) before relying on it to
// collect subscribers. See the account's API and drop the call in below.
export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
