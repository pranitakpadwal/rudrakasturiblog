import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllSlugs,
  getPageBySlug,
  getPostBySlug,
} from "@/lib/content";
import PostBanner from "@/components/PostBanner";
import MarkdownContent from "@/components/MarkdownContent";

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
      type: "article",
      publishedTime: item.date,
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

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
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
      <div className="mt-8">
        <MarkdownContent content={item.content_md} />
      </div>
    </article>
  );
}
