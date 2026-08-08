"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { categoryColor } from "@/lib/palette";

export interface SlideItem {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
}

export default function HeroSlider({ slides }: { slides: SlideItem[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  if (slides.length === 0) return null;

  const slide = slides[index];
  const accent = categoryColor(slide.category);

  return (
    <div
      className="relative border-y border-line"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Link
        href={`/${slide.slug}`}
        className="group grid gap-6 py-10 sm:grid-cols-[1fr_240px] sm:items-center sm:py-14"
      >
        <div>
          {slide.category && (
            <p
              className="font-mono text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: accent }}
            >
              {slide.category}
            </p>
          )}
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold leading-[1.05] tracking-tight text-ink group-hover:text-accent sm:text-4xl md:text-5xl">
            {slide.title}
          </h2>
          {slide.excerpt && (
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">
              {slide.excerpt}
            </p>
          )}
        </div>
        <div
          className="relative order-first aspect-[16/10] w-full overflow-hidden rounded-lg transition group-hover:brightness-110 sm:order-last"
          style={{ background: accent }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='90'%3E%3Ccircle cx='1' cy='1' r='1' fill='white'/%3E%3C/svg%3E\")",
            }}
          />
        </div>
      </Link>

      {slides.length > 1 && (
        <div className="flex items-center gap-4 pb-6">
          <button
            type="button"
            aria-label="Previous story"
            onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-soft transition hover:border-accent hover:text-accent"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next story"
            onClick={() => setIndex((i) => (i + 1) % slides.length)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-soft transition hover:border-accent hover:text-accent"
          >
            ›
          </button>
          <div className="flex gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.slug}
                type="button"
                aria-label={`Go to story ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-accent" : "w-1.5 bg-line"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
