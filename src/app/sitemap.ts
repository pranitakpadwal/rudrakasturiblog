import type { MetadataRoute } from "next";
import { getAllPages, getAllPosts } from "@/lib/content";

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

  return [{ url: base, lastModified: new Date() }, ...posts, ...pages];
}
