import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllSlugs,
  getPageBySlug,
  getPostBySlug,
  categorySlug,
  readingTime,
} from "@/lib/content";
import PostBanner from "@/components/PostBanner";
import MarkdownContent from "@/components/MarkdownContent";
import AiShareBar from "@/components/AiShareBar";

const SITE_URL = "https://blog.rudrakasturi.com";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

async function resolveContent(slug: string) {
  return getPostBySlug(slug) ?? getPageBySlug(slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await resolveContent(slug);
  if (!item) return {};

  const description =
    item.excerpt || item.content_md.slice(0, 160).replace(/\n/g, " ");

  return {
    title: item.title,
    description,
    alternates: { canonical: `/${item.slug}` },
    openGraph: {
      title: item.title,
      description,
      url: `${SITE_URL}/${item.slug}`,
      siteName: "Rudra Kasturi",
      type: "article",
      publishedTime: item.date,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      site: "@kasturitagore",
      title: item.title,
      description,
    },
  };
}

export default async function ContentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await resolveContent(slug);

  if (!item) notFound();

  const isPost = Boolean(getPostBySlug(slug));
  const url = `${SITE_URL}/${item.slug}`;
  const description =
    item.excerpt || item.content_md.slice(0, 160).replace(/\n/g, " ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, item: { "@id": SITE_URL, name: "Rudra Kasturi" } },
          { "@type": "ListItem", position: 2, item: { "@id": url, name: item.title } },
        ],
      },
      {
        "@type": isPost ? "BlogPosting" : "WebPage",
        "@id": `${url}#content`,
        url,
        headline: item.title,
        name: item.title,
        description,
        ...(isPost && {
          datePublished: item.date,
          dateModified: item.date,
          articleSection: item.categories[0],
          author: { "@type": "Person", name: "Rudra Kasturi", url: SITE_URL },
          publisher: { "@type": "Organization", name: "Rudra Kasturi", url: SITE_URL },
        }),
      },
    ],
  };

  return (
    <article className="mx-auto max-w-2xl px-5 py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {isPost && item.categories.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {item.categories.map((c) => (
            <Link
              key={c}
              href={`/category/${categorySlug(c)}`}
              className="rounded-full border border-line px-3 py-1 font-mono text-xs uppercase tracking-wide text-ink-soft transition hover:border-accent hover:text-accent"
            >
              {c}
            </Link>
          ))}
        </div>
      )}

      <h1 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
        {item.title}
      </h1>

      {isPost && (
        <p className="mt-4 font-mono text-sm text-ink-soft">
          {new Date(item.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {" · "}
          {readingTime(item.content_md)} min read
        </p>
      )}

      <div className="my-8">
        <PostBanner title={item.title} slug={item.slug} category={item.categories[0]} />
      </div>

      {isPost && <AiShareBar url={url} />}

      <div className="mt-8">
        <MarkdownContent content={item.content_md} />
      </div>

      <div className="mt-16 border-t border-line pt-8">
        <Link
          href="/archive"
          className="font-mono text-sm text-ink-soft transition hover:text-accent"
        >
          ← Back to all writing
        </Link>
      </div>
    </article>
  );
}
