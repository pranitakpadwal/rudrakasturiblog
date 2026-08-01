import { NextRequest, NextResponse } from "next/server";
import { removeSubscriber, unsubscribeToken } from "@/lib/subscribers";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const token = req.nextUrl.searchParams.get("token");

  if (!email || !token || unsubscribeToken(email) !== token) {
    return new NextResponse("Invalid or expired unsubscribe link.", { status: 400 });
  }

  try {
    await removeSubscriber(email);
    return new NextResponse("You've been unsubscribed. Sorry to see you go.", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (err) {
    console.error("Unsubscribe failed:", err);
    return new NextResponse("Something went wrong: try again shortly.", { status: 500 });
  }
}
