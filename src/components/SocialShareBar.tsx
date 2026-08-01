"use client";

import { useState } from "react";

function shareLinks(url: string, title: string) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  return [
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
      color: "bg-black",
      icon: (
        <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7l-5.5-6.7L4.5 22H1.4l8.1-9.3L1 2h7.2l5 6.1L18.9 2Zm-1.2 18h1.7L6.4 4H4.6l13.1 16Z" />
      ),
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      color: "bg-[#1877f2]",
      icon: (
        <path d="M13.5 22v-8.5H16l.5-3.5h-3V7.8c0-1 .3-1.7 1.8-1.7H16.6V3.1C16.1 3 15 2.9 13.8 2.9c-2.6 0-4.3 1.6-4.3 4.5v2.6H6.9V13.5H9.5V22h4Z" />
      ),
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
      color: "bg-[#0a66c2]",
      icon: (
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21h-4V9Z" />
      ),
    },
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${t}%20${u}`,
      color: "bg-[#25d366]",
      icon: (
        <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1s-.7.8-.9 1c-.2.2-.3.2-.6.1-.2-.1-1-.4-2-1.2-.7-.6-1.2-1.4-1.4-1.6-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.4.1-.2 0-.4 0-.5s-.6-1.5-.8-2c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2s1 2.6 1.1 2.7c.1.2 2 3 4.7 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.4-.3Z" />
      ),
    },
  ];
}

export default function SocialShareBar({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div
      role="region"
      aria-label="Share this article"
      className="flex items-center gap-2 rounded-xl border border-line bg-paper px-4 py-3"
    >
      <span className="mr-1 font-mono text-xs uppercase tracking-wide text-ink-soft">
        Share
      </span>
      {shareLinks(url, title).map((s) => (
        <a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener"
          aria-label={`Share on ${s.name}`}
          className={`flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:brightness-110 ${s.color}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            {s.icon}
          </svg>
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        aria-label="Copy link"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-soft transition hover:border-accent hover:text-accent"
      >
        {copied ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="12" height="12" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
          </svg>
        )}
      </button>
      {copied && <span className="text-xs text-accent">Copied</span>}
    </div>
  );
}
