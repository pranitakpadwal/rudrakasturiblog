import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllCategories, getPostsByCategory, categorySlug } from "@/lib/content";
import CategoryPageView, { CATEGORY_PAGE_SIZE } from "@/components/CategoryPageView";

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

  const allPosts = getPostsByCategory(name);
  const totalPages = Math.max(1, Math.ceil(allPosts.length / CATEGORY_PAGE_SIZE));
  const posts = allPosts.slice(0, CATEGORY_PAGE_SIZE);
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
        hasPart: posts.map((post) => ({
          "@type": "BlogPosting",
          headline: post.title,
          url: `${SITE_URL}/${post.slug}`,
          datePublished: post.date,
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CategoryPageView
        name={name}
        posts={posts}
        total={allPosts.length}
        page={1}
        totalPages={totalPages}
      />
    </>
  );
}
