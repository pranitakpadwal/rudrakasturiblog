import { createHmac } from "crypto";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "newsletter@blog.rudrakasturi.com";
const UNSUBSCRIBE_SECRET = process.env.UNSUBSCRIBE_SECRET ?? "dev-only-secret-change-me";
const SITE_URL = "https://blog.rudrakasturi.com";

export function isSubscriberStoreConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

export function isEmailSendConfigured(): boolean {
  return Boolean(RESEND_API_KEY);
}

export function unsubscribeToken(email: string): string {
  return createHmac("sha256", UNSUBSCRIBE_SECRET).update(email.toLowerCase()).digest("hex");
}

// Upserts into a `subscribers` table (email text primary key, created_at
// timestamptz default now(), source text). Returns "added" | "duplicate".
export async function addSubscriber(
  email: string,
  source: string
): Promise<"added" | "duplicate"> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Subscriber store not configured");
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/subscribers`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=ignore-duplicates,return=representation",
    },
    body: JSON.stringify({ email: email.toLowerCase(), source }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase insert failed: ${res.status} ${body}`);
  }

  const rows = await res.json();
  return Array.isArray(rows) && rows.length > 0 ? "added" : "duplicate";
}

export async function removeSubscriber(email: string): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Subscriber store not configured");
  }

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/subscribers?email=eq.${encodeURIComponent(email.toLowerCase())}`,
    {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase delete failed: ${res.status} ${body}`);
  }
}

export async function listSubscriberEmails(): Promise<string[]> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Subscriber store not configured");
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/subscribers?select=email`, {
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase list failed: ${res.status} ${body}`);
  }

  const rows: { email: string }[] = await res.json();
  return rows.map((r) => r.email);
}

// Resend's batch endpoint caps at 100 recipients per call.
const BATCH_SIZE = 100;

export async function broadcastEmail(subject: string, html: (email: string) => string): Promise<{ sent: number }> {
  if (!RESEND_API_KEY) throw new Error("Email sending not configured");

  const emails = await listSubscriberEmails();
  let sent = 0;

  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const batch = emails.slice(i, i + BATCH_SIZE);
    const res = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        batch.map((email) => ({
          from: `Rudra Kasturi <${RESEND_FROM_EMAIL}>`,
          to: email,
          subject,
          html: html(email),
        }))
      ),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Resend broadcast failed: ${res.status} ${body}`);
    }
    sent += batch.length;
  }

  return { sent };
}

export async function sendWelcomeEmail(email: string): Promise<void> {
  if (!RESEND_API_KEY) throw new Error("Email sending not configured");

  const token = unsubscribeToken(email);
  const unsubscribeUrl = `${SITE_URL}/api/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Rudra Kasturi <${RESEND_FROM_EMAIL}>`,
      to: email,
      subject: "You're on the list",
      html: `
        <p>Thanks for subscribing to Rudra Kasturi — SEO, AEO, and AI search, without the fluff.</p>
        <p>New posts will land in your inbox as they go up.</p>
        <p style="margin-top:32px;font-size:12px;color:#888">
          Didn't ask for this? <a href="${unsubscribeUrl}">Unsubscribe</a>
        </p>
      `,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend send failed: ${res.status} ${body}`);
  }
}
