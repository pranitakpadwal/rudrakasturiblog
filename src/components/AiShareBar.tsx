"use client";

const AI_BUTTONS = [
  { ai: "copilot", label: "Copilot", color: "bg-[#0e64dc]" },
  { ai: "perplexity", label: "Perplexity", color: "bg-black" },
  { ai: "chatgpt", label: "ChatGPT", color: "bg-[#10a37f]" },
  { ai: "deepseek", label: "DeepSeek", color: "bg-[#4b0082]" },
  { ai: "google", label: "Google", color: "bg-[#1a73e8]" },
  { ai: "grok", label: "Grok", color: "bg-black" },
  { ai: "gemini", label: "Gemini", color: "bg-[#1a73e8]" },
] as const;

function buildPrompt(url: string): string {
  return (
    "Summarize this article in simple English in 150-200 words.\n" +
    "Give 3 key takeaways and 2 action points.\n" +
    "URL: " + url
  );
}

function urlFor(ai: string, url: string): string | null {
  const prompt = encodeURIComponent(buildPrompt(url));

  switch (ai) {
    case "copilot":
      return "https://www.bing.com/chat?q=" + prompt + "&sendquery=1";
    case "perplexity":
      return "https://www.perplexity.ai/search?q=" + prompt;
    case "deepseek":
      return "https://chat.deepseek.com/search?q=" + prompt;
    case "google":
      return (
        "https://www.google.com/search?q=" +
        encodeURIComponent("Summarize this URL: " + url)
      );
    case "chatgpt":
      if (navigator.clipboard) {
        navigator.clipboard.writeText(buildPrompt(url)).catch(() => {});
      }
      return "https://chatgpt.com";
    case "gemini":
      if (navigator.clipboard) {
        navigator.clipboard.writeText(buildPrompt(url)).catch(() => {});
      }
      return "https://gemini.google.com/app";
    case "grok":
      if (navigator.clipboard) {
        navigator.clipboard.writeText(buildPrompt(url)).catch(() => {});
      }
      return "https://x.com/i/grok";
    default:
      return null;
  }
}

export default function AiShareBar({ url }: { url: string }) {
  return (
    <div
      role="region"
      aria-label="Open in AI to summarize"
      className="mb-8 flex flex-wrap items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3"
    >
      <span className="mr-1 text-sm font-bold">Ask AI</span>
      {AI_BUTTONS.map((btn) => (
        <a
          key={btn.ai}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            const out = urlFor(btn.ai, url);
            if (out) window.open(out, "_blank", "noopener");
          }}
          className={`rounded-md px-3 py-1.5 text-sm font-semibold text-white transition hover:brightness-110 ${btn.color}`}
        >
          {btn.label}
        </a>
      ))}
    </div>
  );
}
