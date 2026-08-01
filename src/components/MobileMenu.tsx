"use client";

import { useState } from "react";
import Link from "next/link";
import { categorySlug } from "@/lib/content";

export default function MobileMenu({ categories }: { categories: string[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink"
      >
        {open ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M1 1L15 15M15 1L1 15" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M1 3H15M1 8H15M1 13H15" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        )}
      </button>

      {open && (
        <nav className="absolute inset-x-0 top-full border-b border-line bg-paper px-5 py-4 shadow-sm">
          <ul className="flex flex-col divide-y divide-line">
            {categories.map((c) => (
              <li key={c}>
                <Link
                  href={`/category/${categorySlug(c)}`}
                  onClick={() => setOpen(false)}
                  className="block py-2.5 text-sm text-ink"
                >
                  {c}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/archive"
                onClick={() => setOpen(false)}
                className="block py-2.5 text-sm text-ink"
              >
                Archive
              </Link>
            </li>
            <li>
              <Link
                href="/about-rudra-kasturi"
                onClick={() => setOpen(false)}
                className="block py-2.5 text-sm text-ink"
              >
                About
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
