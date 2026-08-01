"use client";

import { useState } from "react";

// Only Perplexity and Google reliably accept a pre-filled query via URL —
// that's a real, documented `?q=` param on their search endpoints, so
// clicking those genuinely lands the reader on a page that already has
// the article's summary request loaded.
//
// ChatGPT, Gemini, Grok, Copilot, and DeepSeek do not expose any public
// way to prefill their chat box from a URL — no website can do that, it's
// a platform limitation, not a bug here. For those, the best a page can
// do is copy the prompt and let the reader paste it themselves.
const DEEP_LINK_AI = new Set(["perplexity", "google"]);

const AI_BUTTONS = [
  { ai: "perplexity", label: "Perplexity", color: "bg-black", href: "https://www.perplexity.ai/search" },
  { ai: "google", label: "Google", color: "bg-[#1a73e8]", href: "https://www.google.com/search" },
  { ai: "chatgpt", label: "ChatGPT", color: "bg-[#10a37f]", href: "https://chatgpt.com" },
  { ai: "gemini", label: "Gemini", color: "bg-[#1a73e8]", href: "https://gemini.google.com/app" },
  { ai: "copilot", label: "Copilot", color: "bg-[#0e64dc]", href: "https://copilot.microsoft.com" },
  { ai: "deepseek", label: "DeepSeek", color: "bg-[#4b0082]", href: "https://chat.deepseek.com" },
  { ai: "grok", label: "Grok", color: "bg-black", href: "https://x.com/i/grok" },
] as const;

function buildPrompt(url: string): string {
  return (
    "Summarize this article in simple English in 150-200 words.\n" +
    "Give 3 key takeaways and 2 action points.\n" +
    "URL: " + url
  );
}

export default function AiShareBar({ url }: { url: string }) {
  const [status, setStatus] = useState<{ ai: string; ok: boolean } | null>(null);

  async function handleClick(ai: string, href: string) {
    const prompt = buildPrompt(url);

    if (DEEP_LINK_AI.has(ai)) {
      // These genuinely accept the query — send the reader straight to a
      // page that already has the article loaded, no clipboard needed.
      window.open(`${href}?q=${encodeURIComponent(prompt)}`, "_blank", "noopener");
      return;
    }

    // Copy first, *then* open — opening a new tab moves focus away from
    // this document, and clipboard writes silently fail once focus is
    // gone. Doing it in this order is what actually gets the prompt across.
    let copied = false;
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(prompt);
        copied = true;
      } catch {
        copied = false;
      }
    }

    setStatus({ ai, ok: copied });
    setTimeout(() => setStatus((current) => (current?.ai === ai ? null : current)), 3000);

    window.open(href, "_blank", "noopener");
  }

  return (
    <div
      role="region"
      aria-label="Open in AI to summarize"
      className="rounded-xl border border-line bg-paper px-4 py-3"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-mono text-xs uppercase tracking-wide text-ink-soft">Ask AI</span>
        {status && (
          <span className="text-xs text-accent">
            {status.ok ? "Prompt copied — paste it in the chat" : "Couldn't copy — select the link manually"}
          </span>
        )}
      </div>
      <div className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1">
        {AI_BUTTONS.map((btn) => (
          <button
            key={btn.ai}
            type="button"
            onClick={() => handleClick(btn.ai, btn.href)}
            className={`shrink-0 snap-start whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-semibold text-white transition hover:brightness-110 ${btn.color}`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
