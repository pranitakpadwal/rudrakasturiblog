"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface NextArticle {
  slug: string;
  title: string;
  category: string;
  date: string;
  readingTimeMin: number;
  contentMd: string;
}

const MAX_CHAIN = 6;

export default function ContinuousReader({ startSlug }: { startSlug: string }) {
  const [articles, setArticles] = useState<NextArticle[]>([]);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const originalTitle = useRef<string>("");

  useEffect(() => {
    originalTitle.current = document.title;
    return () => {
      document.title = originalTitle.current;
    };
  }, []);

  const loadNext = useCallback(async () => {
    setLoading(true);
    const lastSlug = articles.length ? articles[articles.length - 1].slug : startSlug;
    const exclude = [startSlug, ...articles.map((a) => a.slug)].join(",");

    try {
      const res = await fetch(`/api/next-article/${lastSlug}?exclude=${exclude}`);
      const data = await res.json();
      if (data.done) {
        setDone(true);
      } else {
        setArticles((prev) => [...prev, data]);
      }
    } finally {
      setLoading(false);
    }
  }, [articles, startSlug]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || done || loading || articles.length >= MAX_CHAIN) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadNext();
      },
      { rootMargin: "800px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [articles.length, done, loading, loadNext]);

  function onArticleVisible(article: NextArticle) {
    if (window.location.pathname === `/${article.slug}`) return;
    document.title = `${article.title} | Rudra Kasturi`;
    window.history.pushState({ slug: article.slug }, "", `/${article.slug}`);
  }

  return (
    <div>
      {articles.map((article) => (
        <ArticleBlock key={article.slug} article={article} onVisible={onArticleVisible} />
      ))}

      {!done && articles.length < MAX_CHAIN && (
        <div ref={sentinelRef} className="flex justify-center py-10">
          <span className="font-mono text-xs text-ink-soft">
            {loading ? "Loading next article…" : ""}
          </span>
        </div>
      )}

      {(done || articles.length >= MAX_CHAIN) && (
        <div className="flex justify-center border-t border-line py-10">
          <Link
            href="/archive"
            className="rounded-full border border-line px-5 py-2 text-sm text-ink-soft transition hover:border-accent hover:text-accent"
          >
            Browse the full archive →
          </Link>
        </div>
      )}
    </div>
  );
}

function ArticleBlock({
  article,
  onVisible,
}: {
  article: NextArticle;
  onVisible: (article: NextArticle) => void;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onVisible(article);
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article.slug]);

  return (
    <article ref={ref} className="mt-16 max-w-2xl border-t border-line pt-12">
      {article.category && (
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          {article.category}
        </p>
      )}
      <a href={`/${article.slug}`} className="hover:text-accent">
        <h2 className="font-display text-2xl font-semibold leading-tight text-ink sm:text-3xl">
          {article.title}
        </h2>
      </a>
      <p className="mt-3 border-b border-line pb-5 font-mono text-sm text-ink-soft">
        {article.date} · {article.readingTimeMin} min read
      </p>
      <div className="prose prose-neutral mt-8 max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.contentMd}</ReactMarkdown>
      </div>
    </article>
  );
}
