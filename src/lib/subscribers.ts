import { createHmac } from "crypto";
import { renderEmailShell } from "./emailTemplate";

// Storage: a JSON file in a dedicated branch of this same GitHub repo,
// read/written via GitHub's Contents API. No third-party database, no
// signup beyond a free GitHub Personal Access Token: GitHub never
// requires payment for PATs. Using a separate branch (not the Vercel
// production branch) so subscribe requests don't trigger site rebuilds.
const GITHUB_TOKEN = process.env.SUBSCRIBERS_GITHUB_TOKEN;
const GITHUB_REPO = process.env.SUBSCRIBERS_GITHUB_REPO; // "owner/repo"
const GITHUB_BRANCH = process.env.SUBSCRIBERS_GITHUB_BRANCH ?? "subscribers-data";
const GITHUB_PATH = process.env.SUBSCRIBERS_GITHUB_PATH ?? "subscribers.json";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "newsletter@blog.rudrakasturi.com";
const UNSUBSCRIBE_SECRET = process.env.UNSUBSCRIBE_SECRET ?? "dev-only-secret-change-me";
const SITE_URL = "https://blog.rudrakasturi.com";

export function isSubscriberStoreConfigured(): boolean {
  return Boolean(GITHUB_TOKEN && GITHUB_REPO);
}

export function isEmailSendConfigured(): boolean {
  return Boolean(RESEND_API_KEY);
}

export function unsubscribeToken(email: string): string {
  return createHmac("sha256", UNSUBSCRIBE_SECRET).update(email.toLowerCase()).digest("hex");
}

interface SubscriberRecord {
  email: string;
  source: string;
  created_at: string;
}

function githubHeaders() {
  return {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };
}

function contentsUrl(): string {
  return `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_PATH}`;
}

async function readFile(): Promise<{ records: SubscriberRecord[]; sha: string | null }> {
  const res = await fetch(`${contentsUrl()}?ref=${GITHUB_BRANCH}`, {
    headers: githubHeaders(),
    cache: "no-store",
  });

  if (res.status === 404) {
    return { records: [], sha: null };
  }
  if (!res.ok) {
    throw new Error(`GitHub read failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  const decoded = Buffer.from(data.content, "base64").toString("utf-8");
  return { records: JSON.parse(decoded || "[]"), sha: data.sha };
}

async function writeFile(records: SubscriberRecord[], sha: string | null, message: string): Promise<void> {
  const content = Buffer.from(JSON.stringify(records, null, 2)).toString("base64");

  const res = await fetch(contentsUrl(), {
    method: "PUT",
    headers: githubHeaders(),
    body: JSON.stringify({
      message,
      content,
      branch: GITHUB_BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!res.ok) {
    throw new Error(`GitHub write failed: ${res.status} ${await res.text()}`);
  }
}

function assertConfigured() {
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    throw new Error("Subscriber store not configured");
  }
}

// Retries once on a 409 (someone else wrote the file between our read and
// write) by re-reading and re-applying the mutation.
async function withRetry<T>(mutate: () => Promise<T>): Promise<T> {
  try {
    return await mutate();
  } catch (err) {
    if (err instanceof Error && err.message.includes("409")) {
      return mutate();
    }
    throw err;
  }
}

export async function addSubscriber(
  email: string,
  source: string
): Promise<"added" | "duplicate"> {
  assertConfigured();
  const normalized = email.toLowerCase();

  return withRetry(async () => {
    const { records, sha } = await readFile();
    if (records.some((r) => r.email === normalized)) return "duplicate";

    records.push({ email: normalized, source, created_at: new Date().toISOString() });
    await writeFile(records, sha, `Add subscriber ${normalized}`);
    return "added";
  });
}

export async function removeSubscriber(email: string): Promise<void> {
  assertConfigured();
  const normalized = email.toLowerCase();

  await withRetry(async () => {
    const { records, sha } = await readFile();
    const filtered = records.filter((r) => r.email !== normalized);
    if (filtered.length === records.length) return;
    await writeFile(filtered, sha, `Remove subscriber ${normalized}`);
  });
}

export async function listSubscriberEmails(): Promise<string[]> {
  assertConfigured();
  const { records } = await readFile();
  return records.map((r) => r.email);
}

// Resend's batch endpoint caps at 100 recipients per call.
const BATCH_SIZE = 100;

export async function broadcastEmail(
  subject: string,
  html: (email: string) => string
): Promise<{ sent: number }> {
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
      html: renderEmailShell({
        eyebrow: "Welcome",
        heading: "You're on the list.",
        bodyHtml: `
          <p>Thanks for subscribing to Rudra Kasturi: SEO, AEO, and AI search, without the fluff.</p>
          <p>New posts will land in your inbox as they go up.</p>
        `,
        unsubscribeUrl,
      }),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend send failed: ${res.status} ${body}`);
  }
}
