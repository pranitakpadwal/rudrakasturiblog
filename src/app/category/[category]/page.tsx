import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllCategories,
  getPostsByCategory,
  categorySlug,
  categoryColor,
  readingTime,
  formatDateIST,
} from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";

const SITE_URL = "https://blog.rudrakasturi.com";

export async function generateStaticParams() {
  return getAllCategories().map((c) => ({ category: categorySlug(c) }));
}

function resolveCategory(slug: string): string | undefined {
  return getAllCategories().find((c) => categorySlug(c) === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const name = resolveCategory(category);
  if (!name) return {};

  const description = `Posts about ${name} from Rudra Kasturi — Search. Strategy. AI. Growth.`;
  const url = `${SITE_URL}/category/${category}`;

  return {
    title: name,
    description,
    alternates: { canonical: `/category/${category}` },
    openGraph: {
      title: `${name} | Rudra Kasturi`,
      description,
      url,
      siteName: "Rudra Kasturi",
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary",
      site: "@kasturitagore",
      title: `${name} | Rudra Kasturi`,
      description,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const name = resolveCategory(category);
  if (!name) notFound();

  const posts = getPostsByCategory(name);
  const url = `${SITE_URL}/category/${category}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, item: { "@id": SITE_URL, name: "Rudra Kasturi" } },
          { "@type": "ListItem", position: 2, item: { "@id": url, name } },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${url}#content`,
        url,
        name,
        description: `Posts about ${name} from Rudra Kasturi.`,
        isPartOf: { "@type": "WebSite", url: SITE_URL, name: "Rudra Kasturi" },
        hasPart: posts.slice(0, 20).map((post) => ({
          "@type": "BlogPosting",
          headline: post.title,
          url: `${SITE_URL}/${post.slug}`,
          datePublished: post.date,
        })),
      },
    ],
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: name }]} />
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">
        Category
      </p>
      <h1 className="font-display text-4xl font-semibold text-ink">{name}</h1>
      <p className="mt-3 text-ink-soft">{posts.length} posts</p>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/${post.slug}`}
            style={{ borderLeftColor: categoryColor(name) }}
            className="group block rounded-md border border-line border-l-4 bg-paper p-4 transition hover:shadow-sm"
          >
            <h3 className="font-display text-base font-semibold leading-snug text-ink group-hover:text-accent">
              {post.title}
            </h3>
            <p className="mt-2 text-sm text-ink-soft">
              {formatDateIST(post.date)} · {readingTime(post.content_md)} min read
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
