import type { MetadataRoute } from "next";
import { getAllCategories, getAllPages, getAllPosts, categorySlug } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://blog.rudrakasturi.com";

  const posts = getAllPosts().map((post) => ({
    url: `${base}/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  const pages = getAllPages().map((page) => ({
    url: `${base}/${page.slug}`,
    lastModified: new Date(page.date),
  }));

  const categories = getAllCategories().map((category) => ({
    url: `${base}/category/${categorySlug(category)}`,
    lastModified: new Date(),
  }));

  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/archive`, lastModified: new Date() },
    ...posts,
    ...pages,
    ...categories,
  ];
}
