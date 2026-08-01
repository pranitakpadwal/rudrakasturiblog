"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { gitaQuoteForIndex, GITA_QUOTE_COUNT } from "@/content/gitaQuotes";

const DISMISS_KEY = "rk-ask-dismissed";
const AUTO_SKIP_MS = 10000;
const QUOTE_ROTATE_MS = 4500;

interface AskResult {
  answer: string;
  blogSources: { slug: string; title: string }[];
  webSources: { title: string; url: string }[];
}

// Original illustration — a simple reading figure, not a licensed cartoon.
function Mascot() {
  return (
    <svg width="140" height="160" viewBox="0 0 140 160" fill="none" aria-hidden>
      <circle cx="70" cy="38" r="26" fill="#1c1917" />
      <rect x="46" y="70" width="48" height="70" rx="18" fill="#9a3324" />
      <rect x="30" y="86" width="20" height="48" rx="10" fill="#1c1917" />
      <rect x="90" y="86" width="20" height="48" rx="10" fill="#1c1917" />
      <circle cx="61" cy="34" r="4" fill="white" />
      <circle cx="79" cy="34" r="4" fill="white" />
      <path d="M60 46q10 8 20 0" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export default function AskPopup() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<AskResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [quoteIndex, setQuoteIndex] = useState(0);

  function close() {
    setOpen(false);
    sessionStorage.setItem(DISMISS_KEY, "1");
  }

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY)) return;
    const timer = setTimeout(() => setOpen(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Auto-skip after 10s, but only while the popup is still untouched —
  // typing a question or viewing a result cancels it.
  useEffect(() => {
    if (!open || question || status !== "idle") return;
    const timer = setTimeout(close, AUTO_SKIP_MS);
    return () => clearTimeout(timer);
  }, [open, question, status]);

  useEffect(() => {
    if (!open) return;
    const timer = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % GITA_QUOTE_COUNT);
    }, QUOTE_ROTATE_MS);
    return () => clearInterval(timer);
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data?.error || "Something went wrong — try again.");
        setStatus("error");
        return;
      }
      setResult(data);
      setStatus("done");
    } catch {
      setErrorMessage("Something went wrong — try again.");
      setStatus("error");
    }
  }

  function askAnother() {
    setQuestion("");
    setResult(null);
    setStatus("idle");
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Ask a question"
      className="fixed inset-0 z-[60] flex flex-col bg-paper"
    >
      <div className="flex justify-end p-5">
        <button
          type="button"
          onClick={close}
          className="font-mono text-sm text-ink-soft transition hover:text-ink"
        >
          Skip →
        </button>
      </div>

      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-6 px-5 pb-20">
        <Mascot />
        <h1 className="font-display text-2xl font-semibold text-ink">Rudra Kasturi</h1>

        {status === "done" && result ? (
          <div className="w-full">
            <p className="rounded-xl border border-line bg-paper p-4 text-sm leading-relaxed text-ink">
              {result.answer}
            </p>
            {(result.blogSources.length > 0 || result.webSources.length > 0) && (
              <div className="mt-4 flex flex-col gap-2">
                {result.blogSources.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/${s.slug}`}
                    className="text-sm text-accent hover:underline"
                  >
                    From the blog: {s.title}
                  </Link>
                ))}
                {result.webSources.map((s) => (
                  <a
                    key={s.url}
                    href={s.url}
                    target="_blank"
                    rel="noopener"
                    className="text-sm text-ink-soft hover:underline"
                  >
                    {s.title}
                  </a>
                ))}
              </div>
            )}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={askAnother}
                className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft transition hover:border-accent hover:text-accent"
              >
                Ask another
              </button>
              <button
                type="button"
                onClick={close}
                className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper transition hover:bg-accent"
              >
                Go to homepage
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex items-center gap-2 rounded-full border border-line px-5 py-3">
              <input
                required
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask about SEO, AEO, or AI search…"
                className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                aria-label="Ask"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-paper transition hover:bg-accent disabled:opacity-60"
              >
                {status === "loading" ? "…" : "→"}
              </button>
            </div>
            {status === "error" && (
              <p className="mt-2 text-center text-xs text-accent">{errorMessage}</p>
            )}
            <p className="mt-6 text-center text-sm italic leading-relaxed text-ink-soft">
              &ldquo;{gitaQuoteForIndex(quoteIndex)}&rdquo;
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
