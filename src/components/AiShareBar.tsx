"use client";

import { useState } from "react";

const AI_BUTTONS = [
  { ai: "copilot", label: "Copilot", color: "bg-[#0e64dc]", href: "https://www.bing.com/chat" },
  { ai: "perplexity", label: "Perplexity", color: "bg-black", href: "https://www.perplexity.ai/search" },
  { ai: "chatgpt", label: "ChatGPT", color: "bg-[#10a37f]", href: "https://chatgpt.com" },
  { ai: "deepseek", label: "DeepSeek", color: "bg-[#4b0082]", href: "https://chat.deepseek.com" },
  { ai: "google", label: "Google", color: "bg-[#1a73e8]", href: "https://www.google.com/search" },
  { ai: "grok", label: "Grok", color: "bg-black", href: "https://x.com/i/grok" },
  { ai: "gemini", label: "Gemini", color: "bg-[#1a73e8]", href: "https://gemini.google.com/app" },
] as const;

function buildPrompt(url: string): string {
  return (
    "Summarize this article in simple English in 150-200 words.\n" +
    "Give 3 key takeaways and 2 action points.\n" +
    "URL: " + url
  );
}

export default function AiShareBar({ url }: { url: string }) {
  const [copiedFor, setCopiedFor] = useState<string | null>(null);

  async function handleClick(ai: string, href: string) {
    const prompt = buildPrompt(url);

    // Copy first, *then* open — opening a new tab moves focus away from
    // this document, and clipboard writes silently fail once focus is
    // gone. Doing it in this order is what actually gets the URL across.
    let copied = false;
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(prompt);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (copied) {
      setCopiedFor(ai);
      setTimeout(() => setCopiedFor((current) => (current === ai ? null : current)), 2500);
    }

    window.open(href, "_blank", "noopener");
  }

  return (
    <div
      role="region"
      aria-label="Open in AI to summarize"
      className="flex flex-wrap items-center gap-2 rounded-xl border border-line bg-paper px-4 py-3"
    >
      <span className="mr-1 font-mono text-xs uppercase tracking-wide text-ink-soft">
        Ask AI
      </span>
      {AI_BUTTONS.map((btn) => (
        <button
          key={btn.ai}
          type="button"
          onClick={() => handleClick(btn.ai, btn.href)}
          className={`relative rounded-md px-3 py-1.5 text-sm font-semibold text-white transition hover:brightness-110 ${btn.color}`}
        >
          {copiedFor === btn.ai ? "Copied ✓" : btn.label}
        </button>
      ))}
      <span className="basis-full text-xs text-ink-soft">
        Copies a ready-to-paste summary prompt (with this article&apos;s link) to your clipboard, then opens the AI in a new tab.
      </span>
    </div>
  );
}
