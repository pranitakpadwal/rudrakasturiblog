import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllCategories, getPostsByCategory, categorySlug } from "@/lib/content";
import CategoryPageView, { CATEGORY_PAGE_SIZE } from "@/components/CategoryPageView";

function resolveCategory(slug: string): string | undefined {
  return getAllCategories().find((c) => categorySlug(c) === slug);
}

export async function generateStaticParams() {
  return getAllCategories().flatMap((c) => {
    const total = getPostsByCategory(c).length;
    const totalPages = Math.max(1, Math.ceil(total / CATEGORY_PAGE_SIZE));
    return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
      category: categorySlug(c),
      page: String(i + 2),
    }));
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; page: string }>;
}): Promise<Metadata> {
  const { category, page } = await params;
  const name = resolveCategory(category);
  if (!name) return {};

  const description = `Posts about ${name} from Rudra Kasturi: Search. Strategy. AI. Growth.`;

  return {
    title: `${name}: page ${page}`,
    description,
    alternates: { canonical: `/category/${category}/page/${page}` },
  };
}

export default async function CategoryPagedPage({
  params,
}: {
  params: Promise<{ category: string; page: string }>;
}) {
  const { category, page: pageParam } = await params;
  const name = resolveCategory(category);
  if (!name) notFound();

  const page = Number(pageParam);
  if (!Number.isInteger(page) || page < 2) notFound();

  const allPosts = getPostsByCategory(name);
  const totalPages = Math.max(1, Math.ceil(allPosts.length / CATEGORY_PAGE_SIZE));
  if (page > totalPages) notFound();

  const start = (page - 1) * CATEGORY_PAGE_SIZE;
  const posts = allPosts.slice(start, start + CATEGORY_PAGE_SIZE);

  return (
    <CategoryPageView
      name={name}
      posts={posts}
      total={allPosts.length}
      page={page}
      totalPages={totalPages}
    />
  );
}
