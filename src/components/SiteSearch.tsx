"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface IndexEntry {
  slug: string;
  title: string;
}

export default function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<IndexEntry[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open || index) return;
    fetch("/api/search-index")
      .then((res) => res.json())
      .then(setIndex)
      .catch(() => setIndex([]));
  }, [open, index]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function close() {
    setOpen(false);
    setQuery("");
  }

  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  const results =
    terms.length === 0
      ? []
      : (index ?? [])
          .map((entry) => {
            const title = entry.title.toLowerCase();
            const score = terms.reduce((sum, t) => sum + (title.includes(t) ? 1 : 0), 0);
            return { entry, score };
          })
          .filter((x) => x.score === terms.length)
          .slice(0, 8)
          .map((x) => x.entry);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition hover:text-accent"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          className="fixed inset-0 z-[70] flex items-start justify-center bg-black/40 p-4 pt-24"
          onClick={close}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-xl border border-line bg-paper p-4 shadow-xl"
          >
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts by title…"
              className="w-full rounded-lg border border-line px-3.5 py-2.5 text-sm text-ink outline-none focus:border-accent"
            />
            {terms.length > 0 && (
              <ul className="mt-3 flex flex-col gap-1">
                {results.length === 0 && index && (
                  <li className="px-2 py-2 text-sm text-ink-soft">No matches.</li>
                )}
                {results.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/${r.slug}`}
                      onClick={close}
                      className="block rounded-md px-2 py-2 text-sm text-ink transition hover:bg-line/40 hover:text-accent"
                    >
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}
