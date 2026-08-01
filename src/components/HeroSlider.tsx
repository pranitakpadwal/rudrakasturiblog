"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

  return (
    <div
      className="relative border-y border-line"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Link href={`/${slide.slug}`} className="group block py-10 sm:py-14">
        {slide.category && (
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            {slide.category}
          </p>
        )}
        <h2 className="mt-3 max-w-3xl font-display text-2xl font-semibold leading-tight text-ink group-hover:text-accent sm:text-3xl">
          {slide.title}
        </h2>
        {slide.excerpt && (
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">
            {slide.excerpt}
          </p>
        )}
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
