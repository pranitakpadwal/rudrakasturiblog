import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllSlugs,
  getPageBySlug,
  getPostBySlug,
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
    <article className="mx-auto max-w-3xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostBanner title={item.title} slug={item.slug} />
      <h1 className="mt-8 text-3xl font-bold tracking-tight">{item.title}</h1>
      {isPost && (
        <p className="mt-2 text-sm text-neutral-500">
          {new Date(item.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {item.categories.length > 0 && ` · ${item.categories.join(", ")}`}
        </p>
      )}
      {isPost && (
        <div className="mt-6">
          <AiShareBar url={url} />
        </div>
      )}
      <div className="mt-8">
        <MarkdownContent content={item.content_md} />
      </div>
    </article>
  );
}
